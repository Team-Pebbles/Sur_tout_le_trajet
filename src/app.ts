import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  ShaderMaterial,
  HtmlElementTexture,
  ThinEngine,
  Camera,
  Vector2,
} from "@babylonjs/core"

import { Midi } from "./midi"
import { CesiumViewer } from "./cesiumViewer"
import { InputManager } from "./inputManager"

class App {
  constructor() {
    // create the canvas html element and attach it to the webpage
    const canvas = document.createElement("canvas")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.id = "gameCanvas"
    document.body.appendChild(canvas)

    // initialize babylon scene and engine
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    const inputs = new InputManager(scene, engine)

    let camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(canvas, true)

    let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene)

    let mapCanvasTexture = this.addMapCanvas(scene)

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide()
        } else {
          scene.debugLayer.show()
        }
      }
    })

    scene.registerBeforeRender(() => {
      inputs.registerBeforeRender()
    })

    // run the main render loop
    engine.runRenderLoop(() => {
      if (mapCanvasTexture !== null && mapCanvasTexture !== undefined) {
        mapCanvasTexture.update()
      }
      scene.render()
    })

    new CesiumViewer(inputs)
    new Midi()
  }

  addMapCanvas(scene) {
    if (scene.activeCameras.length === 0) {
      scene.activeCameras.push(scene.activeCamera)
    }

    let size = { x: window.innerWidth, y: window.innerHeight }

    var secondCamera = new FreeCamera("mapCanvasCamera", new Vector3(0, 0, -50), scene)
    secondCamera.mode = Camera.ORTHOGRAPHIC_CAMERA
    secondCamera.layerMask = 0x20000000
    scene.activeCameras.push(secondCamera)

    let plane: Mesh = MeshBuilder.CreatePlane("plane", { width: size.x, height: size.y }, scene)

    let shaderMaterial = new ShaderMaterial("shader", scene, "./stream", {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time"],
    })
    shaderMaterial.setVector2("u_resolution", new Vector2(window.innerWidth, window.innerHeight))
    let mapCanvas: any = document.getElementById("cesiumCanvas")
    if (mapCanvas == null && mapCanvas == undefined) return

    let e = new ThinEngine(mapCanvas)

    let mapCanvasTexture = new HtmlElementTexture("mapCanvas", mapCanvas, {
      scene: scene,
      engine: scene.getEngine(),
    })

    plane.name = "planeMapCanvas"
    plane.layerMask = 0x20000000
    plane.freezeWorldMatrix()

    shaderMaterial.setTexture("textureSampler", mapCanvasTexture)
    plane.material = shaderMaterial

    return mapCanvasTexture
  }
}
new App()

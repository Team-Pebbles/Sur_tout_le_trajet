import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight } from "@babylonjs/core"

import { Midi } from "./inputs/midi"
import { CesiumViewer } from "./cesiumViewer"
import { InputManager } from "./inputs/inputManager"
import { MapCanvas } from "./scenes/mapCanvas"
import { ScenePostProcess } from "./scenes/scenePostProcess"

class App {
  private scene: Scene
  private inputs: InputManager
  private engine: Engine
  private mapCanvas: MapCanvas
  private canvas: HTMLCanvasElement
  constructor() {
    // create the canvas html element and attach it to the webpage
    this.canvas = document.createElement("canvas")
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.id = "gameCanvas"
    document.body.appendChild(this.canvas)
    
    // initialize babylon scene and engine
    this.engine = new Engine(this.canvas, true)
    this.scene = new Scene(this.engine)
    
    // INPUT MANAGER
    this.inputs = new InputManager(this.scene)
    new Midi()
    // CESIUM VIEWER
    new CesiumViewer()
    // SETUP SCENE
    this.cameras()
    this.lights()
    this.mapCanvas = new MapCanvas(this.scene)
    new ScenePostProcess(this.mapCanvas.camera)
    //RENDER
    this.rendering()
    // dev things
    this.debug()
    this.canvas.focus()
  }

  cameras() {
    let camera: FreeCamera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(this.canvas, true)
  }

  lights() {
    let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene)
  }

  rendering() {
    // this.scene.registerBeforeRender(() => {
    //  // this.inputs.registerBeforeRender()
    // })

    // run the main render loop
    this.engine.runRenderLoop(() => {
      this.mapCanvas.update()
      this.scene.render()
    })
  }

  debug() {
    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (this.scene.debugLayer.isVisible()) {
          this.scene.debugLayer.hide()
        } else {
          this.scene.debugLayer.show()
        }
      }
    })
  }
}
new App()

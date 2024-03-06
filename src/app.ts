import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import { Engine, Scene, FreeCamera, Vector3 } from "@babylonjs/core"

import { AudioAnalyser } from "./audio/audioAnalyser"
import { CesiumViewer } from "./cesiumViewer"
import { InputManager } from "./inputs/inputManager"
import { MapCanvas } from "./scenes/mapCanvas"
import { ScenePostProcess } from "./scenes/scenePostProcess"

class App {
  static scene: Scene
  static inputs: InputManager
  static audio: AudioAnalyser
  static engine: Engine
  static mapCanvas: MapCanvas
  static canvas: HTMLCanvasElement
  constructor() {}

  public static async build(): Promise<App> {
    // create the canvas html element and attach it to the webpage
    this.canvas = document.createElement("canvas")
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.id = "gameCanvas"
    document.body.appendChild(this.canvas)

    // initialize babylon scene and engine
    this.engine = new Engine(this.canvas, true)
    this.scene = new Scene(this.engine)
    this.inputs = new InputManager(this.scene)
    this.audio = new AudioAnalyser(this.scene, true)
    // CESIUM VIEWER
    await CesiumViewer.build()
    // SETUP SCENE
    this.cameras()
    this.mapCanvas = new MapCanvas(this.scene)
    new ScenePostProcess(this.mapCanvas.camera)
    //RENDER
    this.rendering()
    // dev things
    this.debug()
    this.canvas.focus()

    return new App()
  }

  static cameras() {
    let camera: FreeCamera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControl(this.canvas, true)
  }

  static rendering() {
    this.scene.registerBeforeRender(() => {
      this.audio.registerBeforeRender()
    })

    // run the main render loop
    this.engine.runRenderLoop(() => {
      this.inputs.update()
      this.mapCanvas.update()
      this.scene.render()
    })
  }

  static debug() {
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

App.build()

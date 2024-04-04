import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/inspector"
import "@babylonjs/loaders/glTF"
import { Engine, Scene, FreeCamera, Vector3, Camera } from "@babylonjs/core"

import { AudioAnalyser } from "./audio/audioAnalyser"
import { CesiumViewer } from "./cesiumViewer"
import { InputManager } from "./inputs/inputManager"
import { CesiumPlane } from "./scenes/cesiumPlane"
import { PostProcessing } from "./scenes/postProcessing"
import { Canvas2D } from "./scenes/canvas2D"
import { Texts } from "./text"

class App {
  scene: Scene
  inputs: InputManager
  audio: AudioAnalyser
  engine: Engine

  cesiumViewer: CesiumViewer
  cesiumPlane: CesiumPlane
  canvas2D: Canvas2D

  texts: Texts

  canvas: HTMLCanvasElement

  private constructor() {}

  static build(){
    return new App().init();
  }

  private async init(){
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
    this.audio = new AudioAnalyser(this.scene, false)

    this.cameras();

    this.canvas2D = new Canvas2D(this.scene);
    
    this.cesiumViewer = await CesiumViewer.build();
    this.cesiumPlane = new CesiumPlane(this.scene, this.cesiumViewer, this.canvas2D);
    
    this.texts = new Texts(this.canvas2D, this.cesiumViewer)

    if(this.scene.activeCamera) new PostProcessing(this.scene.activeCamera, this.canvas2D);
    
    //RENDER
    this.rendering()
    // dev things
    this.debug()
    this.canvas.focus()
    return this;
  }

  cameras() {
    const camera : FreeCamera = new FreeCamera("MainCamera", new Vector3(0, 0, -50), this.scene)
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA
    camera.layerMask = 0x20000000
    this.scene.activeCameras?.push(camera);
  }

  rendering() {
    this.scene.registerBeforeRender(() => {
      this.audio.registerBeforeRender()
    })

    // run the main render loop
    this.engine.runRenderLoop(() => {
        this.inputs.update()
        this.cesiumPlane.update()
        this.texts.render()

    //   this.canvas2D.draw();
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

App.build();

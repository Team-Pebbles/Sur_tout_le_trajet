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
import { Inputs } from "./inputs/inputs"

class App {
  scene: Scene
  inputs: InputManager
  audio: AudioAnalyser
  engine: Engine

  cesiumViewer: CesiumViewer
  cesiumPlane: CesiumPlane
  canvas2D: Canvas2D

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
      if (Inputs.values.DRAW_TITLE.once) {
          // this.displayTitle();
          // this.displayCredits();
          // this.canvas2D.drawText("emphasis", ["Vides."], "center", 100, 5000);
          // this.canvas2D.drawText("emphasis", ["Seule."], "center", 100, 5000);
          // this.canvas2D.drawText("emphasis", ["Car ici, on est nulle part"], "center", 100, 5000);
        this.canvas2D.drawText("emphasis", ["mon corps", "est monde"], "left", 100, 5000);
        this.cesiumViewer.mapSwitch();
          // this.canvas2D.drawText("emphasis", ["L’ailleurs"], "center", 100, 5000);
          // this.canvas2D.drawText("emphasis", ["Je ne crois pas en la réalité."], "center", 100, 5000);
          // this.canvas2D.drawText("emphasis", ["C'est un plagiat du monde,"], "center", 100, 5000);
          // this.canvas2D.drawText("emphasis", ["qui êtes-vous ?"], "center", 100, 5000);
          // this.canvas2D.drawText("emphasis", ["Vous m'avez sortie du rêve"], "center", 100, 5000);
          // this.canvas2D.drawText("emphasis", ["Vous êtes réel."], "center", 100, 5000);

        }
        

    //   this.canvas2D.draw();
        this.scene.render()
    })
  }

  displayTitle() {
    this.canvas2D.drawImage('title','./img/logo-white.png',5000);
  }

  displayCredits() {
    this.canvas2D.drawText("credits", ["&GUENILLE , &ROB À FLEURS 🌸, &RRRRROSE AZERTY"], "right", 32, 5000);
    setTimeout(() => {
      this.canvas2D.drawText("credits", ["D'après une idée de Pier-re"], "right", 32, 5000);
      setTimeout(() => {
        this.canvas2D.drawText("credits", ["Et avec l'aide de Louis pour le code !", "coucou Louis"], "right",32,5000);
      }, 5000);
    }, 5000);
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

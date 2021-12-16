import {
  Viewer,
  Ion,
  MapboxImageryProvider,
  createWorldTerrain,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian3,
} from "cesium"
import { InputManager } from "./inputManager"
import { IACesiumCamera } from "./inputActions"

export class CesiumViewer {
  private viewer: Viewer
  private handler: ScreenSpaceEventHandler
  private viewerCanvas: HTMLCanvasElement | null
  private inputManager: InputManager

  constructor(inputManager: InputManager) {
    this.inputManager = inputManager
    //console.log(IACesiumCamera.FORWARD)
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTJjZTMzZC1kNjU5LTRjMWEtODQzZi1iNTUyNjE5MDJmMWUiLCJpZCI6NDkzLCJpYXQiOjE1MjUyNTQzODh9.2v8b1Vel8pp-AYQELIBwu5q7lE75yXPsXQrhppADDlw"

    var worldTerrain = createWorldTerrain({
      requestWaterMask: true,
      // requestVertexNormals: true,
    })

    this.viewer = new Viewer("cesiumContainer", {
      imageryProvider: new MapboxImageryProvider({
        url: "https://api.mapbox.com/v4/",
        mapId: "mapbox.satellite",
        accessToken:
          "pk.eyJ1IjoiaWNoYmlucm9iIiwiYSI6ImNqZGtrbHYzMDAxbGUzM254ODY3MXA1dm4ifQ.2-TYG46620MlH6XmwYs4Jw",
      }),
      terrainProvider: worldTerrain,
      scene3DOnly: true,
      selectionIndicator: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      homeButton: false,
      geocoder: false,
      // requestRenderMode : true,
      // maximumRenderTimeChange : Infinity
    })
    this.viewer.scene.globe.depthTestAgainstTerrain = true
    this.viewer.scene.globe.enableLighting = true

    this.viewerCanvas = this.viewer.canvas
    this.viewerCanvas.id = "cesiumCanvas"
    this.handler = new ScreenSpaceEventHandler(this.viewerCanvas)
    this.controller()
  }

  controller() {
    var scene = this.viewer.scene
    var canvas = this.viewer.canvas

    canvas.setAttribute("tabindex", "0") // needed to put focus on the canvas
    canvas.onclick = function () {
      canvas.focus()
    }

    var ellipsoid = this.viewer.scene.globe.ellipsoid

    // disable the default event handlers
    scene.screenSpaceCameraController.enableRotate = false
    scene.screenSpaceCameraController.enableTranslate = false
    scene.screenSpaceCameraController.enableZoom = false
    scene.screenSpaceCameraController.enableTilt = false
    scene.screenSpaceCameraController.enableLook = false

    var startMousePosition
    var mousePosition
    var looking = false

    this.handler.setInputAction(function (movement) {
      looking = true
      mousePosition = startMousePosition = Cartesian3.clone(movement.position)
    }, ScreenSpaceEventType.LEFT_DOWN)

    this.handler.setInputAction(function (movement) {
      // scene.requestRender();
      mousePosition = movement.endPosition
    }, ScreenSpaceEventType.MOUSE_MOVE)

    this.handler.setInputAction(function (position) {
      looking = false
    }, ScreenSpaceEventType.LEFT_UP)

    this.viewer.clock.onTick.addEventListener((clock) => {
      // OLD CONTROLLER
      let camera = this.viewer.camera

      if (looking) {
        let width = canvas.clientWidth
        let height = canvas.clientHeight

        // Coordinate (0.0, 0.0) will be where the mouse was clicked.
        let x = (mousePosition.x - startMousePosition.x) / width
        let y = -(mousePosition.y - startMousePosition.y) / height

        let lookFactor = 0.05
        camera.lookRight(x * lookFactor)
        camera.lookUp(y * lookFactor)
      }

      // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
      let cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height
      let moveRate = cameraHeight / 100.0

      // // Z
      if (IACesiumCamera.FORWARD) {
        camera.moveForward(moveRate)
        //document.getElementById('audioDDerive').play();
      }
      // S
      if (IACesiumCamera.BACKWARD) {
        camera.moveBackward(moveRate)
        //document.getElementById('audioDDerive').play();
      }

      // A
      if (IACesiumCamera.UP) {
        camera.moveUp(moveRate)
        //document.getElementById('audioDLeftRight').play();
      }

      // E
      if (IACesiumCamera.DOWN) {
        camera.moveDown(moveRate)
        //document.getElementById('audioDLeftRight').play();
      }

      // Q
      if (IACesiumCamera.LEFT) {
        camera.moveLeft(moveRate)
        //document.getElementById('audioDLeftRight').play();
      }

      // D
      if (IACesiumCamera.RIGHT) {
        camera.moveRight(moveRate)
        //document.getElementById('audioDLeftRight').play();
      }

      // M
      // if () {
      //   console.log("mActive", mActive)
      //   // map().setLocation();
      // }
    })
  }
}

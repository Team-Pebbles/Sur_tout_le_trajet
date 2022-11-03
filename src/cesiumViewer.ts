import {
  Viewer,
  Ion,
  MapboxImageryProvider,
  createWorldTerrain,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian3,
} from "cesium"
import CesiumTerrainProvider from "cesium/Source/Core/CesiumTerrainProvider"
import Ellipsoid from "cesium/Source/Core/Ellipsoid"
import Camera from "cesium/Source/Scene/Camera"
import Scene from "cesium/Source/Scene/Scene"
import { IACesiumCamera, IACesiumCameraLooking } from "./inputs/inputActions"

export class CesiumViewer {
  private viewer: Viewer
  private handler: ScreenSpaceEventHandler
  private viewerCanvas: HTMLCanvasElement

  constructor() {
    //console.log(IACesiumCamera.FORWARD)
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTJjZTMzZC1kNjU5LTRjMWEtODQzZi1iNTUyNjE5MDJmMWUiLCJpZCI6NDkzLCJpYXQiOjE1MjUyNTQzODh9.2v8b1Vel8pp-AYQELIBwu5q7lE75yXPsXQrhppADDlw"

    var worldTerrain: CesiumTerrainProvider = createWorldTerrain({
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
    const scene: Scene = this.viewer.scene
    const canvas: HTMLCanvasElement = this.viewer.canvas

    canvas.setAttribute("tabindex", "0") // needed to put focus on the canvas
    canvas.onclick = function () {
      canvas.focus()
    }

    const ellipsoid: Ellipsoid = this.viewer.scene.globe.ellipsoid

    // disable the default event handlers
    scene.screenSpaceCameraController.enableRotate = false
    scene.screenSpaceCameraController.enableTranslate = false
    scene.screenSpaceCameraController.enableZoom = false
    scene.screenSpaceCameraController.enableTilt = false
    scene.screenSpaceCameraController.enableLook = false

    // let startMousePosition: Cartesian3
    // let mousePosition: Cartesian3
    // let looking: boolean = true

    // this.handler.setInputAction(function (movement) {
    //   looking = true
    //   mousePosition = startMousePosition = Cartesian3.clone(movement.position)
    // }, ScreenSpaceEventType.LEFT_DOWN)

    // this.handler.setInputAction(function (movement) {
    //   // scene.requestRender();
    //   mousePosition = movement.endPosition
    // }, ScreenSpaceEventType.MOUSE_MOVE)

    // this.handler.setInputAction(function () {
    //   looking = false
    // }, ScreenSpaceEventType.LEFT_UP)

    this.viewer.clock.onTick.addEventListener(() => {
      // OLD CONTROLLER
      let camera: Camera = this.viewer.camera
//console.log(IACesiumCameraLooking.LOOKING.isActive)
      if (IACesiumCameraLooking.LOOKING.isActive) {
        let width: number = canvas.clientWidth
        let height: number = canvas.clientHeight

        // Coordinate (0.0, 0.0) will be where the mouse was clicked.
        // let x: number = (mousePosition.x - startMousePosition.x) / width
        // let y: number = -(mousePosition.y - startMousePosition.y) / height
        //console.log(IACesiumCameraLooking.LOOKING)
        let x: number = IACesiumCameraLooking.LOOKING.mouseMove.x
        let y: number = IACesiumCameraLooking.LOOKING.mouseMove.y

        let lookFactor: number = 0.05
        camera.lookRight((x / width) * lookFactor)
        camera.lookUp((y / height) * lookFactor)
      }

      // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
      let cameraHeight: number = ellipsoid.cartesianToCartographic(camera.position).height
      let moveRate: number = cameraHeight / 100.0

      // // Z
      if (IACesiumCamera.FORWARD) camera.moveForward(moveRate)
      // S
      if (IACesiumCamera.BACKWARD) camera.moveBackward(moveRate)
      // A
      if (IACesiumCamera.UP) camera.moveUp(moveRate)
      // E
      if (IACesiumCamera.DOWN) camera.moveDown(moveRate)
      // Q
      if (IACesiumCamera.LEFT) camera.moveLeft(moveRate)
      // D
      if (IACesiumCamera.RIGHT) camera.moveRight(moveRate)
      // M
      // if () {
      //   console.log("mActive", mActive)
      //   // map().setLocation();
      // }
    })
  }
}

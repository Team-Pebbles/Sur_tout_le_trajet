import {
  Viewer,
  Ion,
  MapboxImageryProvider,
  ScreenSpaceEventHandler,
  ImageryLayer,
  Cartesian3,
  createWorldTerrainAsync,
  Material,
  Color,
} from "cesium"
import CesiumTerrainProvider from "@cesium/engine/Source/Core/CesiumTerrainProvider"
import Ellipsoid from "@cesium/engine/Source/Core/Ellipsoid"
import Camera from "@cesium/engine/Source/Scene/Camera"
import Scene from "@cesium/engine/Source/Scene/Scene"
import { IACesiumCamera } from "./inputs/inputActions"

export class CesiumViewer {
  //private viewer: Viewer
  static handler: ScreenSpaceEventHandler
  static viewerCanvas: HTMLCanvasElement
  static viewer: Viewer

  constructor() {}

  public static async build(): Promise<CesiumViewer> {
    let worldTerrain: CesiumTerrainProvider
    try {
      worldTerrain = await createWorldTerrainAsync({
        requestWaterMask: true,
        // requestVertexNormals: true,
      })
    } catch (error) {
      console.error
    }
    console.log("init viewer")
    //console.log(IACesiumCamera.FORWARD)
    Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTJjZTMzZC1kNjU5LTRjMWEtODQzZi1iNTUyNjE5MDJmMWUiLCJpZCI6NDkzLCJpYXQiOjE1MjUyNTQzODh9.2v8b1Vel8pp-AYQELIBwu5q7lE75yXPsXQrhppADDlw"

    let mapBoxProvider = new MapboxImageryProvider({
      url: "https://api.mapbox.com/v4/",
      mapId: "mapbox.satellite",
      accessToken:
        "pk.eyJ1IjoiaWNoYmlucm9iIiwiYSI6ImNqZGtrbHYzMDAxbGUzM254ODY3MXA1dm4ifQ.2-TYG46620MlH6XmwYs4Jw",
    })

    this.viewer = new Viewer("cesiumContainer", {
      baseLayer: new ImageryLayer(mapBoxProvider),
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

    // var worldTerrain: CesiumTerrainProvider = createWorldTerrain({
    //   requestWaterMask: true,
    //   // requestVertexNormals: true,
    // })

    this.viewer.scene.globe.depthTestAgainstTerrain = true
    this.viewer.scene.globe.enableLighting = true


    this.viewerCanvas = this.viewer.canvas
    this.viewerCanvas.id = "cesiumCanvas"
    this.handler = new ScreenSpaceEventHandler(this.viewerCanvas)
    this.controller()

    return new CesiumViewer()
  }

  static controller() {
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

    let time = performance.now() / 1000;

    const cameraData = {
      longitude: -75.5847,
      latitude: 40.0397,
      height: 1000,
      heading: 0,
      pitch: -Math.PI * 0.25,
      roll: 0.0,
      flip: false,
    }

    this.viewer.clock.onTick.addEventListener(() => {

      const deltaTime = (performance.now() / 1000) - time;
      time = performance.now() / 1000;

      scene.verticalExaggeration = 1;// (Math.sin(time) + 1) * 0.5 * 10;

     /* let material = Material.fromType("ElevationContour");
      const shadingUniforms = material.uniforms;
      shadingUniforms.width = 1.0;
      shadingUniforms.spacing = 1* scene.verticalExaggeration;
      shadingUniforms.color = Color.BLACK;
      scene.globe.material = material;*/

      // OLD CONTROLLER
      let camera: Camera = this.viewer.camera

      let width: number = canvas.clientWidth
      let height: number = canvas.clientHeight


      const lx: number = IACesiumCamera.LOOK_X.value;
      const ly: number = IACesiumCamera.LOOK_Y.value;

      cameraData.pitch -= ly * ToRad(90) * deltaTime;
      cameraData.heading += lx * ToRad(90) * deltaTime;

      const flipValue = cameraData.flip ? -1 : 1;
      const imove = rotateVector({x: IACesiumCamera.MOVE_X.value, y: IACesiumCamera.MOVE_Z.value }, cameraData.heading);

      const speedXZ:number = (0.01 * cameraData.height/1000 + 0.001) * deltaTime;
      cameraData.longitude += flipValue * imove.x * speedXZ;
      cameraData.latitude += flipValue * imove.y * -speedXZ;

      const cmove = rotateVector({x: 0, y: IACesiumCamera.CONTINUOUS_FWD.value }, cameraData.heading);
      cameraData.longitude += flipValue * cmove.x * speedXZ * 10;
      cameraData.latitude += flipValue * cmove.y * speedXZ * 10;

      if(cameraData.latitude > 90){
        cameraData.flip = !cameraData.flip;
        cameraData.longitude += 180;
        cameraData.latitude = 90;
      }
      if(cameraData.latitude < -90){
        cameraData.flip = !cameraData.flip;
        cameraData.longitude += 180;
        cameraData.latitude = -90;
      }

      cameraData.longitude = (cameraData.longitude + 180) % 360 - 180;

      cameraData.heading = cameraData.heading % (Math.PI * 2);
      cameraData.pitch = cameraData.pitch % (Math.PI * 2);
      cameraData.roll = cameraData.roll % (Math.PI * 2);


      const speedY:number = (cameraData.height + 1) * deltaTime;
      cameraData.height += IACesiumCamera.MOVE_Y.value * speedY;
      if(cameraData.height < 0) cameraData.height = 0; 

      //console.log(cameraData);

      camera.setView({
        destination: Cartesian3.fromDegrees(
          cameraData.longitude,
          cameraData.latitude,
          cameraData.height
        ),
        orientation: {
          heading: cameraData.flip ? cameraData.heading + Math.PI : cameraData.heading,
          pitch: cameraData.pitch,
          roll: cameraData.roll,
        },
      });

    })
  }
}

function rotateVector(vector, angle) {
  const x = vector.x;
  const y = vector.y;
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);

  const rotatedX = x * cosAngle - y * sinAngle;
  const rotatedY = x * sinAngle + y * cosAngle;

  return { x: rotatedX, y: rotatedY };
}

function ToRad(degrees) {
  return degrees * Math.PI / 180;
}
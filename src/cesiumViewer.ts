import {
    Viewer,
    Ion,
    MapboxImageryProvider,
    ScreenSpaceEventHandler,
    ImageryLayer,
    Cartesian3,
    createWorldTerrainAsync,
    HeadingPitchRoll,
    Color,
    IonImageryProvider,
} from "cesium"
import CesiumTerrainProvider from "@cesium/engine/Source/Core/CesiumTerrainProvider"
import Ellipsoid from "@cesium/engine/Source/Core/Ellipsoid"
import Camera from "@cesium/engine/Source/Scene/Camera"
import Scene from "@cesium/engine/Source/Scene/Scene"
import { Audio } from "./audio/audioActions"
import { Inputs } from "./inputs/inputs"

export class CesiumViewer {
    //private viewer: Viewer
    handler: ScreenSpaceEventHandler
    canvas: HTMLCanvasElement
    viewer: Viewer
    placesDB = [
        {lat: 41, long: -74, height: 2000},
        {lat: 10, long: 41, height: 2000},
        {lat: 45.756, long: 6.538, height: 2000},
        {lat: 35.686, long: 139.752, height: 2000},
        {lat: -25.143, long: 129.619, height: 2000},
        {lat: -4.353, long:  -69.897, height: 2000},
        {lat: 35.366, long:  138.730, height: 3900},
        {lat: 42.953543, long:  1.540730, height: 2000},
        {lat: 14.459600, long:  17.057279, height: 2000},
        {lat: 14.351484, long:  14.981578, height: 2000},
        {lat: 35.025009, long:  135.762046, height: 2000},
        {lat: 29.959225, long:  90.064776, height: 7000},
        {lat: 44.147868, long:  3.730320, height: 2000}
    ];
    initialOrientation = HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
    currentPlaceIndex = 11
    cameraData: {
        longitude: number,
        latitude: number,
        height: number,
        heading: number,
        pitch: number,
        roll: number,
        flip: boolean,
    }

    private constructor() {}
    public static async build(){
        return await new CesiumViewer().init();
    }

    public async init(): Promise<CesiumViewer> {
        let worldTerrain: CesiumTerrainProvider
        console.log("init viewer")
        //console.log(IACesiumCamera.FORWARD)
        // Token 1
        // Ion.defaultAccessToken =
        //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTJjZTMzZC1kNjU5LTRjMWEtODQzZi1iNTUyNjE5MDJmMWUiLCJpZCI6NDkzLCJpYXQiOjE1MjUyNTQzODh9.2v8b1Vel8pp-AYQELIBwu5q7lE75yXPsXQrhppADDlw"
        // Token 2 : 
        Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxZmZiNjVjOC0yN2RlLTQ4MDQtOTZiZC0zNDA4MTI0NzlhYTEiLCJpZCI6MjA2OTMwLCJpYXQiOjE3MTI0MDcwNzl9.Pjp_GoeS_feA3aol6-7p9uRmIUqt4ElaMP0qfml3q9c"
        // let mapBoxProvider = new MapboxImageryProvider({
        //   url: "https://api.mapbox.com/v4/",
        //   mapId: "mapbox.satellite",
        //   accessToken:
        //     "pk.eyJ1IjoiaWNoYmlucm9iIiwiYSI6ImNqZGtrbHYzMDAxbGUzM254ODY3MXA1dm4ifQ.2-TYG46620MlH6XmwYs4Jw",
        // })
        try {
            worldTerrain = await createWorldTerrainAsync({
                requestWaterMask: true,
                // requestVertexNormals: true,
            })
        } catch (error) {
            console.error
        }
        this.viewer = new Viewer("cesiumContainer", {
            baseLayer: ImageryLayer.fromProviderAsync(IonImageryProvider.fromAssetId(2), {}),
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


        this.canvas = this.viewer.canvas
        this.canvas.id = "cesiumCanvas"
        this.handler = new ScreenSpaceEventHandler(this.canvas)
        this.cameraData = {
            longitude: this.placesDB[this.currentPlaceIndex].long,
            latitude: this.placesDB[this.currentPlaceIndex].lat,
            height: this.placesDB[this.currentPlaceIndex].height,
            heading: this.initialOrientation.heading,
            pitch: this.initialOrientation.pitch,
            roll: this.initialOrientation.roll,
            flip: false,
        }
        this.controller()

        return this;
    }

    mapSwitch() {
        this.currentPlaceIndex++;
        if(this.currentPlaceIndex >= this.placesDB.length) {
            this.currentPlaceIndex = 0;
        }
        this.cameraData.longitude = this.placesDB[this.currentPlaceIndex].long;
        this.cameraData.latitude = this.placesDB[this.currentPlaceIndex].lat;
        this.cameraData.height = this.placesDB[this.currentPlaceIndex].height

    }

    resetCam() {
        this.cameraData.heading = this.initialOrientation.heading;
        this.cameraData.pitch = this.initialOrientation.pitch;
        this.cameraData.roll = this.initialOrientation.roll;
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

        let time = performance.now() / 1000;

        let imove = {x: 0, y: 0};
        let simove = {x: 0, y: 0};
        

        this.viewer.clock.onTick.addEventListener(() => {

            const deltaTime = (performance.now() / 1000) - time;
            time = performance.now() / 1000;

            const targetExaggeration = 1 + Inputs.values.HEIGHT.value * 10;
            scene.verticalExaggeration = targetExaggeration // (Math.sin(time) + 1) * 0.5 * 10;

            /* let material = Material.fromType("ElevationContour");
            const shadingUniforms = material.uniforms;
            shadingUniforms.width = 1.0;
            shadingUniforms.spacing = 5 * scene.verticalExaggeration;
            shadingUniforms.color = Color.BLACK;
            scene.globe.material = material;*/

            // OLD CONTROLLER
            let camera: Camera = this.viewer.camera

            const lx: number = Inputs.values.LOOK_X.smoothValue * .5;
            const ly: number = Inputs.values.LOOK_Y.smoothValue * .5;
            const c_fw: number = Inputs.values.CONTINUOUS_FWD.smoothValue;

            this.cameraData.pitch -= ly * ToRad(90) * deltaTime;
            this.cameraData.heading += lx * ToRad(90) * deltaTime;

            const flipValue = this.cameraData.flip ? -1 : 1;
      
            if(Inputs.values.RECORD_MOVE.value > 0){
                imove = rotateVector({ x: Inputs.values.MOVE_X.value, y: Inputs.values.MOVE_Z.value }, this.cameraData.heading);
            }

            simove.x += (imove.x - simove.x) * 0.01;
            simove.y += (imove.y - simove.y) * 0.01;

            const speedXZ: number = (0.01 * this.cameraData.height / 1000 + 0.001) * deltaTime * c_fw * (Audio.actions.SPECTRUM_CURRENT.cool  * 5 + 1);
            this.cameraData.longitude += flipValue * simove.x * speedXZ;
            this.cameraData.latitude -= flipValue * simove.y * speedXZ;


            if (this.cameraData.latitude > 90) {
                this.cameraData.flip = !this.cameraData.flip;
                this.cameraData.longitude += 180;
                this.cameraData.latitude = 90;
            }
            if (this.cameraData.latitude < -90) {
                this.cameraData.flip = !this.cameraData.flip;
                this.cameraData.longitude += 180;
                this.cameraData.latitude = -90;
            }

            this.cameraData.longitude = (this.cameraData.longitude + 180) % 360 - 180;

            this.cameraData.heading = this.cameraData.heading % (Math.PI * 2);
            this.cameraData.pitch = this.cameraData.pitch % (Math.PI * 2);
            this.cameraData.roll = this.cameraData.roll % (Math.PI * 2);


            const speedY: number = (this.cameraData.height + 1) * deltaTime;
            this.cameraData.height += Inputs.values.MOVE_Y.smoothValue * speedY;
            if (this.cameraData.height < 0) this.cameraData.height = 0;

            //console.log(this.cameraData);

            //console.log(IACesiumCamera.MOVE_Y.once);
            if(Inputs.values.SWITCH_MAP.once) {
                this.mapSwitch();
                Inputs.values.SWITCH_MAP.once = false;
            }

            if(Inputs.values.RESET_CAM.once) {
                this.resetCam();
                Inputs.values.SWITCH_MAP.once = false;
            }

            camera.setView({
                destination: Cartesian3.fromDegrees(
                    this.cameraData.longitude,
                    this.cameraData.latitude,
                    this.cameraData.height
                ),
                orientation: {
                    heading: this.cameraData.flip ? this.cameraData.heading + Math.PI : this.cameraData.heading,
                    pitch: this.cameraData.pitch,
                    roll: this.cameraData.roll,
                },
            });

        })
    }
}

function rotateVector(vector, angle) {
    const x = vector.x;
    const y = vector.y;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const rotatedX = x * cos - y * sin;
    const rotatedY = x * sin + y * cos;

    return { x: rotatedX, y: rotatedY };
}

function ToRad(degrees) {
    return degrees * Math.PI / 180;
}
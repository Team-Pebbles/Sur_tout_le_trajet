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
    static handler: ScreenSpaceEventHandler
    static viewerCanvas: HTMLCanvasElement
    static viewer: Viewer

    constructor() { }

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

        // let mapBoxProvider = new MapboxImageryProvider({
        //   url: "https://api.mapbox.com/v4/",
        //   mapId: "mapbox.satellite",
        //   accessToken:
        //     "pk.eyJ1IjoiaWNoYmlucm9iIiwiYSI6ImNqZGtrbHYzMDAxbGUzM254ODY3MXA1dm4ifQ.2-TYG46620MlH6XmwYs4Jw",
        // })

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

        const initialOrientation = HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);

        const placesDB = [
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

        const cameraData = {
            longitude: placesDB[0].long,
            latitude: placesDB[0].lat,
            height: placesDB[0].height,
            heading: initialOrientation.heading,
            pitch: initialOrientation.pitch,
            roll: initialOrientation.roll,
            flip: false,
        }

        let currentPlaceIndex = 0

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

            const lx: number = Inputs.values.LOOK_X.smoothValue;
            const ly: number = Inputs.values.LOOK_Y.smoothValue;
            const c_fw: number = Inputs.values.CONTINUOUS_FWD.smoothValue * .5;

            cameraData.pitch -= ly * ToRad(90) * deltaTime;
            cameraData.heading += lx * ToRad(90) * deltaTime;

            const flipValue = cameraData.flip ? -1 : 1;
            const imove = rotateVector({ x: Inputs.values.MOVE_X.smoothValue, y: Inputs.values.MOVE_Z.smoothValue }, cameraData.heading);
            const cmove = rotateVector({ x: 0, y: c_fw * Math.abs(Audio.actions.SPECTRUM_CURRENT.value) * 100 }, cameraData.heading);

            const speedXZ: number = (0.01 * cameraData.height / 1000 + 0.001) * deltaTime;
            cameraData.longitude += flipValue * imove.x * speedXZ;
            cameraData.latitude -= flipValue * imove.y * speedXZ;

            cameraData.longitude -= flipValue * cmove.x * speedXZ;
            cameraData.latitude += flipValue * cmove.y * speedXZ;

            if (cameraData.latitude > 90) {
                cameraData.flip = !cameraData.flip;
                cameraData.longitude += 180;
                cameraData.latitude = 90;
            }
            if (cameraData.latitude < -90) {
                cameraData.flip = !cameraData.flip;
                cameraData.longitude += 180;
                cameraData.latitude = -90;
            }

            cameraData.longitude = (cameraData.longitude + 180) % 360 - 180;

            cameraData.heading = cameraData.heading % (Math.PI * 2);
            cameraData.pitch = cameraData.pitch % (Math.PI * 2);
            cameraData.roll = cameraData.roll % (Math.PI * 2);


            const speedY: number = (cameraData.height + 1) * deltaTime;
            cameraData.height += Inputs.values.MOVE_Y.smoothValue * speedY;
            if (cameraData.height < 0) cameraData.height = 0;

            //console.log(cameraData);

            //console.log(IACesiumCamera.MOVE_Y.once);
            if(Inputs.values.SWITCH_MAP.once) {
                currentPlaceIndex++;
                if(currentPlaceIndex >= placesDB.length) {
                    currentPlaceIndex = 0;
                }
                console.log(currentPlaceIndex)
                cameraData.longitude = placesDB[currentPlaceIndex].long;
                cameraData.latitude = placesDB[currentPlaceIndex].lat;
                cameraData.height = placesDB[currentPlaceIndex].height
                cameraData.heading = initialOrientation.heading;
                cameraData.pitch = initialOrientation.pitch;
                cameraData.roll = initialOrientation.roll;

                Inputs.values.SWITCH_MAP.once = false;
            }

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
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const rotatedX = x * cos - y * sin;
    const rotatedY = x * sin + y * cos;

    return { x: rotatedX, y: rotatedY };
}

function ToRad(degrees) {
    return degrees * Math.PI / 180;
}
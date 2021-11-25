import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, ShaderMaterial, HtmlElementTexture,ThinEngine, Camera } from "@babylonjs/core";

import { Viewer,  Ion, MapboxImageryProvider, createWorldTerrain } from 'cesium';

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

  

        // initialize babylon scene and engine
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        let camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);

        let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        this.cesiumInit()

        let mapCanvasTexture = this.addMapCanvas(scene)

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            if(mapCanvasTexture !== null && mapCanvasTexture !== undefined) {
                mapCanvasTexture.update();
            }
            scene.render();
        });
      
    }

    cesiumInit() {
        Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTJjZTMzZC1kNjU5LTRjMWEtODQzZi1iNTUyNjE5MDJmMWUiLCJpZCI6NDkzLCJpYXQiOjE1MjUyNTQzODh9.2v8b1Vel8pp-AYQELIBwu5q7lE75yXPsXQrhppADDlw';
        var viewer = new Viewer('cesiumContainer', {
            imageryProvider : new MapboxImageryProvider({
                url : 'https://api.mapbox.com/v4/',
                mapId: 'mapbox.satellite',
                accessToken: 'pk.eyJ1IjoiaWNoYmlucm9iIiwiYSI6ImNqZGtrbHYzMDAxbGUzM254ODY3MXA1dm4ifQ.2-TYG46620MlH6XmwYs4Jw'
            }),
            terrainProvider : createWorldTerrain(),
            scene3DOnly: true,
            selectionIndicator: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            homeButton: false,
            geocoder: false
            // requestRenderMode : true,
            // maximumRenderTimeChange : Infinity
      
        });

        let viewerDOM = document.getElementById("cesiumContainer")
        let viewerCanvas = viewerDOM?.querySelector(".cesium-widget > canvas")
        if(viewerCanvas !== null && viewerCanvas !== undefined) viewerCanvas.id = "cesiumCanvas"
    }

    addMapCanvas(scene){
		if (scene.activeCameras.length === 0){
		    scene.activeCameras.push(scene.activeCamera);
		}              

        let size = {x: window.innerWidth,y: window.innerHeight }

		var secondCamera = new FreeCamera("mapCanvasCamera", new Vector3(0, 0, -50), scene);                
		secondCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
		secondCamera.layerMask = 0x20000000;
		scene.activeCameras.push(secondCamera);

        let plane: Mesh = MeshBuilder.CreatePlane("plane", { width: size.x, height: size.y }, scene);

        let shaderMaterial = new ShaderMaterial("shader", scene, "./stream",
        {
			attributes: ["position", "normal", "uv"],
			uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
        });

        let mapCanvas: any = document.getElementById("cesiumCanvas")
        if(mapCanvas == null && mapCanvas == undefined) return;

        let e = new ThinEngine(mapCanvas);

        let mapCanvasTexture = new HtmlElementTexture("mapCanvas",mapCanvas,{scene: scene, engine: scene.getEngine()});
    
        plane.name = "planeMapCanvas";
		plane.layerMask = 0x20000000;
		plane.freezeWorldMatrix();

        shaderMaterial.setTexture("textureSampler", mapCanvasTexture);
        plane.material = shaderMaterial;

        return mapCanvasTexture

	}
}
new App();
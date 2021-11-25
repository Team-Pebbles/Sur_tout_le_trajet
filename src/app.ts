import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, ShaderMaterial, HtmlElementTexture,ThinEngine } from "@babylonjs/core";

import { Viewer,  Ion, MapboxImageryProvider, createWorldTerrain } from 'cesium';

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    var shaderMaterial = new ShaderMaterial("shader", scene, "./stream",
        {
			attributes: ["position", "normal", "uv"],
			uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
        });

        this.cesiumInit()

        let mapCanvas: any = document.getElementById("cesiumCanvas")
        if(mapCanvas == null && mapCanvas == undefined) return;

        var e = new ThinEngine(mapCanvas);

        let mapCanvasTexture = new HtmlElementTexture("mapCanvas",mapCanvas,{scene: scene, engine: scene.getEngine()});
    
        
        shaderMaterial.setTexture("textureSampler", mapCanvasTexture);
        sphere.material = shaderMaterial;

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
            mapCanvasTexture.update();
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
}
new App();
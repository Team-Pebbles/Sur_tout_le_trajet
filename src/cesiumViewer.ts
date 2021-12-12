import { Viewer,  Ion, MapboxImageryProvider, createWorldTerrain } from 'cesium';

export class CesiumViewer {
    constructor() {
        Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTJjZTMzZC1kNjU5LTRjMWEtODQzZi1iNTUyNjE5MDJmMWUiLCJpZCI6NDkzLCJpYXQiOjE1MjUyNTQzODh9.2v8b1Vel8pp-AYQELIBwu5q7lE75yXPsXQrhppADDlw';

        var worldTerrain = createWorldTerrain({
            requestWaterMask: true,
            requestVertexNormals: true,
            });
            
        var viewer = new Viewer('cesiumContainer', {
            imageryProvider : new MapboxImageryProvider({
                url : 'https://api.mapbox.com/v4/',
                mapId: 'mapbox.satellite',
                accessToken: 'pk.eyJ1IjoiaWNoYmlucm9iIiwiYSI6ImNqZGtrbHYzMDAxbGUzM254ODY3MXA1dm4ifQ.2-TYG46620MlH6XmwYs4Jw'
            }),
            terrainProvider : worldTerrain,
            scene3DOnly: true,
            selectionIndicator: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            homeButton: false,
            geocoder: false
            // requestRenderMode : true,
            // maximumRenderTimeChange : Infinity
      
        });
        viewer.scene.globe.enableLighting = true;

        let viewerDOM = document.getElementById("cesiumContainer")
        let viewerCanvas = viewerDOM?.querySelector(".cesium-widget > canvas")
        if(viewerCanvas !== null && viewerCanvas !== undefined) viewerCanvas.id = "cesiumCanvas"
    }
}
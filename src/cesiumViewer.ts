import { Viewer,  Ion, MapboxImageryProvider, createWorldTerrain, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian3 } from 'cesium';

export class CesiumViewer {
    private viewer :Viewer;
    private handler :ScreenSpaceEventHandler;
    private viewerCanvas: HTMLCanvasElement | null;

    constructor() {
        Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTJjZTMzZC1kNjU5LTRjMWEtODQzZi1iNTUyNjE5MDJmMWUiLCJpZCI6NDkzLCJpYXQiOjE1MjUyNTQzODh9.2v8b1Vel8pp-AYQELIBwu5q7lE75yXPsXQrhppADDlw';

        var worldTerrain = createWorldTerrain({
            requestWaterMask: true,
            // requestVertexNormals: true,
            });
            
        this.viewer = new Viewer('cesiumContainer', {
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
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.scene.globe.enableLighting = true;
        
        this.viewerCanvas = this.viewer.canvas;
        this.viewerCanvas.id = "cesiumCanvas"
        this.handler = new ScreenSpaceEventHandler(this.viewerCanvas);
        this.controller()

    }

    controller() {


        var scene = this.viewer.scene;
        var canvas = this.viewer.canvas;

        canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
        canvas.onclick = function() {
            canvas.focus();
        };

        var ellipsoid = this.viewer.scene.globe.ellipsoid;

        // disable the default event handlers
        scene.screenSpaceCameraController.enableRotate = false;
        scene.screenSpaceCameraController.enableTranslate = false;
        scene.screenSpaceCameraController.enableZoom = false;
        scene.screenSpaceCameraController.enableTilt = false;
        scene.screenSpaceCameraController.enableLook = false;

        var startMousePosition;
        var mousePosition;
        var flags = {
            looking : false,
            moveForward : false,
            moveBackward : false,
            moveUp : false,
            moveDown : false,
            moveLeft : false,
            moveRight : false,
            changeLocation : false
        };

            this.handler.setInputAction(function(movement) {
                flags.looking = true;
                mousePosition = startMousePosition = Cartesian3.clone(movement.position);
            }, ScreenSpaceEventType.LEFT_DOWN);

            this.handler.setInputAction(function(movement) {
                // scene.requestRender();
                mousePosition = movement.endPosition;
            }, ScreenSpaceEventType.MOUSE_MOVE);

            this.handler.setInputAction(function(position) {
                flags.looking = false;
            }, ScreenSpaceEventType.LEFT_UP);


        function getFlagForKeyCode(keyCode: string) {
            switch (keyCode) {
            case 'z':
                return 'moveForward';
            case 's':
                return 'moveBackward';
            case 'a':
                return 'moveUp';
            case 'e':
                return 'moveDown';
            case 'd':
                return 'moveRight';
            case 'q':
                return 'moveLeft';
            case 'm':
                return 'changeLocation';
            default:
                return undefined;
            }
        }

        document.addEventListener('keydown', function(e) {
            var flagName = getFlagForKeyCode(e.key);
            if (typeof flagName !== 'undefined') {
                flags[flagName] = true;
            }
        }, false);

        document.addEventListener('keyup', function(e) {
            var flagName = getFlagForKeyCode(e.key);
            if (typeof flagName !== 'undefined') {
                flags[flagName] = false;
            }
        }, false);

        let zActive = true, sActive = true, aActive= true, eActive= true, qActive= true, dActive= true, mActive = true

        this.viewer.clock.onTick.addEventListener((clock) => {
            // OLD CONTROLLER
            var camera = this.viewer.camera;

            if (flags.looking) {
                var width = canvas.clientWidth;
                var height = canvas.clientHeight;

                // Coordinate (0.0, 0.0) will be where the mouse was clicked.
                var x = (mousePosition.x - startMousePosition.x) / width;
                var y = -(mousePosition.y - startMousePosition.y) / height;

                var lookFactor = 0.05;
                camera.lookRight(x * lookFactor);
                camera.lookUp(y * lookFactor);
            }

            // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
            var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
            var moveRate = cameraHeight / 100.0;

            // Z
            if (flags.moveForward && zActive) {
                camera.moveForward(moveRate);
                //document.getElementById('audioDDerive').play();
            }
            // S
            if (flags.moveBackward && sActive) {
                camera.moveBackward(moveRate);
                //document.getElementById('audioDDerive').play();
            }

            // A
            if (flags.moveUp && aActive) {
                camera.moveUp(moveRate);
                //document.getElementById('audioDLeftRight').play();
            }

            // E
            if (flags.moveDown && eActive) {
                camera.moveDown(moveRate);
                //document.getElementById('audioDLeftRight').play();
            }

            // Q
            if (flags.moveLeft && qActive) {
                camera.moveLeft(moveRate);
                //document.getElementById('audioDLeftRight').play();
            }

            // D
            if (flags.moveRight && dActive) {
                camera.moveRight(moveRate);
                //document.getElementById('audioDLeftRight').play();
            }

            // M
            if (flags.changeLocation && mActive) {
                console.log('mActive', mActive);
               // map().setLocation();
            }
        });
    }
}
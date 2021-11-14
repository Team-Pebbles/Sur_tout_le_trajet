let map  = (() => {
    "use strict";
    var initialPosition = new Cesium.Cartesian3.fromDegrees(-74, 41, 2000);
    var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
    //////////////////////////////////////////////////////////////////////////
    // Creating the Viewer
    //////////////////////////////////////////////////////////////////////////
    const PLACES= [
      {lat: 41, long: -74},
      {lat: 10, long: 41},
      {lat: 45.756, long: 6.538},
      {lat: 35.686, long: 139.752},
      {lat: -25.143, long: 129.619},
      {lat: -4.353, long:  -69.897},
      {lat: 35.366, long:  138.730},
      {lat: 42.953543, long:  1.540730},
      {lat: 14.459600, long:  17.057279},
      {lat: 14.351484, long:  14.981578},
      {lat: 35.025009, long:  135.762046},
      {lat: 29.959225, long:  90.064776},
      {lat: 44.147868, long:  3.730320}
    ];

    // Damastès
    //  {lat: 42.953543, long:  1.540730},
    // {lat: 14.459600, long:  17.057279},
    // {lat: 14.351484, long:  14.981578},
    // {lat: 35.025009, long:  135.762046},
    // {lat: 29.959225, long:  90.064776},
    // {lat: 44.147868, long:  3.730320}

    function location(heading = 7.1077496389876024807, pitch = -31.987223091598949054, roll = 0.025883251314954971306) {
      // // Create an initial camera view
      let {lat: latitude, long: longitude} = rand();
      console.log('lat : ', latitude, ' - long : ', longitude);
      initialPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 2000);
      //initialPosition = Cesium.Cartesian3.fromDegrees(47, 0.25, height);
      initialOrientation = Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, roll);
      var homeCameraView = {
          destination : initialPosition,
          orientation : {
              heading : initialOrientation.heading,
              pitch : initialOrientation.pitch,
              roll : initialOrientation.roll
          }
      };
      // // Set the initial view
      viewer.scene.camera.setView(homeCameraView);
    }

    function rand() {
      let newLocation = PLACES[Math.floor(Math.random()*(PLACES.length))];
      if (oldLocation === "") {
        oldLocation = newLocation;
      } else {

        while ((oldLocation.lat === newLocation.lat) && (oldLocation.long === newLocation.long)) {
          newLocation = PLACES[Math.floor(Math.random()*(PLACES.length))];
        }

        oldLocation = newLocation;

      }

      return newLocation;
    }

    return {
      setLocation : location
    };

});

//VARIABLES GLOBALES
// état initial des inputs
var zActive = true, sActive = true, aActive = true, eActive = true, qActive = true, dActive = true, mActive = true, mouseActive = true;
var oldLocation = "";

window.addEventListener('load', onLoad);
// Initialisation de la map et du Canvas

let CesiumCanvas, canvas, captureStream, topStream, bottomStream;
let Res = [
  { tagsId:'audioStart', path:'./Source/sound/start.mp3'},
  { tagsId:'audioDDerive', path:'./Source/sound/dderive.mp3'},
  { tagsId:'audioDUpDown', path:'./Source/sound/dupdown.mp3'},
  { tagsId:'audioDLeftRight', path:'./Source/sound/dleftright.mp3'},
  { tagsId:'audioTeleport', path:'./Source/sound/teleport.mp3'},
  { tagsId:'audioMusic', path:'./Source/sound/music.mp3'}
];
let numberOfRes = 0;
let numberOfResLoad = 0;

function onLoad() {
  mapInit();
  getCanvas();
  for (let item of Res) {
    loadRes(item.path, item.tagsId);
    numberOfRes++;
  }
}

function loadRes(path, tagsId) {
  var myHeaders = new Headers();

  var myInit = { method: 'GET',
                 headers: myHeaders,
                 mode: 'cors',
                 cache: 'default' };

  var myRequest = new Request(path, myInit);

  fetch(myRequest).then(function(response) {
    console.log('loading ', tagsId, '...');
    return response.blob();
  }).then(function(myBlob) {
    var objectURL = URL.createObjectURL(myBlob);
    document.getElementById(tagsId).src = objectURL;
    // document.getElementById(tagsId).play();
    console.log(tagsId, 'is load');
  }).then(isLoaded);
}

function isLoaded () {
  numberOfResLoad++;
  console.log(numberOfResLoad);
  if (numberOfResLoad === numberOfRes) {
    console.log('All ressources are load !');
    gameInit();
  }
}


function gameInit() {
  const START_BUTTON = document.getElementById('startGame');
  START_BUTTON.disabled = false;
  START_BUTTON.classList.add('start-button--hover');
  START_BUTTON.classList.remove('start-button-inactive');
  START_BUTTON.text = 'cliquez pour continuer';
  START_BUTTON.addEventListener("click", function(e) {
    e.preventDefault();
    // document.getElementById('fs').requestFullscreen();
    const HOME = document.getElementById('home'),
      VIEWER = document.getElementById('viewerContainer');
      HOME.classList.add('next-startgame');
      VIEWER.classList.add('start-viewer');
    document.getElementById('audioIntro').pause();
    document.getElementById('audioStart').play();
    document.getElementById('audioMusic').play();
    var el = document.documentElement,
      rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      rfs.call(el);
      setTimeout(() => {
        showCommands(document.getElementById('Interface'));
        hideCommands(document.getElementById('Interface'));
      }, 2000);
  });

}

function showCommands(COMMANDS) {
  setTimeout(() => {
    COMMANDS.classList.add('command-active');
  },100);
}

function hideCommands(COMMANDS){
  setTimeout(() => {
    COMMANDS.classList.remove('command-active');
    setTimeout(() => {
      COMMANDS.style.display = "none";
    }, 700);
  }, 10000);
}

function mapInit() {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYTJjZTMzZC1kNjU5LTRjMWEtODQzZi1iNTUyNjE5MDJmMWUiLCJpZCI6NDkzLCJpYXQiOjE1MjUyNTQzODh9.2v8b1Vel8pp-AYQELIBwu5q7lE75yXPsXQrhppADDlw';
  viewer = new Cesium.Viewer('cesiumContainer', {
      imageryProvider : new Cesium.MapboxImageryProvider({
          url : 'https://api.mapbox.com/v4/',
          mapId: 'mapbox.satellite',
          accessToken: 'pk.eyJ1IjoiaWNoYmlucm9iIiwiYSI6ImNqZGtrbHYzMDAxbGUzM254ODY3MXA1dm4ifQ.2-TYG46620MlH6XmwYs4Jw'
      }),
      terrainProvider : Cesium.createWorldTerrain(),
      scene3DOnly: true,
      selectionIndicator: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      homeButton: false,
      geocoder: false
      // requestRenderMode : true,
      // maximumRenderTimeChange : Infinity

  });


  //////////////////////////////////////////////////////////////////////////
  // Loading Terrain
  //////////////////////////////////////////////////////////////////////////
//Depreciate
  // Load STK World Terrain
  // viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
  //     url : 'https://assets.agi.com/stk-terrain/world',
  //     requestWaterMask : true, // required for water effects
  //     requestVertexNormals : true // required for terrain lighting
  // });
  // Enable depth testing so things behind the terrain disappear.
  viewer.scene.globe.depthTestAgainstTerrain = true;

  //////////////////////////////////////////////////////////////////////////
  // Configuring the Scene
  //////////////////////////////////////////////////////////////////////////

  // Enable lighting based on sun/moon positions
  viewer.scene.globe.enableLighting = true;

  var handler = new Cesium.ScreenSpaceEventHandler(canvas);
  var scene = viewer.scene;
  var canvas = viewer.canvas;

  canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
  canvas.onclick = function() {
      canvas.focus();
  };
  var ellipsoid = viewer.scene.globe.ellipsoid;

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
      moveRight : false
  };

    handler.setInputAction(function(movement) {
      if (mouseActive) {
        flags.looking = true;
        mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function(movement) {
      if (mouseActive) {
        // scene.requestRender();
        mousePosition = movement.endPosition;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function(position) {
      if (mouseActive) {
        flags.looking = false;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);


  function getFlagForKeyCode(keyCode) {
      switch (keyCode) {
      case 'Z'.charCodeAt(0):
          return 'moveForward';
      case 'S'.charCodeAt(0):
          return 'moveBackward';
      case 'A'.charCodeAt(0):
          return 'moveUp';
      case 'E'.charCodeAt(0):
          return 'moveDown';
      case 'D'.charCodeAt(0):
          return 'moveRight';
      case 'Q'.charCodeAt(0):
          return 'moveLeft';
      case 'M'.charCodeAt(0):
          return 'changeLocation';
      default:
          return undefined;
      }
  }

  document.addEventListener('keydown', function(e) {
      var flagName = getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== 'undefined') {
          flags[flagName] = true;
      }
  }, false);

  document.addEventListener('keyup', function(e) {
      var flagName = getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== 'undefined') {
          flags[flagName] = false;
      }
  }, false);

  viewer.clock.onTick.addEventListener(function(clock) {
      var camera = viewer.camera;

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
        console.log('Z : ', zActive);
          camera.moveForward(moveRate);
          document.getElementById('audioDDerive').play();
      }
      // S
      if (flags.moveBackward && sActive) {
          camera.moveBackward(moveRate);
          document.getElementById('audioDDerive').play();
      }

      // A
      if (flags.moveUp && aActive) {
          camera.moveUp(moveRate);
          document.getElementById('audioDLeftRight').play();
      }

      // E
      if (flags.moveDown && eActive) {
          camera.moveDown(moveRate);
          document.getElementById('audioDLeftRight').play();
      }

      // Q
      if (flags.moveLeft && qActive) {
          camera.moveLeft(moveRate);
          document.getElementById('audioDLeftRight').play();
      }

      // D
      if (flags.moveRight && dActive) {
          camera.moveRight(moveRate);
          document.getElementById('audioDLeftRight').play();
      }

      // M
      if (flags.changeLocation && mActive) {
        console.log('mActive', mActive);
          map().setLocation();
          document.getElementById('audioTeleport').play();
      }
  });

  map().setLocation();
}


function getCanvas() {
  CesiumCanvas = document.getElementById('cesiumContainer').getElementsByTagName('canvas')[0];
  captureStream = CesiumCanvas.captureStream(60);
  topStream = document.getElementById('topStream');
  topStream.srcObject = captureStream;
  bottomStream = document.getElementById('bottomStream');
  bottomStream.srcObject = captureStream;
}

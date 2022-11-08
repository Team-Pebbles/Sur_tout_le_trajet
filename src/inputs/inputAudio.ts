import {
    Analyser,
    Scene,
    Engine,
    Sound,
    SoundTrack
  } from "@babylonjs/core"
  declare global {
    interface Window {
        stream: any;
        constraints: any;
    }
}
  export class InputAudio {
    private scene: Scene;
    private constraints: any;
    private analyser: Analyser;
    private audioReady: boolean;
    private debug: Debug;
    constructor(scene: Scene) {
        this.audioReady = false;
        this.scene = scene;
        this.constraints = window.constraints = {
            audio: true,
            video: false
        };
        this.handleSuccess = this.handleSuccess.bind(this);

        navigator.mediaDevices.getUserMedia(this.constraints)
        .then(this.handleSuccess)
        .catch(this.handleError);

    }

    handleSuccess(stream) {
        const audioTracks = stream.getAudioTracks();
        console.log('Got stream with constraints:', window.constraints);
        console.log('Using audio device: ' + audioTracks[0].label);
        stream.oninactive = function() {
            console.log('Stream ended');
        };
        window.stream = stream; // make variable available to browser console

        
        var bjsSound = new Sound("mic", stream, this.scene);
        //bjsSound.attachToMesh(sphere);
        bjsSound.play();
        var soundTrack = new SoundTrack(this.scene);
        soundTrack.addSound(bjsSound)
        this.analyser = new Analyser(this.scene);
        
        soundTrack.connectToAnalyser(this.analyser);
        this.analyser.FFT_SIZE = 512;
        this.analyser.SMOOTHING = 0.9;
        this.debug = new Debug(this.analyser)
        // this.analyser.DEBUGCANVASSIZE.width = 500;
        // this.analyser.DEBUGCANVASSIZE.height = 300;
        // this.analyser.DEBUGCANVASPOS.x = 40;
        // this.analyser.DEBUGCANVASPOS.y = 30;
        // this.analyser.drawDebugCanvas();
        console.log(this.analyser)
        this.audioReady = true
        // Low Gain 0-500 Hz
        // Mid Gain 500-4500Hz
        // High Gain 4500 +
    }

    handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    registerBeforeRender(){
	    // var workingArray = myAnalyser.getByteFrequencyData();
	
	    // for (var i = 0; i < myAnalyser.getFrequencyBinCount() ; i++) {
	    //     spatialBoxArray[i].scaling.y =  workingArray[i] / 32;
	    // }
        //creates array, copies frequency data into the passed unsigned byte array 
        //var workingArrayFreq = myAnalyser.getByteFrequencyData();
        
        if(this.audioReady) {
            this.debug.draw()
            var workingArrayTime = this.analyser.getByteFrequencyData();
        
            //loop scales mesh with each value
            for (var i = 0; i < this.analyser.getFrequencyBinCount(); i++) {  //frequency bin count is 1/2 of FFT_SIZE
                var size = workingArrayTime[i];
                //console.log("i : ", i,  " -> ", size)
                // speaker1.scaling = new BABYLON.Vector3(size,size,size);
                // speaker2.scaling = new BABYLON.Vector3(size,size,size);
            }
        }

    }


  }

class Debug {
    private analyser: Analyser
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    constructor(analyser: Analyser) {

        this.analyser = analyser

        this.canvas = document.createElement('canvas')
        this.canvas.width = 512
        this.canvas.height = 300
        this.canvas.style.position = 'absolute'
        this.canvas.style.bottom = "0"
        this.canvas.style.left = "0"
        this.canvas.style.zIndex = "3"
        document.body.appendChild(this.canvas)
        this.ctx = this.canvas.getContext('2d')!

        window.addEventListener('resize', this.resize.bind(this), false)
        this.resize()
    }

    resize() {
        this.canvas.width = window.innerWidth;
    }

    draw() {

        let borderHeight = 10;

        // draw background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        this.ctx.strokeStyle = '#a1a1a1';
        this.ctx.stroke();

        // draw spectrum
        this.ctx.beginPath();
        let spectrum = this.analyser.getByteFrequencyData();
        let spectrumLength = this.analyser.getFrequencyBinCount();
        let spectrumWidth = this.canvas.width / spectrumLength;
        let spectrumHeight = this.canvas.height - borderHeight;
        for (let i = 0; i < spectrumLength; i++) {
            let spectrumValue = spectrum[i] / 256;
            this.ctx.rect(i * spectrumWidth, spectrumHeight - spectrumHeight * spectrumValue, spectrumWidth / 2, spectrumHeight * spectrumValue);
        }
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();

        // draw frequency
        this.ctx.beginPath();
        this.ctx.font = "10px Arial";
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = "left";
        for (let i = 0, len = spectrumLength; i < len; i++) {

            if (i % 10 == 0) {
                this.ctx.rect(i * spectrumWidth, spectrumHeight, spectrumWidth / 2, borderHeight);
                this.ctx.fillText(`${i}`, i * spectrumWidth + 4, spectrumHeight + borderHeight * .5);
            }
        }
        this.ctx.fillStyle = '#e4e';
        this.ctx.fill();

        // // draw kick
        // let kicks = this.sound._kicks;
        // let kick = null;
        // let kickLength = kicks.length;
        // let kickFrequencyStart = null;
        // let kickFrequencyLength = null;
        // for (let i = 0, len = kickLength; i < len; i++) {

        //     kick = kicks[i];
        //     if (kick.isOn) {
        //         kickFrequencyStart = (kick.frequency.length ? kick.frequency[0] : kick.frequency);
        //         kickFrequencyLength = (kick.frequency.length ? kick.frequency[1] - kick.frequency[0] + 1 : 1);
        //         this.ctx.beginPath();
        //         this.ctx.rect(kickFrequencyStart * spectrumWidth, spectrumHeight - spectrumHeight * (kick.threshold / 256), kickFrequencyLength * spectrumWidth - (spectrumWidth * .5), 2);
        //         this.ctx.rect(kickFrequencyStart * spectrumWidth, spectrumHeight - spectrumHeight * (kick.currentThreshold / 256), kickFrequencyLength * spectrumWidth - (spectrumWidth * .5), 5);
        //         this.ctx.fillStyle = kick.isKick ? '#00ff00' : '#ff0000';
        //         this.ctx.fill();
        //     }
        // }

        // draw waveform
        this.ctx.beginPath();
        let waveform = this.analyser.getByteTimeDomainData();
        let waveformLength = this.analyser.getFrequencyBinCount();
        let waveformWidth = this.canvas.width / waveformLength;
        let waveformHeight = this.canvas.height - borderHeight;
        for (let i = 0; i < waveformLength; i++) {

            const waveformValue = waveform[i] / 256;
            if (i == 0) this.ctx.moveTo(i * waveformWidth, waveformHeight * waveformValue);
            else this.ctx.lineTo(i * waveformWidth, waveformHeight * waveformValue);
        }
        this.ctx.strokeStyle = '#0000ff';
        this.ctx.stroke();

        // // draw time
        // this.ctx.beginPath();
        // this.ctx.textAlign = "right";
        // this.ctx.textBaseline = 'top';
        // this.ctx.font = "15px Arial";
        // this.ctx.fillStyle = '#ffffff';
        // this.ctx.fillText((Math.round(this.sound.time * 10) / 10) + ' / ' + (Math.round(this.sound.duration * 10) / 10), this.canvas.width - 5, 5);

        // // draw section
        // this.ctx.beginPath();
        // let sections = this.sound._sections;
        // let section = null;
        // let sectionLength = sections.length;
        // let sectionLabels = '';
        // for (let i = 0, len = sectionLength; i < len; i++) {

        //     section = sections[i];
        //     if ( section.condition() ) {
        //         sectionLabels += section.label + ' - ';
        //     }
        // }
        // if (sectionLabels.length > 0) sectionLabels = sectionLabels.substr(0, sectionLabels.length - 3);
        // this.ctx.fillText(sectionLabels, this.canvas.width - 5, 25);
        // this.ctx.fill();
    }
}
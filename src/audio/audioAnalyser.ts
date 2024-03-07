import { Analyser, Scene, Engine, Sound, SoundTrack } from "@babylonjs/core";
import { Audio } from "./audioActions";
import { AudioAction } from "./audioActionsTypes";

declare global {
  interface Window {
    stream: MediaStream;
    constraints: MediaStreamConstraints;
  }
}

export class AudioAnalyser {
  private _scene: Scene;
  private _constraints: MediaStreamConstraints;
  private _analyser: Analyser;
  private _audioReady: boolean;
  private _debugGraph: Debug;
  private _debug: boolean;

  private _raw: number;
  private _intensity: number;
  private _difference: number;

  constructor(scene: Scene, debug:boolean) {
    this._debug = debug
    this._audioReady = false;
    this._scene = scene;
    this._constraints = window.constraints = {
      audio: true,
      video: false,
    };
    this.handleSuccess = this.handleSuccess.bind(this);

    navigator.mediaDevices
      .getUserMedia(this._constraints)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  handleSuccess(stream: MediaStream) {
    const audioTracks = stream.getAudioTracks();
    console.log("Got stream with constraints:", window.constraints);
    console.log("Using audio device: " + audioTracks[0].label);
    stream.onremovetrack = function () {
      console.log("Stream ended");
    };
    window.stream = stream; // make variable available to browser console

    var bjsSound = new Sound("mic", stream, this._scene);
    //bjsSound.attachToMesh(sphere);
    bjsSound.play();
    var soundTrack = new SoundTrack(this._scene);
    soundTrack.addSound(bjsSound);
    this._analyser = new Analyser(this._scene);

    soundTrack.connectToAnalyser(this._analyser);
    this._analyser.FFT_SIZE = 2048;
    this._analyser.SMOOTHING = 0.9;

    if(this._debug) this._debugGraph = new Debug(this._analyser);

    console.log(this._analyser);
    this._audioReady = true;
    // Low Gain 0-500 Hz
    // Mid Gain 500-4500Hz
    // High Gain 4500 +

    this._raw = 0
    this._intensity = 0
    this._difference = 0
  }

  handleError(error: string) {
    console.log("navigator.getUserMedia error: ", error);
  }

  registerBeforeRender() {
    if (this._audioReady) {
        // UNCOMMENT TO SHOW DEBUG
        if(this._debug) this._debugGraph.draw();

        let waveform = this._analyser.getByteTimeDomainData();
        let waveformLength = this._analyser.getFrequencyBinCount();

        for (let i = 0; i < waveformLength; i++) {
            let waveformValue = waveform[i] / 256;
            Audio.actions.WAVEFORM.value = waveformValue
        }

        let spectrum = this._analyser.getByteFrequencyData();
        let spectrumLength = this._analyser.getFrequencyBinCount();
        const split1 = 300;
        const split2 = 630;
        const lowGain = 0.2;
        const midGain = 1;
        const highGain = 3;

        this._raw = 0;


        Audio.actions.SPECTRUM_LOW.value = 0;
        Audio.actions.SPECTRUM_MID.value  = 0;
        Audio.actions.SPECTRUM_HIGH.value =  0;

        for (let i = 0; i < 300; i++) {
            let spectrumValue = spectrum[i] / 256;
            this._raw += spectrumValue;
            /*if (i <= split1) {
                spectrumValue *= lowGain;
                Audio.actions.SPECTRUM_LOW.value = Math.max(spectrumValue, Audio.actions.SPECTRUM_LOW.value);
            } else if (i > split1 && i < split2) {
                spectrumValue *= midGain;
                Audio.actions.SPECTRUM_MID.value = Math.max(spectrumValue, Audio.actions.SPECTRUM_MID.value);;
            } else if (i >= split2) {
                spectrumValue *= highGain;
                Audio.actions.SPECTRUM_HIGH.value = Math.max(spectrumValue, Audio.actions.SPECTRUM_HIGH.value);;
            }*/
        }

        this._raw /= 300;

        this._intensity += (this._raw - this._intensity) * 0.01;
        this._difference += ((this._raw - this._intensity) * 10.0 - this._difference) * 0.2

        Audio.actions.SPECTRUM_CURRENT.value = this._difference;
    }
}
}

class Debug {
  private _analyser: Analyser;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _borderHeight:number;
  private _spectrumLength:number;
  private _spectrumWidth:number;
  private _spectrumHeight:number;
  private _spectrum:Uint8Array;
  
  constructor(analyser: Analyser) {
    this._analyser = analyser;

    this._canvas = document.createElement("canvas");
    this._canvas.width = 512;
    this._canvas.height = 300;
    this._canvas.style.position = "absolute";
    this._canvas.style.bottom = "0";
    this._canvas.style.left = "0";
    this._canvas.style.zIndex = "3";
    document.body.appendChild(this._canvas);
    this._ctx = this._canvas.getContext("2d")!;
    this._borderHeight = 10;

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();
  }

  resize() {
    this._canvas.width = window.innerWidth;
  }

  draw() {

    this._spectrum = this._analyser.getByteFrequencyData();
    this._spectrumLength = this._analyser.getFrequencyBinCount();
    this._spectrumWidth = this._canvas.width / this._spectrumLength;
    this._spectrumHeight = this._canvas.height - this._borderHeight;

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    //draw background
    this.drawBackground();

    // draw spectrum
    this.drawSpectrum();

    // draw frequency
    this.drawFrequency();
    // draw kick
    // this.drawKick();

    // draw waveform
    this.drawWaveForm();
  }

  drawBackground() {
    this._ctx.beginPath();
    this._ctx.rect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.fillStyle = "#000000";
    this._ctx.fill();
    this._ctx.strokeStyle = "#a1a1a1";
    this._ctx.stroke();
  }

  drawSpectrum() {
    this._ctx.beginPath();
    const split1 = 300;
    const split2 = 630;
    const lowGain = 0.2;
    const midGain = 1;
    const highGain = 3;
    for (let i = 0; i < this._spectrumLength; i++) {
      let spectrumValue = this._spectrum[i] / 256;
      this._ctx.rect(
        i * this._spectrumWidth,
        this._spectrumHeight - this._spectrumHeight * spectrumValue,
        this._spectrumWidth / 2,
        this._spectrumHeight * spectrumValue
      );
    }
    this._ctx.fillStyle = "#ffffff";
    this._ctx.fill();

    this._ctx.beginPath();
    this._ctx.globalAlpha = 0.3;
    for (let i = 0; i < this._spectrumLength; i++) {
      let spectrumValue = this._spectrum[i] / 256;
      let sectionWidth = split1;
      let sectionStart = 0;
      if (i <= split1) {
        sectionWidth = this._spectrumWidth * split1;
        sectionStart = 0;
        spectrumValue *= lowGain;
      } else if (i > split1 && i < split2) {
        sectionWidth = this._spectrumWidth * (split2 - split1);
        sectionStart = this._spectrumWidth * split1;
        spectrumValue *= midGain;
      } else if (i >= split2) {
        // >= split2
        sectionWidth = this._canvas.width - split2 * this._spectrumWidth;
        sectionStart = this._spectrumWidth * split2;
        spectrumValue *= highGain;
      }
      this._ctx.rect(
        sectionStart,
        this._spectrumHeight - this._spectrumHeight * spectrumValue,
        sectionWidth,
        this._spectrumHeight * spectrumValue
      );
    }
    this._ctx.fillStyle = "#e4e";
    this._ctx.fill();
    this._ctx.globalAlpha = 1;
  }

  drawFrequency() {
    this._ctx.beginPath();
    this._ctx.font = "10px Arial";
    this._ctx.textBaseline = "middle";
    this._ctx.textAlign = "left";
    for (let i = 0, len = this._spectrumLength; i < len; i++) {
      if (i % 10 == 0) {
        this._ctx.rect(i * this._spectrumWidth, this._spectrumHeight, this._spectrumWidth / 2, this._borderHeight);
        this._ctx.fillText(`${i}`, i * this._spectrumWidth + 4, this._spectrumHeight + this._borderHeight * 0.5);
      }
    }
    this._ctx.fillStyle = "#e4e";
    this._ctx.fill();
  }

  drawWaveForm() {
    this._ctx.beginPath();
    let waveform = this._analyser.getByteTimeDomainData();
    let waveformLength = this._analyser.getFrequencyBinCount();
    let waveformWidth = this._canvas.width / waveformLength;
    let waveformHeight = this._canvas.height - this._borderHeight;
    for (let i = 0; i < waveformLength; i++) {
      let waveformValue = waveform[i] / 256;
      if (i == 0) this._ctx.moveTo(i * waveformWidth, waveformHeight * waveformValue);
      else this._ctx.lineTo(i * waveformWidth, waveformHeight * waveformValue);
    }
    this._ctx.strokeStyle = "#0000ff";
    this._ctx.stroke();
  }

  registerBeforeRender() {
    
  }

}

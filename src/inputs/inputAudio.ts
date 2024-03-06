import { Analyser, Scene, Engine, Sound, SoundTrack } from "@babylonjs/core";
declare global {
  interface Window {
    stream: MediaStream;
    constraints: MediaStreamConstraints;
  }
}
export class InputAudio {
  private _scene: Scene;
  private _constraints: MediaStreamConstraints;
  private _analyser: Analyser;
  private _audioReady: boolean;
  private _debug: Debug;

  constructor(scene: Scene) {
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

    this._debug = new Debug(this._analyser);

    console.log(this._analyser);
    this._audioReady = true;
    // Low Gain 0-500 Hz
    // Mid Gain 500-4500Hz
    // High Gain 4500 +
  }

  handleError(error) {
    console.log("navigator.getUserMedia error: ", error);
  }

  registerBeforeRender() {
    if (this._audioReady) {
      // UNCOMMENT TO SHOW DEBUG
       this._debug.draw();

      var workingArrayTime = this._analyser.getByteFrequencyData();
      //loop scales mesh with each value
      for (var i = 0; i < this._analyser.getFrequencyBinCount(); i++) {
        //frequency bin count is 1/2 of FFT_SIZE
        var size = workingArrayTime[i];
      }
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

  // drawKick() {
  //   let kicks = this.kicks;
  //   let kickLength = kicks.length;
  //   for (let i = 0, len = kickLength; i < len; i++) {

  //       const kick = kicks[i];
  //       if (kick.isOn) {
  //           const kickFrequencyStart = (kick.frequency.length ? kick.frequency[0] : kick.frequency);
  //           const kickFrequencyLength = (kick.frequency.length ? kick.frequency[1] - kick.frequency[0] + 1 : 1);
  //           this._ctx.beginPath();
  //           this._ctx.rect(kickFrequencyStart * this._spectrumWidth, this._spectrumHeight - this._spectrumHeight * (kick.threshold / 256), kickFrequencyLength * this._spectrumWidth - (this._spectrumWidth * .5), 2);
  //           this._ctx.rect(kickFrequencyStart * this._spectrumWidth, this._spectrumHeight - this._spectrumHeight * (kick.currentThreshold / 256), kickFrequencyLength * this._spectrumWidth - (this._spectrumWidth * .5), 5);
  //           this._ctx.fillStyle = kick.isKick ? '#00ff00' : '#ff0000';
  //           this._ctx.fill();
  //       }
  //   }
  // }

}

class Kick {
  frequency: number[];
  threshold: number;
  decay: number;
  onKick: any;
  offKick: any;
  isOn: boolean;
  isKick: boolean;
  currentThreshold: any;

  constructor({ frequency, threshold, decay, onKick, offKick }) {
    this.frequency = frequency !== undefined ? frequency : [0, 10];
    this.threshold = threshold !== undefined ? threshold : 0.3;
    this.decay = decay !== undefined ? decay : 0.02;
    this.onKick = onKick;
    this.offKick = offKick;
    this.isOn = false;
    this.isKick = false;
    this.currentThreshold = this.threshold;
  }

  on() {
    this.isOn = true;
  }

  off() {
    this.isOn = false;
  }

  set({ frequency, threshold, decay, onKick, offKick }) {
    this.frequency = frequency !== undefined ? frequency : this.frequency;
    this.threshold = threshold !== undefined ? threshold : this.threshold;
    this.decay = decay !== undefined ? decay : this.decay;
    this.onKick = onKick || this.onKick;
    this.offKick = offKick || this.offKick;
  }

  calc(spectrum) {
    if (!this.isOn) {
      return;
    }
    let magnitude = this.maxAmplitude(spectrum, this.frequency);
    if (magnitude >= this.currentThreshold && magnitude >= this.threshold) {
      this.currentThreshold = magnitude;
      this.onKick && this.onKick(magnitude);
      this.isKick = true;
    } else {
      this.offKick && this.offKick(magnitude);
      this.currentThreshold -= this.decay;
      this.isKick = false;
    }
  }

  maxAmplitude(fft, frequency) {
    let max = 0;

    // Sloppy array check
    if (!frequency.length) {
      return frequency < fft.length ? fft[~~frequency] : null;
    }

    for (var i = frequency[0], l = frequency[1]; i <= l; i++) {
      if (fft[i] > max) {
        max = fft[i];
      }
    }

    return max;
  }
}

class Beat {
  onBeat: any;
  factor: any;
  isOn: boolean;
  currentTime: number;

  constructor({ factor, onBeat }) {
    this.factor = factor !== undefined ? factor : 1;
    this.onBeat = onBeat;
    this.isOn = false;
    this.currentTime = 0;
  }

  on() {
    this.isOn = true;
  }

  off() {
    this.isOn = false;
  }

  set({ factor, onBeat }) {
    this.factor = factor !== undefined ? factor : this.factor;
    this.onBeat = onBeat || this.onBeat;
  }

  calc(time, beatDuration) {
    if (time == 0) {
      return;
    }
    let beatDurationFactored = beatDuration * this.factor;
    if (time >= this.currentTime + beatDurationFactored) {
      if (this.isOn) this.onBeat && this.onBeat();
      this.currentTime += beatDurationFactored;
    }
  }
}

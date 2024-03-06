import { Analyser, Scene, Engine, Sound, SoundTrack } from "@babylonjs/core";
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
  private kicks: [Kick];
  constructor(scene: Scene) {
    this.audioReady = false;
    this.scene = scene;
    this.constraints = window.constraints = {
      audio: true,
      video: false,
    };
    this.handleSuccess = this.handleSuccess.bind(this);

    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  handleSuccess(stream) {
    const audioTracks = stream.getAudioTracks();
    console.log("Got stream with constraints:", window.constraints);
    console.log("Using audio device: " + audioTracks[0].label);
    stream.oninactive = function () {
      console.log("Stream ended");
    };
    window.stream = stream; // make variable available to browser console

    var bjsSound = new Sound("mic", stream, this.scene);
    //bjsSound.attachToMesh(sphere);
    bjsSound.play();
    var soundTrack = new SoundTrack(this.scene);
    soundTrack.addSound(bjsSound);
    this.analyser = new Analyser(this.scene);

    soundTrack.connectToAnalyser(this.analyser);
    this.analyser.FFT_SIZE = 2048;
    this.analyser.SMOOTHING = 0.9;

    this.debug = new Debug(this.analyser);

    console.log(this.analyser);
    this.audioReady = true;
    // Low Gain 0-500 Hz
    // Mid Gain 500-4500Hz
    // High Gain 4500 +
  }

  handleError(error) {
    console.log("navigator.getUserMedia error: ", error);
  }

  registerBeforeRender() {
    // var workingArray = myAnalyser.getByteFrequencyData();

    // for (var i = 0; i < myAnalyser.getFrequencyBinCount() ; i++) {
    //     spatialBoxArray[i].scaling.y =  workingArray[i] / 32;
    // }
    //creates array, copies frequency data into the passed unsigned byte array
    //var workingArrayFreq = myAnalyser.getByteFrequencyData();

    if (this.audioReady) {
      // UNCOMMENT TO SHOW DEBUG
       this.debug.draw();

      var workingArrayTime = this.analyser.getByteFrequencyData();

      //loop scales mesh with each value
      for (var i = 0; i < this.analyser.getFrequencyBinCount(); i++) {
        //frequency bin count is 1/2 of FFT_SIZE
        var size = workingArrayTime[i];
        //console.log("i : ", i,  " -> ", size)
        // speaker1.scaling = new BABYLON.Vector3(size,size,size);
        // speaker2.scaling = new BABYLON.Vector3(size,size,size);
      }
    }
  }
}

class Debug {
  private analyser: Analyser;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  constructor(analyser: Analyser) {
    this.analyser = analyser;

    this.canvas = document.createElement("canvas");
    this.canvas.width = 512;
    this.canvas.height = 300;
    this.canvas.style.position = "absolute";
    this.canvas.style.bottom = "0";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "3";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();
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
    this.ctx.fillStyle = "#000000";
    this.ctx.fill();
    this.ctx.strokeStyle = "#a1a1a1";
    this.ctx.stroke();

    // draw spectrum
    this.ctx.beginPath();
    let spectrum = this.analyser.getByteFrequencyData();
    let spectrumLength = this.analyser.getFrequencyBinCount();
    let spectrumWidth = this.canvas.width / spectrumLength;
    let spectrumHeight = this.canvas.height - borderHeight;
    const split1 = 300;
    const split2 = 630;
    const lowGain = 0.2;
    const midGain = 1;
    const highGain = 3;
    for (let i = 0; i < spectrumLength; i++) {
      let spectrumValue = spectrum[i] / 256;
      this.ctx.rect(
        i * spectrumWidth,
        spectrumHeight - spectrumHeight * spectrumValue,
        spectrumWidth / 2,
        spectrumHeight * spectrumValue
      );
    }
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.globalAlpha = 0.3;
    for (let i = 0; i < spectrumLength; i++) {
      let spectrumValue = spectrum[i] / 256;
      let sectionWidth = split1;
      let sectionStart = 0;
      if (i <= split1) {
        sectionWidth = spectrumWidth * split1;
        sectionStart = 0;
        spectrumValue *= lowGain;
      } else if (i > split1 && i < split2) {
        sectionWidth = spectrumWidth * (split2 - split1);
        sectionStart = spectrumWidth * split1;
        spectrumValue *= midGain;
      } else if (i >= split2) {
        // >= split2
        sectionWidth = this.canvas.width - split2 * spectrumWidth;
        sectionStart = spectrumWidth * split2;
        spectrumValue *= highGain;
      }
      this.ctx.rect(
        sectionStart,
        spectrumHeight - spectrumHeight * spectrumValue,
        sectionWidth,
        spectrumHeight * spectrumValue
      );
    }
    this.ctx.fillStyle = "#e4e";
    this.ctx.fill();
    this.ctx.globalAlpha = 1;

    // draw frequency
    this.ctx.beginPath();
    this.ctx.font = "10px Arial";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "left";
    for (let i = 0, len = spectrumLength; i < len; i++) {
      if (i % 10 == 0) {
        this.ctx.rect(i * spectrumWidth, spectrumHeight, spectrumWidth / 2, borderHeight);
        this.ctx.fillText(`${i}`, i * spectrumWidth + 4, spectrumHeight + borderHeight * 0.5);
      }
    }
    this.ctx.fillStyle = "#e4e";
    this.ctx.fill();

    // // draw kick
    // let kicks = this.kicks;
    // let kickLength = kicks.length;
    // for (let i = 0, len = kickLength; i < len; i++) {

    //     const kick = kicks[i];
    //     if (kick.isOn) {
    //         const kickFrequencyStart = (kick.frequency.length ? kick.frequency[0] : kick.frequency);
    //         const kickFrequencyLength = (kick.frequency.length ? kick.frequency[1] - kick.frequency[0] + 1 : 1);
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
      let waveformValue = waveform[i] / 256;
      if (i == 0) this.ctx.moveTo(i * waveformWidth, waveformHeight * waveformValue);
      else this.ctx.lineTo(i * waveformWidth, waveformHeight * waveformValue);
    }
    this.ctx.strokeStyle = "#0000ff";
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

class Kick {
  frequency: any;
  threshold: any;
  decay: any;
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

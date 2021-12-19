export class Midi {
  constructor() {
    this.initMidi()
  }

  initMidi() {
    navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure)
  }

  onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
    console.log(midiAccess)

    const inputs: WebMidi.MIDIInputMap = midiAccess.inputs
    //const outputs: WebMidi.MIDIOutputMap = midiAccess.outputs
    for (let input of inputs.values()) {
      console.log(input)
      input.onmidimessage = (m) => {
        this.getMIDIMessage(m)
      }
    }
  }

  getMIDIMessage(m: WebMidi.MIDIMessageEvent) {
    console.log(m)
  }

  onMIDIFailure() {
    console.log("Could not access your MIDI devices.")
  }
}

export class Midi {
  constructor() {
    this.initMidi()
  }

  initMidi() {
    navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure)
  }

  onMIDISuccess(midiAccess) {
    console.log(midiAccess)

    var inputs = midiAccess.inputs
    var outputs = midiAccess.outputs
    for (var input of inputs.values()) {
      console.log(input)
      input.onmidimessage = (m) => {
        this.getMIDIMessage(m)
      }
    }
  }

  getMIDIMessage(m) {
    console.log(m)
  }

  onMIDIFailure() {
    console.log("Could not access your MIDI devices.")
  }
}

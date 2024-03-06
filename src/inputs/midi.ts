export class Midi {
  constructor() {
    this.init()
  }

  init() {
    navigator.requestMIDIAccess().then( (access : WebMidi.MIDIAccess) => this.onSuccess(access), () => this.onFailure())
  }

  onSuccess(access: WebMidi.MIDIAccess) {
    console.log(access)

    const inputs: WebMidi.MIDIInputMap = access.inputs
    //const outputs: WebMidi.MIDIOutputMap = midiAccess.outputs
    for (let input of inputs.values()) {
      console.log(input)
      input.onmidimessage = (m) => this.onMessage(m);
    }
  }

  onMessage(m: WebMidi.MIDIMessageEvent) {
    const [command, key, velocity] = m.data;

    console.log(m)
  }

  onFailure() {
    console.log("Could not access your MIDI devices.")
  }
}

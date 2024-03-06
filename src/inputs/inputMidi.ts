



export class InputMidi {

  private data: any;

  constructor() {
    this.init();
    this.data = {};
  }

  init() {
    navigator.requestMIDIAccess().then( (access) => {
      //Baise tes morts typescript
      this.onSuccess(access as unknown as WebMidi.MIDIAccess)
    }, () => this.onFailure())
  }

  onSuccess(access: WebMidi.MIDIAccess) {
    const inputs: WebMidi.MIDIInputMap = access.inputs
    //const outputs: WebMidi.MIDIOutputMap = midiAccess.outputs
    for (let input of inputs.values()) {
      input.onmidimessage = (m) => this.onMessage(m);
    }
  }

  onMessage(m: WebMidi.MIDIMessageEvent) {
    const [command, key, velocity] = m.data;

    console.log(m.data)
  }

  onFailure() {
    console.log("Could not access your MIDI devices.")
  }
}

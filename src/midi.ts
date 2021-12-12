export class Midi {
    constructor() {
        navigator.requestMIDIAccess()
        .then(this.onMIDISuccess, this.onMIDIFailure);
    }

    onMIDISuccess(midiAccess) {
        console.log(midiAccess);
    
        var inputs = midiAccess.inputs;
        var outputs = midiAccess.outputs;
    }
    
    onMIDIFailure() {
        console.log('Could not access your MIDI devices.');
    }
}
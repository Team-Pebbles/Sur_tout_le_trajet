import { Inputs } from "./inputs";
import { MidiInputType, MidiMapping } from "./inputTypes";



export class MidiSource {

    private keys: number[][];
    private controls: number[][];

    constructor() {
        this.init();
        //this.data = {};
    }

    init() {
        navigator.requestMIDIAccess().then((access) => {
            //Baise tes morts typescript
            this.onSuccess(access as unknown as WebMidi.MIDIAccess)
        }, () => this.onFailure())
    }

    onSuccess(access: WebMidi.MIDIAccess) {
        const inputs: WebMidi.MIDIInputMap = access.inputs
        this.createChannels();
        for (let input of inputs.values()) {
            input.onmidimessage = (m) => this.onMessage(m);
        }
    }

    onFailure() {
        console.log("Could not access your MIDI devices.")
    }

    createChannels() {
        this.keys = [];
        this.controls = [];
        for (let i = 0; i < 16; i++) {
            this.keys[i] = [];
            this.controls[i] = [];
            for (let j = 0; j < 127; j++) {
                this.keys[i][j] = 0;
                this.controls[i][j] = 0;
            }
        }
    }

    onMessage(m: WebMidi.MIDIMessageEvent) {
        const [command, key, velocity] = m.data;
        const device = m.target ? m.target["name"] : "unknown";

        const debug = true;

        if (device == "MPK mini 3") Inputs.activeMap = 0;
        if (device == "Arturia MiniLab mkII") Inputs.activeMap = 1;


        const value = velocity / 127;
        //Note OFF
        if (command >= 128 && command < 144) {
            const channel = command - 128;
            this.keys[channel][key] = value;
            if(debug) console.log(`%cNote OFF [${channel},${key}]`, 'color: red');
        }
        //Note ON
        else if (command >= 144 && command < 160) {
            const channel = command - 144;
            this.keys[channel][key] = value;
            if(debug) console.log(`%cNote ON [${channel},${key}] ${value}`, 'color: lightgreen');
        }//Controls
        else if (command >= 176 && command < 192) {
            const channel = command - 176;
            this.controls[channel][key] = value;
            if(debug) console.log(`%cControl [${channel},${key}] ${value}`, 'color: cyan');
        }
    }

    get(mapping: MidiMapping): number {
        if (mapping.type == MidiInputType.KEY) {
            return this.keys[mapping.channel][mapping.id];
        } else {
            return this.controls[mapping.channel][mapping.id];
        }
    }

}


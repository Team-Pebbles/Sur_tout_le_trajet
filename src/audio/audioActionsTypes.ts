
export class AudioAction {
    value: number
    max: number
    average: number
    intensity: number
    difference: number
    cool: number
    nbFreq: number

    constructor() {
        this.value = 0;
        this.average = 0;
        this.intensity = 0;
        this.difference = 0;
        this.max = 0;
        this.cool = 0;
        this.nbFreq = 0;
    }


    update() {
        this.average = this.value/this.nbFreq;
        this.intensity += (this.average - this.intensity) * 0.01;
        this.difference += ((this.average - this.intensity) * 10.0 - this.difference) * 0.7;
        this.cool = (this.max + Math.max(this.difference,0)) * .5;
        this.nbFreq = 0;
    }

    reset() {
        this.value = 0;
        this.max = 0;
    }

    add(value: number) {
        this.max = Math.max(this.max, value);
        this.value += value;
        this.nbFreq++;
    }


}


export interface AudioActionList {
    WAVEFORM: AudioAction
    SPECTRUM_CURRENT: AudioAction
    SPECTRUM_LOW: AudioAction
    SPECTRUM_MID: AudioAction
    SPECTRUM_HIGH: AudioAction
}

export interface AudioActions {
    name: string
    actions: AudioActionList
}

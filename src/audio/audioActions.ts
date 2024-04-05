import { AudioActions, AudioActionList, AudioAction } from "./audioActionsTypes"

export const Audio: AudioActions = {
    name: "AudioActions",
    actions: {
        WAVEFORM: new AudioAction(),
        SPECTRUM_CURRENT: new AudioAction(),
        SPECTRUM_LOW: new AudioAction(),
        SPECTRUM_MID: new AudioAction(),
        SPECTRUM_HIGH: new AudioAction(),
    },
}

const AudioAGraphHandler: ProxyHandler<any> = {
    get: (target: AudioActionList, prop) => {
        return {
            value: target[prop].value,
        }
    },
    set: (target: AudioActionList, prop, newVal: number) => {
        target[prop].value = newVal
        return true
    },
}

export const AudioAGraph: AudioActionList = new Proxy(
    Audio.actions,
    AudioAGraphHandler
)


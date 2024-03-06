import { AudioActions, AudioActionList  } from "./audioActionsTypes"

export const Audio : AudioActions = {
  name: "AudioActions",
    actions: {
        WAVEFORM: {
            value: 0,
        },
        SPECTRUM_CURRENT: {
            value: 0,
        },
        SPECTRUM_LOW: {
            value: 0,
        },
        SPECTRUM_MID: {
            value: 0,
        },
        SPECTRUM_HIGH: {
            value: 0,
        },
    },
}

const AudioAGraphHandler: ProxyHandler<any> = {
  get: (target: AudioActionList, prop) => {
    return {
      value:target[prop].value,
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


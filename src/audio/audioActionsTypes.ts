  
  export interface AudioAction {
    value: number
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
  
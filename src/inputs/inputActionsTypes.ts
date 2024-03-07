import { PointerInput, XboxInput } from "@babylonjs/core"

export enum MidiInputType{
  KEY,
  CONTROL
}

export interface MidiMapping { 
  type: MidiInputType, 
  channel: number, 
  id: number 
}

export interface InputMapping {
  xbox?: XboxInput | [XboxInput, XboxInput]
  mouse?: PointerInput | [PointerInput, PointerInput]
  keyboard?: number | [number, number]
  midi?: MidiMapping
}
  
  export interface InputAction {
    mapping: InputMapping
    value: number,
    smoothValue: number,
    once: boolean
  }
  
  
  export interface InputActionList {
    MOVE_Z: InputAction
    MOVE_X: InputAction
    MOVE_Y: InputAction
    
    LOOK_X: InputAction
    LOOK_Y: InputAction

    CONTINUOUS_FWD: InputAction;
    HEIGHT: InputAction;
    SLICE: InputAction;
    SLICE_ROTATE: InputAction;
  }
  
  export interface IAMaps {
    name: string
    actions: InputActionList
  }
  
  export interface InputActions {
    name: string
    mapIndex: number
    maps: Array<IAMaps>
  }
  
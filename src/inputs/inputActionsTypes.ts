import { PointerInput, XboxInput } from "@babylonjs/core"

export interface InputMapping {
  xbox?: XboxInput | [XboxInput, XboxInput]
  mouse?: PointerInput | [PointerInput, PointerInput]
  keyboard?: number | [number, number]
  midi?: number | [number, number]
}
  
  export interface InputAction {
    mapping: InputMapping
    value: number
  }
  
  
  export interface InputActionList {
    MOVE_Z: InputAction
    MOVE_X: InputAction
    MOVE_Y: InputAction
    
    LOOK_X: InputAction
    LOOK_Y: InputAction
  }
  
  export interface IAMaps {
    name: string
    actions: InputActionList
  }
  
  export interface InputActions {
    name: string
    maps: Array<IAMaps>
  }
  
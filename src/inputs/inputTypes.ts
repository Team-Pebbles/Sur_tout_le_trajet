import { PointerInput, XboxInput } from "@babylonjs/core"

export interface InputActionMap {
    name: string
    actions: InputActions
}

export enum MidiInputType {
    KEY,
    CONTROL
}

export interface MidiMapping {
    type: MidiInputType,
    channel: number,
    id: number
}

export interface InputAction {
    xbox?: XboxInput | [XboxInput, XboxInput]
    mouse?: PointerInput | [PointerInput, PointerInput]
    keyboard?: number | [number, number]
    midi?: MidiMapping
}

export interface InputValue{
    value: number,
    smoothValue: number
    once: boolean
}

export interface InputActions {
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

export interface InputValues {
    MOVE_Z: InputValue
    MOVE_X: InputValue
    MOVE_Y: InputValue

    LOOK_X: InputValue
    LOOK_Y: InputValue

    CONTINUOUS_FWD: InputValue;
    HEIGHT: InputValue;
    SLICE: InputValue;
    SLICE_ROTATE: InputValue;
}


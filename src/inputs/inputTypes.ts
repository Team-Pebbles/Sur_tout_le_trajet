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
    RECORD_MOVE: InputAction

    LOOK_X: InputAction
    LOOK_Y: InputAction

    CONTINUOUS_FWD: InputAction;
    HEIGHT: InputAction;
    SLICE: InputAction;
    SLICE_ROTATE: InputAction;
    COLOR_LIGHTNESS: InputAction;
    COLOR_CHROMA: InputAction;
    COLOR_HUE: InputAction;
    COLOR_MIX: InputAction;
    COLOR_ABSURD : InputAction;
    SWITCH_MAP: InputAction;
    CONTROL_SENSITIVITY_PLUS: InputAction;
    CONTROL_SENSITIVITY_MINUS: InputAction;
    DRAW_TITLE: InputAction;
    DRAW_CREDITS: InputAction;
    DRAW_VIDES: InputAction;
    DRAW_SEULE: InputAction;
    DRAW_NULLEPART: InputAction;
    DRAW_AISJEDIT: InputAction;
    DRAW_MONCORPS: InputAction;
    DRAW_TRAJET: InputAction;
    DRAW_VOYAGE: InputAction;
    DRAW_AILLEURS: InputAction;
    DRAW_REALITE: InputAction;
    DRAW_PLAGIAT: InputAction;
    DRAW_WHOAREYOU: InputAction;
    DRAW_REVE: InputAction;
    DRAW_REEL: InputAction;
    RESET_CAM: InputAction;
}

export interface InputValues {
    MOVE_Z: InputValue
    MOVE_X: InputValue
    MOVE_Y: InputValue
    RECORD_MOVE: InputValue

    LOOK_X: InputValue
    LOOK_Y: InputValue

    CONTINUOUS_FWD: InputValue;
    HEIGHT: InputValue;
    SLICE: InputValue;
    SLICE_ROTATE: InputValue;
    COLOR_LIGHTNESS: InputValue;
    COLOR_CHROMA: InputValue;
    COLOR_HUE: InputValue;
    COLOR_MIX: InputValue;
    COLOR_ABSURD: InputValue;
    SWITCH_MAP: InputValue;
    CONTROL_SENSITIVITY_PLUS: InputValue;
    CONTROL_SENSITIVITY_MINUS: InputValue;

    DRAW_TITLE: InputValue;
    DRAW_CREDITS: InputValue;
    DRAW_VIDES: InputValue;
    DRAW_SEULE: InputValue;
    DRAW_NULLEPART: InputValue;
    DRAW_AISJEDIT: InputValue;
    DRAW_MONCORPS: InputValue;
    DRAW_TRAJET: InputValue;
    DRAW_VOYAGE: InputValue;
    DRAW_AILLEURS: InputValue;
    DRAW_REALITE: InputValue;
    DRAW_PLAGIAT: InputValue;
    DRAW_WHOAREYOU: InputValue;
    DRAW_REVE: InputValue;
    DRAW_REEL: InputValue;
    RESET_CAM: InputValue;
}


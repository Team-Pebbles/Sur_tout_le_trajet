
import { XboxInput } from "@babylonjs/core";
import { InputActionMap, MidiInputType } from "./inputTypes";

export const mapLouis: InputActionMap = {
    name: "Louis",
    actions: {
        MOVE_Z: {
            keyboard: [90, 83], //Z, S
            xbox: XboxInput.LStickYAxis
        },
        MOVE_X: {
            keyboard: [81, 68], //Z, S
            xbox: XboxInput.LStickXAxis
        },
        MOVE_Y: {
            keyboard: [16, 32], //SHIFT, SPACE
            xbox: [XboxInput.LT, XboxInput.RT]
        },
        LOOK_X: {
            //mouse: PointerInput.Horizontal,
            xbox: XboxInput.RStickXAxis

        },
        LOOK_Y: {
            // mouse: PointerInput.Vertical,
            xbox: XboxInput.RStickYAxis
        },
        CONTINUOUS_FWD: {
            midi: {
                type: MidiInputType.CONTROL,
                channel: 0,
                id: 70,
            }
        },
        HEIGHT: {
            midi: {
                type: MidiInputType.CONTROL,
                channel: 0,
                id: 71,
            }
        },
        SLICE: {
            midi: {
                type: MidiInputType.CONTROL,
                channel: 0,
                id: 72,
            }
        },
        SLICE_ROTATE: {
            midi: {
                type: MidiInputType.CONTROL,
                channel: 0,
                id: 73,
            }
        },
        SWITCH_MAP: {
            keyboard: 77, //m
            midi: {
                type: MidiInputType.KEY,
                channel: 9,
                id: 40,
            },
            xbox: XboxInput.B
        },
        RESET_CAM: {
            keyboard: 77,//M
            midi: {
                type: MidiInputType.KEY,
                channel: 9,
                id: 36,
            },
            xbox: XboxInput.B
        },
        CONTROL_SENSITIVITY_PLUS: {
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 43,
            }
        },
        CONTROL_SENSITIVITY_MINUS: {
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 42,
            }
        },
        DRAW_TITLE: {
            keyboard: 80, //p
        },
        DRAW_CREDITS: {
            keyboard: 67, //c
        },
        DRAW_VIDES: {
            keyboard: 68,
        },
        DRAW_SEULE: {
            keyboard: 69,
        },
        DRAW_NULLEPART: {
            keyboard: 74,
        },
        DRAW_MONCORPS: {
            keyboard: 75,
        },
        DRAW_AILLEURS: {
            keyboard: 76,
        },
        DRAW_REALITE: {
            keyboard: 78,
        },
        DRAW_PLAGIAT: {
            keyboard: 79,
        },
        DRAW_WHOAREYOU: {
            keyboard: 83,
        },
        DRAW_REVE: {
            keyboard: 81,
        },
        DRAW_REEL: {
            keyboard: 82,
        },
    },
}

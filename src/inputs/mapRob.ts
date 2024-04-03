import { XboxInput } from "@babylonjs/core";
import { InputActionMap, MidiInputType } from "./inputTypes";

export const mapRob: InputActionMap = {
    name: "Rob",
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
                id: 71,
            }
        },
        HEIGHT: {
            midi: {
                type: MidiInputType.CONTROL,
                channel: 0,
                id: 76,
            }
        },
        SLICE: {
            midi: {
                type: MidiInputType.CONTROL,
                channel: 0,
                id: 77,
            }
        },
        SLICE_ROTATE: {
            midi: {
                type: MidiInputType.CONTROL,
                channel: 0,
                id: 93,
            }
        },
        SWITCH_MAP: {
            midi: {
                type: MidiInputType.KEY,
                channel: 9,
                id: 36,
            }
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
        }
    },
}

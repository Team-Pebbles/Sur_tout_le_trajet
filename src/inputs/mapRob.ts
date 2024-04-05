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
        RECORD_MOVE:{
            xbox: XboxInput.RB
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
            },
        },
        SLICE_ROTATE: {
            midi: {
                type: MidiInputType.CONTROL,
                channel: 0,
                id: 93,
            }
        },
        SWITCH_MAP: {
            keyboard: 77,//M
            midi: {
                type: MidiInputType.KEY,
                channel: 9,
                id: 36,
            },
            xbox: XboxInput.A
        },
        RESET_CAM: {
            keyboard: 77,//M
            midi: {
                type: MidiInputType.KEY,
                channel: 9,
                id: 37,
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
            keyboard: 80,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 48,
            }
        },
        DRAW_CREDITS: {
            keyboard: 67,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 72,
            } //c
        },
        DRAW_VIDES: {
            keyboard: 68,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 50,
            }
        },
        DRAW_SEULE: {
            keyboard: 69,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 52,
            }
        },
        DRAW_NULLEPART: {
            keyboard: 74,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 53,
            }
        },
        DRAW_AISJEDIT: {
            keyboard: 75,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 55,
            }
        },
        DRAW_MONCORPS: {
            keyboard: 75,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 57,
            }
        },
        DRAW_TRAJET: {
            keyboard: 75,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 59,
            }
        },
        DRAW_VOYAGE: {
            keyboard: 75,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 60,
            }
        },
        DRAW_AILLEURS: {
            keyboard: 76,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 62,
            }
        },
        DRAW_REALITE: {
            keyboard: 78,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 64,
            }
        },
        DRAW_PLAGIAT: {
            keyboard: 79,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 65,
            }
        },
        DRAW_WHOAREYOU: {
            keyboard: 83,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 67,
            }
        },
        DRAW_REVE: {
            keyboard: 81,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 69,
            }
        },
        DRAW_REEL: {
            keyboard: 82,
            midi: {
                type: MidiInputType.KEY,
                channel: 0,
                id: 71,
            }
        },
    },
}

import { PointerInput, XboxInput } from "@babylonjs/core"
import { InputActions, IAMaps, InputActionList, MidiInputType  } from "./inputActionsTypes"

export const Inputs : InputActions = {
  name: "inputsAction",
  mapIndex: 1,
  maps: [
    {
      name: "Louis",
      actions: {
        MOVE_Z: {
          mapping: {
            keyboard: [ 90, 83 ], //Z, S
            xbox: XboxInput.LStickYAxis
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        MOVE_X: {
          mapping: {
            keyboard: [ 81, 68 ], //Z, S
            xbox: XboxInput.LStickXAxis
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        MOVE_Y: {
          mapping: {
            keyboard: [ 16, 32 ], //SHIFT, SPACE
            xbox: [ XboxInput.LT, XboxInput.RT]
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        LOOK_X: {
          mapping: {
         //   mouse: PointerInput.Horizontal,
            xbox: XboxInput.RStickXAxis
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        LOOK_Y: {
          mapping: {
           // mouse: PointerInput.Vertical,
            xbox: XboxInput.RStickYAxis
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        CONTINUOUS_FWD: {
          mapping: {
            midi:{
              type: MidiInputType.CONTROL,
              channel: 0,
              id: 70,
            }
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        HEIGHT: {
          mapping: {
            midi:{
              type: MidiInputType.CONTROL,
              channel: 0,
              id: 71,
            }
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        SLICE: {
          mapping: {
            midi:{
              type: MidiInputType.CONTROL,
              channel: 0,
              id: 72,
            }
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        SLICE_ROTATE: {
          mapping: {
            midi:{
              type: MidiInputType.CONTROL,
              channel: 0,
              id: 73,
            }
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
      },
    },
    {
      name: "Rob",
      actions: {
        MOVE_Z: {
          mapping: {
            keyboard: [ 80, 83 ], //P, S
            xbox: XboxInput.LStickYAxis
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        MOVE_X: {
          mapping: {
            keyboard: [ 81, 68 ], //Z, S
            xbox: XboxInput.LStickXAxis
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        MOVE_Y: {
          mapping: {
            keyboard: [ 16, 32 ], //SHIFT, SPACE
            xbox: [ XboxInput.LT, XboxInput.RT]
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        LOOK_X: {
          mapping: {
         //   mouse: PointerInput.Horizontal,
            xbox: XboxInput.RStickXAxis
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        LOOK_Y: {
          mapping: {
           // mouse: PointerInput.Vertical,
            xbox: XboxInput.RStickYAxis
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        CONTINUOUS_FWD: {
          mapping: {
            midi:{
              type: MidiInputType.CONTROL,
              channel: 0,
              id: 71,
            }
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        HEIGHT: {
          mapping: {
            midi:{
              type: MidiInputType.CONTROL,
              channel: 0,
              id: 76,
            }
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        SLICE: {
          mapping: {
            midi:{
              type: MidiInputType.CONTROL,
              channel: 0,
              id: 77,
            }
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
        SLICE_ROTATE: {
          mapping: {
            midi:{
              type: MidiInputType.CONTROL,
              channel: 0,
              id: 93,
            }
          },
          value: 0,
          smoothValue: 0,
          once: false,
        },
      },
    },
  ],
}

const IACesiumCameraHandler: ProxyHandler<any> = {
  get: (target: InputActions, prop) => {
    const actions = target.maps[Inputs.mapIndex].actions;
    return {
    
      value: actions[prop].value,
      smoothValue: actions[prop].smoothValue,
      once: actions[prop].once,
    }
  },
  /*set: (target: IAMaps, prop, newVal: number) => {
    target[prop].value = newVal
    target[prop].smoothValue = newVal
    target[prop].once = newVal
    return true
  },*/
}

export const IACesiumCamera: InputActionList = new Proxy(
  Inputs,
  IACesiumCameraHandler
)


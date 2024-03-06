import { PointerInput, XboxInput } from "@babylonjs/core"
import { InputActions, IAMaps, InputActionList  } from "./inputActionsTypes"

export const Inputs : InputActions = {
  name: "inputsAction",
  maps: [
    {
      name: "CesiumCamera",
      actions: {
        MOVE_Z: {
          mapping: {
            keyboard: [ 90, 83 ], //Z, S
            xbox: XboxInput.LStickYAxis
          },
          value: 0
        },
        MOVE_X: {
          mapping: {
            keyboard: [ 81, 68 ], //Z, S
            xbox: XboxInput.LStickXAxis
          },
          value: 0
        },
        MOVE_Y: {
          mapping: {
            keyboard: [ 16, 32 ], //SHIFT, SPACE
            xbox: [ XboxInput.LT, XboxInput.RT]
          },
          value: 0
        },
        LOOK_X: {
          mapping: {
         //   mouse: PointerInput.Horizontal,
            xbox: XboxInput.RStickXAxis
          },
          value: 0
        },
        LOOK_Y: {
          mapping: {
           // mouse: PointerInput.Vertical,
            xbox: XboxInput.RStickYAxis
          },
          value: 0
        },
      },
    },
  ],
}

const IACesiumCameraHandler: ProxyHandler<any> = {
  get: (target: IAMaps, prop) => {
    return {
      value:target[prop].value,
    }
  },
  set: (target: IAMaps, prop, newVal: number) => {
    target[prop].value = newVal
    return true
  },
}

export const IACesiumCamera: InputActionList = new Proxy(
  Inputs.maps[0].actions,
  IACesiumCameraHandler
)


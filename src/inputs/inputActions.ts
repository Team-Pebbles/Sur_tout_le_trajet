export type IAControl = {
  isActive: boolean
  keyboard: string
  xbox: string
  mouse: string
}

export type IAControlList = {
  FORWARD: IAControl
  BACKWARD: IAControl
  LEFT: IAControl
  RIGHT: IAControl
  UP: IAControl
  DOWN: IAControl
}

export type IAMaps = {
  name: string
  actions: IAControlList
}

export type InputActions = {
  name: string
  maps: Array<IAMaps>
}

export const InputActions: InputActions = {
  name: "inputsAction",
  maps: [
    {
      name: "CesiumCamera",
      actions: {
        FORWARD: {
          isActive: false,
          keyboard: "Z",
          xbox: "A",
          mouse: "",
        },
        BACKWARD: {
          isActive: false,
          keyboard: "S",
          xbox: "B",
          mouse: "",
        },
        LEFT: {
          isActive: false,
          keyboard: "Q",
          xbox: "B",
          mouse: "",
        },
        RIGHT: {
          isActive: false,
          keyboard: "D",
          xbox: "B",
          mouse: "",
        },
        UP: {
          isActive: false,
          keyboard: "A",
          xbox: "B",
          mouse: "",
        },
        DOWN: {
          isActive: false,
          keyboard: "E",
          xbox: "B",
          mouse: "",
        },
      },
    },
  ],
}

export type InputLookingActions = {
  name: string
  maps: Array<ILAMaps>
}

export type ILAMaps = {
  name: string
  actions: ILAControlList
}

export type ILAControlList = {
  LOOKING: ILAControl
}

export type ILAControl = {
  isActive: boolean
  xbox: string
  mouse: string
  mouseMove: {
    x: number,
    y:number
  }
}

export const InputLookingActions: InputLookingActions = {
  name: "inputsLookingAction",
  maps: [
    {
      name: "CesiumCameraLooking",
      actions: {
        LOOKING: {
          isActive: false,
          xbox: "",
          mouse: "LeftClick",
          mouseMove: {
            x: 0,
            y: 0
          }
        }
      },
    },
  ],
}

const IACesiumCameraHandler: ProxyHandler<any> = {
  get: (target: IAMaps, prop) => {
    return target[prop].isActive
  },
  set: (target: IAMaps, prop, newVal: boolean) => {
    target[prop].isActive = newVal
    return true
  },
}

export const IACesiumCamera: IAControlList = new Proxy(
  InputActions.maps[0].actions,
  IACesiumCameraHandler
)

const IACesiumCameraLookingHandler: ProxyHandler<any> = {
  get: (target: ILAMaps, prop) => {
    return {isActive:target[prop].isActive, mouseMove: {x: target[prop].mouseMove.x, y: target[prop].mouseMove.y}}
  },
  set: (target: ILAMaps, prop, newVal: boolean) => {
    target[prop].isActive = newVal
    return true
  },
}

export const IACesiumCameraLooking: ILAControlList = new Proxy(
  InputLookingActions.maps[0].actions,
  IACesiumCameraLookingHandler
)
export type IAControl = {
  isActive: boolean
  speedFactor: number
  keyboard: string
  xbox: string
  mouse: string
  midi: number
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
          speedFactor: 250,
          keyboard: "Z",
          xbox: "A",
          mouse: "",
          midi: 74
        },
        BACKWARD: {
          isActive: false,
          speedFactor: 250,
          keyboard: "S",
          xbox: "B",
          mouse: "",
          midi: 18
        },
        LEFT: {
          isActive: false,
          speedFactor: 250,
          keyboard: "Q",
          xbox: "B",
          mouse: "",
          midi: 114
        },
        RIGHT: {
          isActive: false,
          speedFactor: 250,
          keyboard: "D",
          xbox: "B",
          mouse: "",
          midi: 19
        },
        UP: {
          isActive: false,
          speedFactor: 250,
          keyboard: "A",
          xbox: "B",
          mouse: "",
          midi: 112
        },
        DOWN: {
          isActive: false,
          speedFactor: 250,
          keyboard: "E",
          xbox: "B",
          mouse: "",
          midi: 71
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
  speedFactor: number
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
          speedFactor: 0,
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
    return {
      isActive:target[prop].isActive,
      speedFactor:target[prop].speedFactor
    }
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
    return {
      isActive:target[prop].isActive,
      speedFactor:target[prop].speedFactor ,
      mouseMove: {
        x: target[prop].mouseMove.x,
        y: target[prop].mouseMove.y
      }
    }
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
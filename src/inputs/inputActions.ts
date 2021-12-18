export type IAControl = {
  isActive: boolean
  keyboard: string
  xbox: string
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
        },
        BACKWARD: {
          isActive: false,
          keyboard: "S",
          xbox: "B",
        },
        LEFT: {
          isActive: false,
          keyboard: "Q",
          xbox: "B",
        },
        RIGHT: {
          isActive: false,
          keyboard: "D",
          xbox: "B",
        },
        UP: {
          isActive: false,
          keyboard: "A",
          xbox: "B",
        },
        DOWN: {
          isActive: false,
          keyboard: "E",
          xbox: "B",
        },
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

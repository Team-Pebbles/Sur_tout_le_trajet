export const InputActions = {
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

const IACesiumCameraHandler = {
  get: (target, prop, receiver) => {
    return target[prop].isActive
  },
  set: (target, prop, newVal) => {
    target[prop].isActive = newVal
    return true
  },
}

export const IACesiumCamera = new Proxy(InputActions.maps[0].actions, IACesiumCameraHandler)

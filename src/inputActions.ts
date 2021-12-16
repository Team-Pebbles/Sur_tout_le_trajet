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
      },
    },
  ],
}

const IACesiumCameraHandler = {
  get: (target, prop, receiver) => {
    return target[prop].isActive
  },
}

export const IACesiumCamera = new Proxy(InputActions.maps[0].actions, IACesiumCameraHandler)

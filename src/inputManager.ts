import { DeviceSourceManager, Engine, Scene, DeviceType, Color3, XboxInput } from "@babylonjs/core"
enum State {
  NULL = "NULL",
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  UP = "UP",
  DOWN = "DOWN",
}

export class InputManager {
  private scene: Scene
  private dsm: DeviceSourceManager
  private _state: string
  constructor(scene: Scene, engine: Engine) {
    this.scene = scene
    this._state = State.NULL
    this.dsm = new DeviceSourceManager(engine)

    this.dsm.onDeviceConnectedObservable.add((device) => {
      switch (device.deviceType) {
        case DeviceType.Keyboard:
          console.log("Keyboard")
          break
        case DeviceType.Xbox:
          console.log("Xbox")

          break
        case DeviceType.DualShock:
          console.log("Dualshock")
          break
      }
    })

    this.dsm.onDeviceDisconnectedObservable.add((device) => {
      console.log("Lost Connection")
    })

    this.dsm.getDeviceSource(DeviceType.Keyboard)?.onInputChangedObservable.add((device) => {
      console.log("device -> ", device.currentState)
    })
  }

  getState() {
    return this._state
  }

  registerBeforeRender() {
    /*
     * getDeviceSource and getInput:
     * At a minimum, you'll need to use the getInput function to read
     * data from user input devices.
     *
     * In Typescript, you can combine the getDeviceSource and getInput in the
     * if statements into a single like by using the null-conditional operator.
     *
     * e.g. if(dsm.getDeviceSource(DeviceType.Keyboard)?.getInput(90) == 1)
     */

    const kb = this.dsm.getDeviceSource(DeviceType.Keyboard)
    const xInput = this.dsm.getDeviceSource(DeviceType.Xbox)

    const inputsList = {
      FORWARD: {
        kb: kb?.getInput("Z".charCodeAt(0)),
        xInput: xInput!.getInput(XboxInput.A),
      },
    }

    // for (const key in inputsList) {
    //   if (Object.prototype.hasOwnProperty.call(object, key)) {
    //     const element = object[key];

    //   }
    // }

    if (kb) {
      if (this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput("Z".charCodeAt(0)) == 1) {
        this._state = State.FORWARD
      }
      if (this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput("S".charCodeAt(0)) == 1) {
        this._state = State.BACKWARD
      }
      // this._state = State.NULL
      // console.log(this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput(0))
    }

    if (this.dsm.getDeviceSource(DeviceType.Xbox)) {
      if (this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.A) == 1) {
      }
      if (this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.LStickXAxis) < -0.25) {
        console.log("left")
      } else if (
        this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.LStickXAxis) > 0.25
      ) {
        console.log("right")
      }
    }
  }
}

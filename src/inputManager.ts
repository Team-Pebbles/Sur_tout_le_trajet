import { DeviceSourceManager, Engine, Scene, DeviceType, Color3, XboxInput } from "@babylonjs/core"
import { InputActions } from "./inputActions"

export class InputManager {
  private scene: Scene
  private dsm: DeviceSourceManager
  private kbInputList: string[]
  constructor(scene: Scene, engine: Engine) {
    //  InputActions.maps[0].actions.FORWARD.isActive = true
    this.kbInputList = []
    InputActions.maps.forEach((map) => {
      let actions = map["actions"]
      for (const key in actions) {
        if (Object.prototype.hasOwnProperty.call(actions, key)) {
          const element = actions[key]
          console.log(element, key)
          this.kbInputList.push(element.keyboard)
        }
      }
    })

    this.scene = scene
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

  setActiveInput(input: string) {
    console.log(input)
    return input
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

    if (kb) {
      this.kbInputList.forEach((input) => {
        if (kb?.getInput(input.charCodeAt(0)) == 1) {
          this.setActiveInput(input)
        }
      })
      // this._state = State.NULL
      // console.log(this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput(0))
    }

    // if (this.dsm.getDeviceSource(DeviceType.Xbox)) {
    //   if (this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.A) == 1) {
    //   }
    //   if (this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.LStickXAxis) < -0.25) {
    //     console.log("left")
    //   } else if (
    //     this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.LStickXAxis) > 0.25
    //   ) {
    //     console.log("right")
    //   }
    // }
  }
}

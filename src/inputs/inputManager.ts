import {
  DeviceSourceManager,
  Scene,
  DeviceType,
  XboxInput,
  DeviceSource,
  Nullable,
} from "@babylonjs/core"
import { IAControl, IAControlList, IAMaps, InputActions } from "./inputActions"

export class InputManager {
  private dsm: DeviceSourceManager
  private kbInputList: string[]
  constructor(scene: Scene) {
    // this.kbInputList = []
    // InputActions.maps.forEach((map: IAMaps) => {
    //   let actions: IAControlList = map["actions"]
    //   for (const key in actions) {
    //     if (Object.prototype.hasOwnProperty.call(actions, key)) {
    //       const element: IAControl = actions[key]
    //       this.kbInputList.push(element.keyboard)
    //     }
    //   }
    // })

    this.dsm = new DeviceSourceManager(scene.getEngine())

    this.dsm.onDeviceConnectedObservable.add((device: DeviceSource<DeviceType>) => {
      console.log(device)
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
        case DeviceType.Mouse:
          console.log("Mouse")
          break
      }
    })

    // this.dsm.onDeviceDisconnectedObservable.add((device) => {
    //   console.log("Lost Connection")
    // })

    // this.dsm.getDeviceSource(DeviceType.Keyboard)?.onInputChangedObservable.add((device) => {
    //   console.log("device -> ", device)
    // })
  }

  // setInputSate(input: string, state: boolean) {
  //   // console.log(input)
  //   // return input
  //   InputActions.maps.forEach((map: IAMaps) => {
  //     let actions: IAControlList = map["actions"]
  //     for (const key in actions) {
  //       if (Object.prototype.hasOwnProperty.call(actions, key)) {
  //         const element: IAControl = actions[key]
  //         if (element.keyboard == input) {
  //           element.isActive = state
  //         }
  //       }
  //     }
  //   })
  // }

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

    // const kb: Nullable<DeviceSource<DeviceType.Keyboard>> = this.dsm.getDeviceSource(
    //   DeviceType.Keyboard
    // )
    // const xInput: Nullable<DeviceSource<DeviceType.Xbox>> = this.dsm.getDeviceSource(
    //   DeviceType.Xbox
    // )

    // if (kb) {
    //   this.kbInputList.forEach((input: string) => {
    //     if (kb?.getInput(input.charCodeAt(0)) == 1) {
    //       this.setInputSate(input, true)
    //     } else {
    //       this.setInputSate(input, false)
    //     }
    //   })
    // }


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

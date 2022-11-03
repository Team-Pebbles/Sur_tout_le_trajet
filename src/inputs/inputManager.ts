import {
  DeviceSourceManager,
  Scene,
  DeviceType,
  PointerInput,
  XboxInput,
  DeviceSource
} from "@babylonjs/core"
import { IAControl, IAControlList, IAMaps, InputActions, InputLookingActions, ILAMaps, ILAControlList, ILAControl } from "./inputActions"

export class InputManager {
  private dsm: DeviceSourceManager
  private kbInputList: string[]
  private mouseInputList: string[]
  private startMousePosition: {
    x: number,
    y: number
  }
  constructor(scene: Scene) {
    this.kbInputList = []
    this.mouseInputList = []
    this.startMousePosition = {
      x: 500,
      y: 500,
    }
    InputActions.maps.forEach((map: IAMaps) => {
      let actions: IAControlList = map["actions"]
      for (const key in actions) {
        if (Object.prototype.hasOwnProperty.call(actions, key)) {
          const inputControl: IAControl = actions[key]
          this.kbInputList.push(inputControl.keyboard)
        }
      }
    })

    InputLookingActions.maps.forEach((map: ILAMaps) => {
      let actions: ILAControlList = map["actions"]
      for (const key in actions) {
        if (Object.prototype.hasOwnProperty.call(actions, key)) {
          const inputControl: ILAControl = actions[key]
          this.mouseInputList.push(inputControl.mouse)
        }
      }
    })

    this.dsm = new DeviceSourceManager(scene.getEngine())

    this.dsm.onDeviceConnectedObservable.add((device: DeviceSource<DeviceType>) => {
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

      this.dsm.getDeviceSource(DeviceType.Mouse)?.onInputChangedObservable.add((eventData) => {
        //console.log("device -> ", eventData)
       // if(PointerInput[eventData.inputIndex] === "Move") {
          this.mouseInputList.forEach((input: string) => {
            InputLookingActions.maps.forEach((map: ILAMaps) => {
              let actions: ILAControlList = map["actions"]
              for (const key in actions) {
                if (Object.prototype.hasOwnProperty.call(actions, key)) {
                  const inputControl: ILAControl = actions[key]
                  if(eventData.type == "pointerdown") {
                    console.log("on")
                    inputControl.isActive = true
                    this.startMousePosition.x = inputControl.mouseMove.x
                    this.startMousePosition.y = inputControl.mouseMove.y
                  } else if (eventData.type == "pointermove") {
                    inputControl.mouseMove.x = eventData.clientX - this.startMousePosition.x
                    inputControl.mouseMove.y = - eventData.clientY - this.startMousePosition.y
                  } else if(eventData.type == "pointerup"){
                    console.log("off")
                    inputControl.isActive = false
                  }
                }
              }
            })
          })
       // }
      })

      this.dsm.getDeviceSource(DeviceType.Keyboard)?.onInputChangedObservable.add((eventData) => {
        console.log("device -> ", eventData.inputIndex)
        this.kbInputList.forEach((input: string) => {
          if (device?.getInput(input.charCodeAt(0)) == 1) {
            this.setInputSate(input, true)
          } else {
            this.setInputSate(input, false)
          }
        })
      })

      this.dsm.getDeviceSource(DeviceType.Xbox)?.onInputChangedObservable.add((eventData) => {

      })
  

    })

    this.dsm.onDeviceDisconnectedObservable.add((device) => {
      console.log("Lost Connection")
    })
  }

  setInputSate(input: string, state: boolean) {
    // console.log(input)
    // return input
    InputActions.maps.forEach((map: IAMaps) => {
      let actions: IAControlList = map["actions"]
      for (const key in actions) {
        if (Object.prototype.hasOwnProperty.call(actions, key)) {
          const inputControl: IAControl = actions[key]
          if (inputControl.keyboard == input) {
            inputControl.isActive = state
          }
        }
      }
    })
  }

  // registerBeforeRender() {
  //   const xInput: Nullable<DeviceSource<DeviceType.Xbox>> = this.dsm.getDeviceSource(
  //     DeviceType.Xbox
  //   )

  //   // if (this.dsm.getDeviceSource(DeviceType.Xbox)) {
  //   //   if (this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.A) == 1) {
  //   //   }
  //   //   if (this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.LStickXAxis) < -0.25) {
  //   //     console.log("left")
  //   //   } else if (
  //   //     this.dsm.getDeviceSource(DeviceType.Xbox)!.getInput(XboxInput.LStickXAxis) > 0.25
  //   //   ) {
  //   //     console.log("right")
  //   //   }
  //   // }
  // }
}

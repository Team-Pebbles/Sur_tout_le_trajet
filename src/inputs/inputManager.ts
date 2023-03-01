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
      x: window.innerHeight / 2,
      y: window.innerWidth / 2,
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

      // MOUSE
      this.dsm.getDeviceSource(DeviceType.Mouse)?.onInputChangedObservable.add((eventData) => {
        //console.log("device -> ", eventData)
        this.mouseInputList.forEach((input: string) => {
          InputLookingActions.maps.forEach((map: ILAMaps) => {
            let actions: ILAControlList = map["actions"]
            for (const key in actions) {
              if (Object.prototype.hasOwnProperty.call(actions, key)) {
                const inputControl: ILAControl = actions[key]
                inputControl.speedFactor = 0.5
                if(eventData.type == "pointerdown") {
                  inputControl.isActive = true
                  this.startMousePosition.x += inputControl.mouseMove.x
                  this.startMousePosition.y += inputControl.mouseMove.y
                } else if (eventData.type == "pointermove") {
                  inputControl.speedFactor = scene.getAnimationRatio() / 100
                  inputControl.mouseMove.x = eventData.clientX - this.startMousePosition.x
                  inputControl.mouseMove.y = - eventData.clientY - this.startMousePosition.y
                } else if(eventData.type == "pointerup"){
                  inputControl.isActive = false
                }
              }
            }
          })
        })
      })

      //  KEYBOARD
      this.dsm.getDeviceSource(DeviceType.Keyboard)?.onInputChangedObservable.add((eventData) => {
        this.kbInputList.forEach((input: string) => {
          if (device?.getInput(input.charCodeAt(0)) == 1) {
            this.setInputSate(input, true)
          } else {
            this.setInputSate(input, false)
          }
        })
      })

      // XBOX
      this.dsm.getDeviceSource(DeviceType.Xbox)?.onInputChangedObservable.add((eventData) => {
          // Xbox controller
      })
  

    })

    this.dsm.onDeviceDisconnectedObservable.add((device) => {
      console.log("Lost Connection")
    })
  }

  setInputSate(input: string, state: boolean) {
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

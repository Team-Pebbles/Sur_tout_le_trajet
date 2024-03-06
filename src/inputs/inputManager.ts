import {
  DeviceSourceManager,
  Scene,
  DeviceType,
  DeviceSource,
} from "@babylonjs/core"
import { Inputs } from "./inputActions"
import { InputAction } from "./inputActionsTypes"
import { InputMidi } from "./inputMidi"

export class InputManager {

  private dsm: DeviceSourceManager
  private startMousePosition: {
    x: number,
    y: number
  }
  private midi: InputMidi

  constructor(scene: Scene) {
    this.startMousePosition = {
      x: window.innerHeight / 2,
      y: window.innerWidth / 2,
    }
 
    this.midi = new InputMidi()
    this.dsm = new DeviceSourceManager(scene.getEngine())

    this.dsm.onDeviceConnectedObservable.add((device: DeviceSource<DeviceType>) => {
      switch (device.deviceType) {
        case DeviceType.Keyboard:
          console.log("Keyboard connected")
          break
        case DeviceType.Xbox:
          console.log("Xbox connected")
          break
        case DeviceType.DualShock:
          console.log("Dualshock connected")
          break
        case DeviceType.Mouse:
          console.log("Mouse connected")
          break
      }
    })

    this.dsm.onDeviceDisconnectedObservable.add((device) => {
      switch (device.deviceType) {
        case DeviceType.Keyboard:
          console.log("Keyboard disconnected")
          break
        case DeviceType.Xbox:
          console.log("Xbox disconnected")
          break
        case DeviceType.DualShock:
          console.log("Dualshock disconnected")
          break
        case DeviceType.Mouse:
          console.log("Mouse disconnected")
          break
      }
    })
  }


  update(){
    const mouse = this.dsm.getDeviceSource(DeviceType.Mouse);
    const keyboard = this.dsm.getDeviceSource(DeviceType.Keyboard);
    const xbox = this.dsm.getDeviceSource(DeviceType.Xbox);

    Inputs.maps.forEach( map =>{
      Object.keys(map.actions).forEach(actionKey =>{
        const action : InputAction = map.actions[actionKey];
        action.value = 0;
        if(mouse && action.mapping.mouse != undefined) {
          const m = action.mapping.mouse;
          action.value += Array.isArray(m) ? mouse.getInput(m[1] as number) - mouse.getInput(m[0] as number) : mouse.getInput(m as number);
        }
        if(keyboard && action.mapping.keyboard != undefined) {
          const m = action.mapping.keyboard;
          action.value += Array.isArray(m) ? keyboard.getInput(m[1] as number) - keyboard.getInput(m[0] as number) : keyboard.getInput(m as number);
        }
        if(xbox && action.mapping.xbox != undefined){
          const m = action.mapping.xbox;
          action.value += Array.isArray(m) ? xbox.getInput(m[1] as number) - xbox.getInput(m[0] as number) : xbox.getInput(m as number);
          //Deadzone
          if(Math.abs(action.value) < 0.05) action.value = 0;
        }

        if(action.mapping.midi != undefined){
          const m = action.mapping.midi;
          action.value += m ? this.midi.get(m) : 0;
        }
      });
    });

    if(xbox){
      //  console.log(xbox.getInput(XboxInput.A));
    }
  }
}

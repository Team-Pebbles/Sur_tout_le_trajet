import {
    DeviceSourceManager,
    Scene,
    DeviceType,
    DeviceSource,
} from "@babylonjs/core"
import { MidiSource } from "./midiSource"
import { Inputs } from "./inputs"
import { InputAction, InputValue } from "./inputTypes"

export class InputManager {

    private dsm: DeviceSourceManager
    private startMousePosition: {
        x: number,
        y: number
    }
    private midi: MidiSource

    constructor(scene: Scene) {
        this.startMousePosition = {
            x: window.innerHeight / 2,
            y: window.innerWidth / 2,
        }

        this.midi = new MidiSource()
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


    update() {
        const mouse = this.dsm.getDeviceSource(DeviceType.Mouse);
        const keyboard = this.dsm.getDeviceSource(DeviceType.Keyboard);
        const xbox = this.dsm.getDeviceSource(DeviceType.Xbox);

        const map = Inputs.getActiveMap();
        Object.keys(map.actions).forEach(actionKey => {

            const data: InputValue = Inputs.values[actionKey];
            const action: InputAction = map.actions[actionKey];

            let value = 0;
            if (mouse && action.mouse != undefined) {
                const m = action.mouse;
                value += Array.isArray(m) ? mouse.getInput(m[1] as number) - mouse.getInput(m[0] as number) : mouse.getInput(m as number);
            }
            if (keyboard && action.keyboard != undefined) {
                const m = action.keyboard;
                value += Array.isArray(m) ? keyboard.getInput(m[1] as number) - keyboard.getInput(m[0] as number) : keyboard.getInput(m as number);
            }
            if (xbox && action.xbox != undefined) {
                const m = action.xbox;
                value += Array.isArray(m) ? this.deadzone(xbox.getInput(m[1] as number)) - this.deadzone(xbox.getInput(m[0] as number)) : this.deadzone(xbox.getInput(m as number));
            }
            if (action.midi != undefined) {
                const m = action.midi;
                value += m ? this.midi.get(m) : 0;
            }

            data.once = data.value == 0 && value != 0;
            data.value = value;
            data.smoothValue += (value - data.smoothValue) * 0.05;
        });
    }

    deadzone(value: number) {
        const deadzone = 0.1;
        const abs = Math.abs(value);
        const sign = Math.sign(value);
        return abs > deadzone ? sign * (abs - deadzone) / 1 - deadzone : 0;
    }
}

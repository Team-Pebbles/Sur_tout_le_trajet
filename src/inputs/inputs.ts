import { PointerInput, XboxInput } from "@babylonjs/core"
import { InputActionMap, InputValue, InputValues } from "./inputTypes"
import { mapLouis } from "./mapLouis";
import { mapRob } from "./mapRob";


class InputMaster{
    activeMap: number
    maps: InputActionMap[]
    values: InputValues

    constructor(){
        this.activeMap = 0;
        this.maps = [
            mapRob,
            mapLouis,
        ];
        const values = {};
        Object.keys(this.getActiveMap().actions).forEach(key =>{
            const value : InputValue = {
                value: 0,
                smoothValue: 0,
                once: false,
            }
            values[key] = value;
        });
        this.values = values as InputValues;
    }

    getActiveMap(){
        return this.maps[this.activeMap];
    }
}

export const Inputs = new InputMaster();
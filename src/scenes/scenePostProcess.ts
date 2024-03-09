import { Camera, PostProcess } from "@babylonjs/core"
import { Audio } from "../audio/audioActions";
import { Inputs } from "../inputs/inputs";

export class ScenePostProcess {
    constructor(camera: Camera) {

        const ko = new PostProcess(
            "ko",
            "./shaders/ko",
            ["u_difference", "u_rotate", "u_slices", "u_zoom", "u_aber"],
            null,
            1,
            camera
        )
        let slice = 0;
        ko.onApply = (effect) => {
            let targetSlice = Math.floor(Inputs.values.SLICE.value * 6);
            slice += (targetSlice - slice) * 0.02;

            effect.setFloat("u_difference", Audio.actions.SPECTRUM_CURRENT.value * 1);
            effect.setFloat("u_rotate", Math.PI * Inputs.values.SLICE_ROTATE.smoothValue);
            effect.setFloat("u_slices", slice);
            effect.setFloat("u_zoom", 1);
            effect.setFloat("u_aber", 0.01);
        }

        const invert = new PostProcess(
            "invert",
            "./shaders/invertColor",
            [],
            null,
            1,
            camera
        )
        invert.onApply = (effect) => {
            effect.setFloat("u_time", performance.now() / 1000);
        }

        const noise = new PostProcess(
            "noise",
            "./shaders/noise",
            ["u_time"],
            null,
            1,
            camera
        )
        noise.onApply = (effect) => {
            effect.setFloat("u_time", performance.now() / 1000);
        }
    }
}

import { Camera, Color3, PostProcess, Vector2, Vector3 } from "@babylonjs/core"
import { Audio } from "../audio/audioActions";
import { Inputs } from "../inputs/inputs";
import { Canvas2D } from "./canvas2D";
import { Texts } from "../text";
import { oklabRgb, rgb, srgb } from "@thi.ng/color";
import { Vec } from "@thi.ng/vectors";

export class PostProcessing {
    /*TODO Effects :
    *    - Color Grading
    *    - Lens Miror (surimpression de l'image )
    *    _ 
    */
    constructor(camera: Camera, canvas2D: Canvas2D, texts: Texts) {

        const ko = new PostProcess(
            "ko",
            "./shaders/ko",
            ["u_difference", "u_rotate", "u_slices", "u_zoom", "u_aber"],
            ["textureSampler"],
            1,
            camera
        )
        let slice = 0;
        ko.onApply = (effect) => {
            let targetSlice = Math.floor(Inputs.values.SLICE.value * 6);
            slice += (targetSlice - slice) * 0.02;
            effect.setFloat("u_difference", Audio.actions.SPECTRUM_CURRENT.cool);
            effect.setFloat("u_rotate", Math.PI * Inputs.values.SLICE_ROTATE.smoothValue);
            effect.setFloat("u_slices", slice);
            effect.setFloat("u_zoom", 1);
            effect.setFloat("u_aber", 0.01);
        }

        const color = new PostProcess(
            "color",
            "./shaders/color",
            ["u_time", "u_vibrance", "u_contrast","u_brightness","u_exposure", "u_color","u_invert"],
            ["textureSampler", "canvas2D"],
            1,
            camera
        )

        color.onApply = (effect) => {
            effect.setFloat("u_time", performance.now() / 1000);
            effect.setFloat("u_vibrance", 2.);
            effect.setFloat("u_contrast", 1.5);
            effect.setFloat("u_brightness", 1.5);
            effect.setFloat("u_exposure", -0.4);
            effect.setColor3("u_color", rgb(texts.Color) );
            effect.setBool("u_invert", true);
            effect.setTexture("canvas2D", canvas2D.texture);
        }

        const vignette = new PostProcess(
            "vignette",
            "./shaders/vignette",
            ["u_resolution"],
            ["textureSampler"],
            1,
            camera
        )
        
        vignette.onApply = (effect) => {
            effect.setVector2("u_resolution", new Vector2(window.innerWidth, window.innerHeight))
        }

        const noise = new PostProcess(
            "noise",
            "./shaders/noise",
            ["u_time", "u_noiseIntensity"],
            ["textureSampler"],
            1,
            camera
        )
        noise.onApply = (effect) => {
            effect.setFloat("u_time", performance.now() / 1000);
            effect.setFloat("u_noiseIntensity", Audio.actions.SPECTRUM_CURRENT.cool);
        }

    }
}

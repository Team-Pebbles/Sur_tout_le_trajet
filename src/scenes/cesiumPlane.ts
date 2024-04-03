import {
    Camera,
    DefaultRenderingPipeline,
    FreeCamera,
    HtmlElementTexture,
    Mesh,
    MeshBuilder,
    Scene,
    ShaderMaterial,
    ThinEngine,
    Vector2,
    Vector3,
} from "@babylonjs/core"
import { CesiumViewer } from "../cesiumViewer"
import { Canvas2D } from "./canvas2D"

type Size = {
    x: number
    y: number
}

export class CesiumPlane {
    private texture: HtmlElementTexture
    private scene: Scene
    constructor(scene: Scene, cesiumViewer: CesiumViewer, canvas2D: Canvas2D) {
        this.scene = scene

        let size: Size = { x: window.innerWidth, y: window.innerHeight }

        let plane = MeshBuilder.CreatePlane("plane", { width: size.x, height: size.y }, this.scene)

        let shaderMaterial: ShaderMaterial = new ShaderMaterial("shader", this.scene, "./shaders/stream", {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time"],
        })
        shaderMaterial.setVector2("u_resolution", new Vector2(window.innerWidth, window.innerHeight))

        this.texture = new HtmlElementTexture("cesiumCanvas", cesiumViewer.canvas, {
            scene: this.scene,
            engine: this.scene.getEngine(),
        })

        plane.name = "CesiumPlane"
        plane.layerMask = 0x20000000
        plane.freezeWorldMatrix()

        shaderMaterial.setTexture("textureSampler", this.texture)
        shaderMaterial.setTexture("canvas", canvas2D.texture)
        plane.material = shaderMaterial
    }

    update() {
        this.texture.update()
    }
}

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

type Size = {
    x: number
    y: number
}

export class MapCanvas {
    public camera: FreeCamera
    private mapCanvasTexture: HtmlElementTexture
    private scene: Scene
    constructor(scene: Scene) {
        this.scene = scene
        if (this.scene.activeCamera == null || this.scene.activeCamera == undefined) return
        if (this.scene.activeCameras == null || this.scene.activeCameras == undefined) return

        if (this.scene.activeCameras.length === 0) {
            this.scene.activeCameras.push(this.scene.activeCamera)
        }

        let size: Size = { x: window.innerWidth, y: window.innerHeight }

        this.camera = new FreeCamera("mapCanvasCamera", new Vector3(0, 0, -50), this.scene)
        this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA
        this.camera.layerMask = 0x20000000
        this.scene.activeCameras?.push(this.camera)

        let plane = MeshBuilder.CreatePlane("plane", { width: size.x, height: size.y }, this.scene)

        let shaderMaterial: ShaderMaterial = new ShaderMaterial("shader", this.scene, "./shaders/stream", {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time"],
        })
        shaderMaterial.setVector2("u_resolution", new Vector2(window.innerWidth, window.innerHeight))

        let mapCanvas: any = document.getElementById("cesiumCanvas")
        if (mapCanvas == null && mapCanvas == undefined) return

        this.mapCanvasTexture = new HtmlElementTexture("mapCanvas", mapCanvas, {
            scene: this.scene,
            engine: this.scene.getEngine(),
        })

        plane.name = "planeMapCanvas"
        plane.layerMask = 0x20000000
        plane.freezeWorldMatrix()

        shaderMaterial.setTexture("textureSampler", this.mapCanvasTexture)
        plane.material = shaderMaterial
    }

    update() {
        this.mapCanvasTexture.update()
    }
}

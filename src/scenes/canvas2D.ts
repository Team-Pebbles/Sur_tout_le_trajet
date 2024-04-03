import { DynamicTexture, HtmlElementTexture, Scene } from "@babylonjs/core";

export class Canvas2D{
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D | null;
    public texture: DynamicTexture;
    private timeout : ReturnType<typeof setTimeout>;

    constructor(scene: Scene){
        this.canvas = document.createElement("canvas");
        this.canvas.id = "canvas2D";
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      //   document.body.append(this.canvas);
        const ctx = this.canvas.getContext("2d");
        if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) throw new Error('Failed to get 2D context');
        this.ctx = ctx;
        this.texture = new DynamicTexture("canvas2D", this.canvas, scene);
        this.clear();
    
    }

    clear(){
        if(this.ctx == null) return;
        this.ctx.fillStyle="black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.texture.update();
    }

    drawImage(slug: string, src: string, duration: number){
        if(this.ctx == null) return;

        var img = new Image();
        // Set the image source
        img.src =src;;
        img.onload = () => {
            console.log('image loaded');

            const W = this.canvas.width * 0.7;
            const H = this.canvas.height * 0.7;

            const imgRatioH = img.width / img.height;
            const imgRatioW = img.height / img.width;
            const size = img.width > img.height ? {x:W, y:W * imgRatioW} : {x:H * imgRatioH, y: H};
        


            //this.clear();
            this.ctx?.save();
            this.ctx?.translate(this.canvas.width * .5, this.canvas.height * .5);
            this.ctx?.drawImage(img, -size.x * .5, -size.y * .5, size.x, size.y);
            this.ctx?.restore();
            this.texture.update();

            if(this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => { this.clear() }, duration)
        };
    }

    drawText(slug: string, text: string[], textAlign: string, fontSize: number, duration: number){
        if(this.ctx == null) return;

        const letterSpacing = fontSize * 1.2;
        this.clear();
        let textPositionWidth: number = this.canvas.width * .5;
        let textPositionHeight: number = this.canvas.height * .5;

        this.ctx.save();

        switch (slug) {
            case "credits":
                textPositionHeight = this.canvas.height * .65;
                textPositionWidth = this.canvas.width - 70;
                break;
            default:
                break;
        }

        this.ctx.translate(textPositionWidth, textPositionHeight);
        this.ctx.font = `normal ${fontSize}px infini`;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = textAlign as CanvasTextAlign;
        this.ctx.textBaseline = "middle";

        for (var i = 0; i<text.length; i++){
            this.ctx.fillText(text[i].toUpperCase(), 0,i * letterSpacing - Math.max(0,text.length-1) * 0.5 * letterSpacing);
        }

        this.ctx.restore();

        this.texture.update();

        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => { this.clear() }, duration);
    }
}
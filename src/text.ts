import { Vector3 } from "@babylonjs/core";
import { CesiumViewer } from "./cesiumViewer";
import { Inputs } from "./inputs/inputs";
import { Canvas2D } from "./scenes/canvas2D";
import { Oklab, Oklch, oklab, oklch } from "@thi.ng/color";

export class Texts {
    private canvas2D: Canvas2D;
    private cesiumViewer: CesiumViewer;
    private stopUpdateColor: boolean;
    private textStyle: string

    public Color:Oklch;

    constructor(canvas2D: Canvas2D, cesiumViewer: CesiumViewer) {
        this.canvas2D = canvas2D;
        this.cesiumViewer = cesiumViewer
        this.Color = oklch(99.7 / 100, 0, 0); // white
        this.stopUpdateColor = false;
        this.render();
    }

    render() {
        this.displayTitle();
        this.displayCredits();
        this.vides()
        this.ftoum()
        this.seule()
        this.nullepart()
        this.aisjedit()
        this.moncorps()
        this.trajet()
        this.voyage()
        this.ailleurs()
        this.realite()
        this.plagiat()
        this.whoAreYou()
        this.reve()
        this.reel()
        this.colorManager()
    }

    colorManager() {
        if(this.stopUpdateColor) return;
        this.Color = oklch(Inputs.values.COLOR_LIGHTNESS.value, Math.min(Math.max(Inputs.values.COLOR_CHROMA.value, 0), 0.306), Inputs.values.COLOR_HUE.smoothValue)
    }

    displayTitle() {
        if (!Inputs.values.DRAW_TITLE.once) return;
        this.canvas2D.drawImage('title', './img/logo-rb.png', 10000);
        this.cesiumViewer.mapSwitch();
    }

    async displayCredits() {
        if (!Inputs.values.DRAW_CREDITS.once) return;
        this.canvas2D.drawImage('title', './img/logo-rb.png', 5000);
        await waitForMS(7000);
        
        let div = this.createDiv(["center--horizon-right"]);
        div = this.createP(div,
            `&Effiloche , &ROB À FLEURS 🌸,`,
            "font-size:50px;line-height:70px",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        div = this.createP(div,
            `&RRRRROSE AZERTY, &Pier-re`,
            "font-size:50px;line-height:70px",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        this.canvas2D.createSVG(div, 3000);
        await waitForMS(4500);

        div = this.createDiv();
        div = this.createP(div,
            `Et avec l'aide de Louis pour le code !`,
            "font-size:50px;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon-right"]
        )
        this.canvas2D.createSVG(div, 3000);
     
    }

    createDiv(className:string[] = []) {
        const div = document.createElement("div");
        className.push("offscreenTextWrapper")
        div.classList.add(...className);
        return div;
    }
    createP(container: HTMLDivElement, inlineContent: string, style:string, className:string[]) {
        const p = document.createElement("p");
        p.classList.add(...className);
        p.innerHTML = inlineContent;
        p.style.cssText = style;
        container.appendChild(p);
        return container;

    }

    ftoum() {
        if (!Inputs.values.DRAW_FTOUM.once) return;
        let html: HTMLDivElement = this.createDiv();
        html = this.createP(html,
            `<span style="text-decoration:underline"><span style="font-weight:bold;">F</span>F</span>TOU<span style="text-decoration:underline;font-style:italic;">M</span>`,
            "font-size:15vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(html, 5000);
    }

    vides() {
        if (!Inputs.values.DRAW_VIDES.once) return;
        let div = this.createDiv();
        div = this.createP(div,
            `Vides.`,
            "font-size:10vw;",
            ["font-infini", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    seule() {
        if (!Inputs.values.DRAW_SEULE.once) return;
        let div = this.createDiv();
        div = this.createP(div,
            `Seules.`,
            "font-size:10vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    nullepart() {
        if (!Inputs.values.DRAW_NULLEPART.once) return;
        let div = this.createDiv()
        div = this.createP(div,
            `Car <span style="font-weight:bold;text-decoration:underline">ici,</span>`,
            "font-size:8vw",
            ["font-infini", "font-infini--ligature", "center-left"]
        )

        div = this.createP(div,
            `on est <span style="font-style:italic;text-decoration:underline">nulle part</span>`,
            "font-size:8vw",
            ["font-infini", "font-infini--ligature", "bottom-right"]
        )

        this.canvas2D.createSVG(div, 5000);

        this.Color = oklch(66.73 / 100, 0.214, .4)
        this.stopUpdateColor = true;
        setTimeout(() => {
            this.stopUpdateColor = false;
        }, 5000)
    }

    aisjedit(){
        if (!Inputs.values.DRAW_AISJEDIT.once) return;
        let div = this.createDiv(["center--horizon"]);
        div = this.createP(div,
            `Vous l'avais-je`,
            "font-size:6vw;text-wrap:no-wrap",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        div = this.createP(div,
            `dit ?`,
            "font-size:10vw;font-weight:bold;text-decoration:underscore",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        this.canvas2D.createSVG(div, 100);
    }

    // Rrrrrose VJ
    // aisjedit(){
    //     if (!Inputs.values.DRAW_AISJEDIT.once) return;
    //     let div = this.createDiv(["center--horizon"]);
    //     div = this.createP(div,
    //         `Extrêmement PD`,
    //         "font-size:6vw;text-wrap:no-wrap",
    //         ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
    //     )
    //     div = this.createP(div,
    //         `De Toi`,
    //         "font-size:10vw;font-weight:bold;text-decoration:underscore",
    //         ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
    //     )
    //     this.canvas2D.createSVG(div, 100);
    // }

    moncorps() {
        if (!Inputs.values.DRAW_MONCORPS.once) return;
        let div = this.createDiv(["center--horizon-left"]);
        div = this.createP(div,
            `mon corps`,
            "font-size:10vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        div = this.createP(div,
            `est monde`,
            "font-size:10vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        this.canvas2D.createSVG(div, 5000);
        
    }

    trajet(){
        if (!Inputs.values.DRAW_TRAJET.once) return;
        let div = this.createDiv();
        div = this.createP(div,
            `Sur tout ce trajet`,
            "font-size:8vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    voyage(){
        if (!Inputs.values.DRAW_VOYAGE.once) return;
        let div = this.createDiv(["center--horizon-right"]);
        div = this.createP(div,
            `On ne voyage`,
            "font-size:10vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        div = this.createP(div,
            `pas par choix`,
            "font-size:10vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    ailleurs() {
        if (!Inputs.values.DRAW_AILLEURS.once) return;
        let div = this.createDiv();
        div = this.createP(div,
            `L’ailleurs`,
            "font-size:10vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    realite() {
        if (!Inputs.values.DRAW_REALITE.once) return;
        let div = this.createDiv(["top-left"]);
        div = this.createP(div,
            `<span style="font-style:italic">Je</span> ne`,
            "font-size:5vw;",
            ["font-infini", "font-infini--ligature"]
        )
        div = this.createP(div,
            `crois`,
            "font-size:5vw;position:relative;left:20vw; line-height:15vh;",
            ["font-infini", "font-infini--ligature"]
        )
        div = this.createP(div,
            `pas`,
            "font-size:5vw;position:relative;left:7vw; line-height:15vh;",
            ["font-infini", "font-infini--ligature"]
        )
        div = this.createP(div,
            `en&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;la`,
            "font-size:5vw;position:relative;left:20vw; line-height:15vh;",
            ["font-infini", "font-infini--ligature"]
        )
        div = this.createP(div,
            `réalité.`,
            "font-size:5vw;position:relative;left:40vw; line-height:15vh;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    plagiat() {
        if (!Inputs.values.DRAW_PLAGIAT.once) return;
        let div = this.createDiv();
        div = this.createP(div,
            `C'est un plagiat du monde,`,
            "font-size:8vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    whoAreYou() {
        if (!Inputs.values.DRAW_WHOAREYOU.once) return;
        let div = this.createDiv();
        div = this.createP(div,
            `qui êtes-vous ?`,
            "font-size:10vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    reve() {
        if (!Inputs.values.DRAW_REVE.once) return;
        let div = this.createDiv();
        div = this.createP(div,
            `Vous m'avez sortie du rêve`,
            "font-size:8vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(div, 5000);
    }

    reel() {
        if (!Inputs.values.DRAW_REEL.once) return;
        let div = this.createDiv();
        div = this.createP(div,
            `Vous êtes réel.`,
            "font-size:10vw;",
            ["font-infini", "font-infini--ligature", "font-infini--uppercase", "center--horizon"]
        )
        this.canvas2D.createSVG(div, 5000);
    }
}

function waitForMS(time: number){
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
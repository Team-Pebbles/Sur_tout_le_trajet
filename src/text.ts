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
        this.textStyle = `
        <style>
            * {
            font-Family: "infini";
            font-variant-ligatures: "common-ligatures discretionary-ligatures";
            font-variant-caps: "small-caps";
            text-transform: "uppercase";
            font-size: "100px";
            color: "white";
            }
        </style>
        `
        this.render();
    }

    render() {
        this.displayTitle();
        this.displayCredits();
        this.vides()
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
        if (Inputs.values.DRAW_TITLE.once) {
            // this.canvas2D.drawImage('title', './img/logo-white.png', 10000);
            // this.cesiumViewer.mapSwitch();
            const html = document.createElement("div");
            html.classList.add("offscreenTextWrapper");
            html.innerHTML = this.textStyle + "<p style='color:red;font-size:90px;position:absolute; top:20vh;'>Test</p><p class='infini-font' style='color:white;font-size:90px'>SUPER</p>"
            // html.textContent = "&azerty"
            // html.style.fontSize = "90px"
            // html.style.color = "white"
            // his.textStyle + "<p>&azerty</p>"
            this.canvas2D.createSVG(html, 2000);
        }
    }

    async displayCredits() {
        if (!Inputs.values.DRAW_CREDITS.once) return;
        this.canvas2D.drawImage('title', './img/logo-white.png', 5000);
        await waitForMS(7000);
        this.canvas2D.drawSimpleText("credits", ["&GUENILLE , &ROB À FLEURS 🌸, &RRRRROSE AZERTY"], "right", 50, 3000);
        await waitForMS(4500);
        this.canvas2D.drawSimpleText("credits", ["D'après une idée de Pier-re"], "right", 50, 3000);
        await waitForMS(4500);
        this.canvas2D.drawSimpleText("credits", ["Et avec l'aide de Louis pour le code !", "coucou Louis"], "right", 50, 3000);
     
    }

    vides() {
        if (!Inputs.values.DRAW_VIDES.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["Vides."], "center", 100, 5000);
    }

    seule() {
        if (!Inputs.values.DRAW_SEULE.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["Seule."], "center", 100, 5000);
    }

    nullepart() {
        if (!Inputs.values.DRAW_NULLEPART.once) return;
        this.canvas2D.drawText([
            {text: [{string:"Car", weight:"normal", style:"normal"}, {string:"ici,", weight:"bold", style:"normal"}], x:150, y:window.innerHeight * .5},
            {text: [{string:"on est", weight:"normal", style:"normal"}, {string:"nulle part", weight:"bold", style:"italic"}], x:window.innerWidth * .65, y:window.innerHeight * .8}
        ], 90, 5000);
        this.Color = oklch(66.73 / 100, 0.214, .4)
        this.stopUpdateColor = true;
        setTimeout(() => {
            this.stopUpdateColor = false;
        }, 5000)
    }

    aisjedit(){
        if (!Inputs.values.DRAW_AISJEDIT.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["Vous l'avais-je dit ?"], "center", 100, 5000);
    }

    moncorps() {
        if (!Inputs.values.DRAW_MONCORPS.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["mon corps", "est monde"], "left", 100, 5000);
    }

    trajet(){
        if (!Inputs.values.DRAW_TRAJET.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["Sur tout ce trajet"], "center", 100, 5000);
    }

    voyage(){
        if (!Inputs.values.DRAW_VOYAGE.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["On ne voyage","pas par choix"], "right", 100, 5000);
    }

    ailleurs() {
        if (!Inputs.values.DRAW_AILLEURS.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["L’ailleurs"], "center", 100, 5000);
    }

    realite() {
        if (!Inputs.values.DRAW_REALITE.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["Je ne crois pas","en la réalité."], "center", 100, 5000);
    }

    plagiat() {
        if (!Inputs.values.DRAW_PLAGIAT.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["C'est un plagiat du monde,"], "center", 100, 5000);
    }

    whoAreYou() {
        if (!Inputs.values.DRAW_WHOAREYOU.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["qui êtes-vous ?"], "center", 100, 5000);
    }

    reve() {
        if (!Inputs.values.DRAW_REVE.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["Vous m'avez sortie du rêve"], "center", 100, 5000);
    }

    reel() {
        if (!Inputs.values.DRAW_REEL.once) return;
        this.canvas2D.drawSimpleText("emphasis", ["Vous êtes réel."], "center", 100, 5000);
    }
}

function waitForMS(time: number){
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
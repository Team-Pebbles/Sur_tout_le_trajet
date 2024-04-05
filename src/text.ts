import { CesiumViewer } from "./cesiumViewer";
import { Inputs } from "./inputs/inputs";
import { Canvas2D } from "./scenes/canvas2D";

export class Texts {
    private canvas2D: Canvas2D;
    private cesiumViewer: CesiumViewer;

    constructor(canvas2D: Canvas2D, cesiumViewer: CesiumViewer) {
        this.canvas2D = canvas2D;
        this.cesiumViewer = cesiumViewer
        this.render();
    }

    render() {
        this.displayTitle();
        this.displayCredits();
        this.vides()
        this.seule()
        this.nullepart()
        this.moncorps()
        this.ailleurs()
        this.realite()
        this.plagiat()
        this.whoAreYou()
        this.reve()
        this.reel()
    }

    displayTitle() {
        if (Inputs.values.DRAW_TITLE.once) {
            this.canvas2D.drawImage('title', './img/logo-white.png', 5000);
            this.cesiumViewer.mapSwitch();
        }
    }

    displayCredits() {
        if (Inputs.values.DRAW_CREDITS.once) {
            this.canvas2D.drawText("credits", ["&GUENILLE , &ROB À FLEURS 🌸, &RRRRROSE AZERTY"], "right", 50, 3000);
            setTimeout(() => {
                this.canvas2D.drawText("credits", ["D'après une idée de Pier-re"], "right", 50, 3000);
                setTimeout(() => {
                    this.canvas2D.drawText("credits", ["Et avec l'aide de Louis pour le code !", "coucou Louis"], "right", 50, 3000);
                }, 3000);
            }, 3000);
        }
    }

    vides() {
        if (Inputs.values.DRAW_VIDES.once) {
            this.canvas2D.drawText("emphasis", ["Vides."], "center", 100, 5000);
        }
    }

    seule() {
        if (Inputs.values.DRAW_SEULE.once) {
            this.canvas2D.drawText("emphasis", ["Seule."], "center", 100, 5000);
        }
    }

    nullepart() {
        if (Inputs.values.DRAW_NULLEPART.once) {
            this.canvas2D.drawText("emphasis", ["Car ici, on est nulle part"], "center", 90, 5000);
        }
    }

    moncorps() {
        if (Inputs.values.DRAW_MONCORPS.once) {
            this.canvas2D.drawText("emphasis", ["mon corps", "est monde"], "left", 100, 5000);
        }
    }

    ailleurs() {
        if (Inputs.values.DRAW_AILLEURS.once) {
            this.canvas2D.drawText("emphasis", ["L’ailleurs"], "center", 100, 5000);
        }
    }

    realite() {
        if (Inputs.values.DRAW_REALITE.once) {
            this.canvas2D.drawText("emphasis", ["Je ne crois pas en la réalité."], "center", 100, 5000);
        }
    }

    plagiat() {
        if (Inputs.values.DRAW_PLAGIAT.once) {
            this.canvas2D.drawText("emphasis", ["C'est un plagiat du monde,"], "center", 100, 5000);
        }
    }

    whoAreYou() {
        if (Inputs.values.DRAW_WHOAREYOU.once) {
            this.canvas2D.drawText("emphasis", ["qui êtes-vous ?"], "center", 100, 5000);
        }
    }

    reve() {
        if (Inputs.values.DRAW_REVE.once) {
            this.canvas2D.drawText("emphasis", ["Vous m'avez sortie du rêve"], "center", 100, 5000);
        }
    }

    reel() {
        if (Inputs.values.DRAW_REEL.once) {
            this.canvas2D.drawText("emphasis", ["Vous êtes réel."], "center", 100, 5000);
        }
    }
}
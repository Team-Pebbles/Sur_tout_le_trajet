import { DynamicTexture, HtmlElementTexture, Scene } from "@babylonjs/core";
import { FontData } from "./fontData";
import { Base64 } from 'js-base64';

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
        img.src = src;
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

    drawSimpleText(slug: string, text: string[], textAlign: string, fontSize: number, duration: number){
        if(this.ctx == null) return;

        const letterSpacing = fontSize * 1.2;
        this.clear();
        let textPositionWidth: number = this.canvas.width * .5;
        let textPositionHeight: number = this.canvas.height * .60;

        this.ctx.save();

        switch (slug) {
            case "credits":
                textPositionHeight = this.canvas.height * .60;
                textPositionWidth = this.canvas.width - 70;
                break;
            default:
                break;
        }

        this.ctx.translate(textPositionWidth, textPositionHeight);
        this.ctx.font = `${fontSize}px infini`;
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

    drawText(textArray: {text: {string:string, weight: string, style:string}[], x: number, y:number}[], fontSize: number, duration: number){
        this.clear();
        if(this.ctx == null) return;
        textArray.forEach(textItem => {
            const letterSpacing = fontSize * .3;
            let textPositionWidth: number = textItem.x;
            let textPositionHeight: number = textItem.y;
            
            if(this.ctx == null) return;
            this.ctx.save();
            console.log(textItem.text)
            this.ctx.translate(textPositionWidth, textPositionHeight);
            this.ctx.fillStyle = "white";
            this.ctx.textBaseline = "middle";
            
            let textWidth = 0;
            textItem.text.forEach(stringEl => {
                if(this.ctx == null) return;
                this.ctx.font = `${stringEl.style} ${stringEl.weight} ${fontSize}px infini`;
                this.ctx.fillText(stringEl.string, textWidth,0);
                textWidth = this.ctx.measureText(stringEl.string).width + letterSpacing
            });
            this.ctx.restore();
        });
        
        this.texture.update();

        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => { this.clear() }, duration);
    }


    async createSVG(html: string | Node, duration: number) {
        this.clear();
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS( svgNS, "svg" );
        const style = document.createElementNS( svgNS, "style" );

          style.textContent = `
          @font-face {
            font-family: 'infini';
            font-style: normal;
            font-weight: normal;
            src: url(${FontData.infiniRomain  }) format("woff"); 
          }
          @font-face {
            font-family: 'infini';
            font-style: normal;
            font-weight: bold;
            src: url(${FontData.infiniBold }) format("woff"); 
          }

          @font-face {
            font-family: 'infini';
            font-style: italic;
            font-weight: normal;
            src: url(${FontData.infiniItalic }) format("woff"); 
          }
          `;
          svg.append( style );
        
        const foreignObject = document.createElementNS( svgNS, "foreignObject" );
        foreignObject.setAttribute( "x", "0" );
        foreignObject.setAttribute( "y", "0" );
      
        document.body.appendChild(html as Node);
        const target:HTMLElement|null = document.querySelector(".offscreenTextWrapper");
        const clone = this.cloneWithStyles( target );
        if(!clone) return;
        foreignObject.append( clone);
        foreignObject.setAttribute( "width", this.canvas.width.toString() );
        foreignObject.setAttribute( "height", this.canvas.height.toString() );
        svg.setAttribute( "width", this.canvas.width.toString() );
        svg.setAttribute( "height", this.canvas.height.toString() );
        
        svg.append( foreignObject );
        target?.remove();
        
        const svg_markup = new XMLSerializer().serializeToString( svg );

        const img = new Image();
        img.crossOrigin = "Anonymous"
        // fix chrome crossorigin with data:image instead of url 
        img.src = "data:image/svg+xml;base64," +  Base64.encode(svg_markup);

        img.onload = (() => {
            this.ctx?.drawImage( img, 0, 0 );
            console.log("NIK")
            URL.revokeObjectURL( img.src );
            
            this.texture.update();

            if(this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => { this.clear() }, duration);
        })
        
      }

      cloneWithStyles( source:HTMLElement|null ) {
        const clone = source?.cloneNode( true );
        
        // to make the list of rules smaller we try to append the clone element in an iframe
        const iframe = document.createElement( "iframe" );
        document.body.append( iframe );
        // if we are in a sandboxed context it may be null
        if( iframe.contentDocument && clone) {
          iframe.contentDocument.body.append( clone );
        }
        
        if(!clone || !source) return;
        const source_walker = document.createTreeWalker( source, NodeFilter.SHOW_ELEMENT, null );
        const clone_walker = document.createTreeWalker( clone, NodeFilter.SHOW_ELEMENT, null );
        let source_element:HTMLElement = source_walker.currentNode as HTMLElement;
        let clone_element:HTMLElement = clone_walker.currentNode as HTMLElement;
        while ( source_element ) {
        
          const source_styles = getComputedStyle( source_element);
          const clone_styles = getComputedStyle( clone_element);
      
          // we should be able to simply do [ ...source_styles.forEach( (key) => ...
          // but thanks to https://crbug.com/1073573
          // we have to filter all the snake keys from enumerable properties...
          const keys = (() => {
            // Start with a set to avoid duplicates
            const props = new Set();
            for( let prop in source_styles ) {
              // Undo camel case
              prop = prop.replace( /[A-Z]/g, (m) => "-" + m.toLowerCase() );
              // Fix vendor prefix
              prop = prop.replace( /^webkit-/, "-webkit-" );
              props.add( prop );
            }
            return props;
          })();
          for( let key of keys ) {
            if( clone_styles[ key as keyof CSSStyleDeclaration] !== source_styles[ key as keyof CSSStyleDeclaration] ) {
                console.log(key as keyof CSSStyleDeclaration  + " : " + source_styles[ key as keyof CSSStyleDeclaration] )
              clone_element.style.setProperty( key as string , source_styles[ key as string ] );
            }
          }
      
          source_element = source_walker.nextNode() as HTMLElement
          clone_element = clone_walker.nextNode() as HTMLElement
        
        }
        // clean up
        iframe.remove();
      
        return clone;
      }
}
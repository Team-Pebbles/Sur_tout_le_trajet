var canvas = document.createElement("canvas");
canvas.setAttribute("data-fragment-url","./src/shaders/shader.frag")
canvas.width = 500
canvas.height = 500
var sandbox = new GlslCanvas(canvas);
document.body.prepend(canvas)
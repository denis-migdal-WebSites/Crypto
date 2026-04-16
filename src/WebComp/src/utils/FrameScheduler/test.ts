import Renderer from "./Renderer";

const foo = new Renderer( () => console.warn("ok") );

foo.requestRender();
foo.requestRender();
foo.requestRender();

setTimeout( () => {
    foo.requestRender();
    foo.requestRender();
    foo.requestRender();
}, 500)
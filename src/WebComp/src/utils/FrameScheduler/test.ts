import createRenderScheduler from "./createRenderScheduler";

const foo = createRenderScheduler( () => console.warn("ok") );

foo();
foo();
foo();

setTimeout( () => {
    foo();
    foo();
}, 500)
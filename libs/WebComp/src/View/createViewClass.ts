import type { Controller} from "../Controller/types";

import type { Elems, ViewCtx }           from "./types";
import extractElements, {type ElemsDesc} from "./extractElements";

type GetHandlersFrom<CONTROLLER extends Controller<any>|null>
    = CONTROLLER extends null
                ? {}
                : GetHandlers<Exclude<CONTROLLER, null>>;

export type ViewMethods<
                    ELEMS extends Elems,
                    CONTROLLER extends Controller<any>|null = null
                > = {
    createDefaultController?: (this: ViewCtx<ELEMS>) => CONTROLLER,
    attachController?: (
                        this: ViewCtx<ELEMS>,
                        controller: Omit<NoInfer<CONTROLLER>, "hooks">
                    ) => void,
    } & AsMethods<ViewCtx<ELEMS>, GetHandlersFrom<NoInfer<CONTROLLER>>>

export type ViewFactoryArgs<
                        ELEMS   extends Elems,
                        CONTROLLER extends Controller<any>|null = null
                    > = 
      ShadowTemplateArgs
    & { elements  ?: ElemsDesc<ELEMS> }
    & ViewMethods<ELEMS, CONTROLLER>;

import { GetHandlers, HooksManager, isHandlerName } from "../Hooks";
import ShadowTemplate, { ShadowTemplateArgs } from "./ShadowTemplate";
import installMethods, { AsMethods } from "../installMethods";

export default function createViewClass<
                        ELEMS      extends Elems = {},
                        CONTROLLER extends Controller<any>|null = null
                    >(
            args: ViewFactoryArgs<ELEMS, CONTROLLER> = {} as any
        ) {

    const template = new ShadowTemplate(args);

    const View = class implements ViewCtx<ELEMS> {

        readonly target  : HTMLElement;
        readonly root    : DocumentFragment;
        readonly elements: ELEMS;

        constructor(target: HTMLElement) {

            this.target = target;

            this.root = template.createShadowRoot(target);
            this.elements = args.elements !== undefined
                            ? extractElements(this.root, args.elements)
                            : {} as ELEMS;
        }
    }

    const methods = {} as ViewMethods<ELEMS, CONTROLLER>;
    for( const key in args ) {

        if(    isHandlerName(key)
            || key === "createDefaultController"
            || key === "attachController"
            ) {
            // @ts-ignore
            methods[key] = args[key];
        }
    }
    
    installMethods(View, methods);

    return View;
}

class Z{
    readonly hooks = new HooksManager<{foo: ()=>void}>();
}

const X = createViewClass({
    elements: {
        div: HTMLDivElement
    },
    createDefaultController() {
        //return null;
        return new Z();
    },
    onFoo() {

    }
});

const x = new X(null as any);
// pretty hard to remove the |undefined.
// but in a sense, you are not supposed to call it...
// x.createDefaultController!();
// x.onFoo!(null as any);
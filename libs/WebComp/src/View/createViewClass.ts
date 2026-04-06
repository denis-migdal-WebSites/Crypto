import type { Controller} from "../Controller/types";

import type { Elems, ViewCtx }           from "./types";
import extractElements, {type ElemsDesc} from "./extractElements";

export type ViewMethods<
                    ELEMS extends Elems,
                    CONTROLLER extends Controller<any>|null = null
                > = {
    createDefaultController?: (this: ViewCtx<ELEMS>) => CONTROLLER,
}

export type ViewFactoryArgs<
                        ELEMS   extends Elems,
                        CONTROLLER extends Controller<any>|null = null
                    > = 
      ShadowTemplateArgs
    & { elements  ?: ElemsDesc<ELEMS> }
    & ViewMethods<ELEMS, CONTROLLER>;

type ExtractMethods<T extends ViewFactoryArgs<any, any>>
        = Omit<T, "elements"|keyof ShadowTemplateArgs>;

import { HooksManager, isHandlerName } from "../Hooks";
import ShadowTemplate, { ShadowTemplateArgs } from "./ShadowTemplate";
import installMethods from "../installMethods";

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
    readonly hooks = new HooksManager();
}

const X = createViewClass({
    elements: {
        div: HTMLDivElement
    },
    createDefaultController() {
        //return null;
        return new Z();
    }
});

const x = new X(null as any);
x.createDefaultController!();
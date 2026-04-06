
import type { Elems, ViewCtx }           from "./types";
import extractElements, {type ElemsDesc} from "./extractElements";

//TODO: handlers + create/attach...
export type ViewFactoryArgs<ELEMS extends Elems> = 
      ShadowTemplateArgs
    & { elements  ?: ElemsDesc<ELEMS> };

import { isHandlerName } from "../Hooks";
import ShadowTemplate, { ShadowTemplateArgs } from "./ShadowTemplate";
import installMethods from "../installMethods";

export default function createViewClass<
                                ELEMS      extends Elems = {},
                            >(
            args: ViewFactoryArgs<ELEMS> = {}
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

    const methods = {} as Record<string, (...args: any) => any>;
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

    //TODO: verify returned type...
    return View;
}

const X = createViewClass({
    elements: {
        div: HTMLDivElement
    }
});

//const x = new X(null as any);
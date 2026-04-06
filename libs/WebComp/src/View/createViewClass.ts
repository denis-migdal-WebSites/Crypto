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
    controllerProvider: (this: ViewCtx<ELEMS>, target: HTMLElement) => CONTROLLER,
    attachController?: (
                        this: ViewCtx<ELEMS>,
                        controller: Omit<NoInfer<CONTROLLER>, "hooks">
                    ) => void,
    // Omit<Partial => controllerProvider
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
            || key === "controllerProvider"
            || key === "attachController"
            ) {
            // @ts-ignore
            methods[key] = args[key];
        }
    }
    
    installMethods(View, methods);

    return View;
}

/**/
class Z{
    readonly hooks = new HooksManager<{foo: ()=>void}>();
}

const X = createViewClass({
    elements: {
        div: HTMLDivElement
    },
    controllerProvider(x) {
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

/*
https://www.typescriptlang.org/play/?#code/C4TwDgpgBAGlC8UDeAoK6oDMD22D8AXFAHYCuAtgEYQBOA3GhpqaYVAM7A0CWxA5gwC+KFEigB6cVABuARihEAFgEN2JCNNozlAG1IR2jdKEhQActgCiADy7KA0hBDsAPABUANFADKKyAD4EIwx0VBDwjABteyheKABrJ2xMKDcAXSIYiFsIYgATNUSQZJ8-CGCIiLxU6LSKypCiYg1aevRBKAAyUuVIOgkpGggAR1JuIbysbBooMBpsSBmTaF5MWlyAY2hsYihsYEUtTlJMTAA6ERDmYg3gbh2p7HcobOBcgqgAJQgN6byXTg8fheZTEED+fwACmUND47CIFhsdkczncXhg-gAlMg2lAhsBSDRdkgOqpUsFhMFfsROHiIMAEI9IWFKjhsEQAMwAFlxkkwymUnJ5IUEmMuGHxZzZKGEYkkMgATAooHx6Xd+FADtAimo8MFluYrLYaA4nK43C8cvk1IDeHwvL5ehBAvBcSyGuhorFdhbukUSo7IBkepBariOt1AxB+vKhqNxhBJjgZnMFloDat1jdtrt9ocZsdThdgtdbvddmznq93moAERs2tQmFwhFG5FmtGwLE4hr4wnE0lqb7xiYuAAK3A28RcMC8bghFPF6GptPxjLZzNxbKFHi3LCItcBtd3DT5AqFFLFwUl0sEQA
*/
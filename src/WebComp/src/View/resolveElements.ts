import { isClass } from "@MWL/types";

const WCID_ATTRNAME = "data-wcid";
const WCID_SELECTOR = `[${WCID_ATTRNAME}]`;

export type Elems = Record<string, HTMLElement>;

export type ElemsDesc<T extends Elems> = {
    [K in keyof T]: T[K]|(() => T[K])|(new() => T[K])
}

export default function resolveElements<
            ELEMS extends Elems
        >(
            target         : DocumentFragment|HTMLElement,
            elemsDescriptor: ElemsDesc<ELEMS>
        ): ELEMS {

    const elems = target.querySelectorAll<HTMLElement>(WCID_SELECTOR);

    let elements = {} as ELEMS;
    for(let i = 0; i < elems.length; ++i) {

        const name       = elems[i].getAttribute(WCID_ATTRNAME)!;
        const descriptor = elemsDescriptor[name];

        if( __DEBUG__ )
            if( descriptor === undefined)
                throw new Error(`Unknown element: ${name}`);

        if(elems[i].localName === "wc-placeholder") {

            if(__DEBUG__) {
                if( isClass(descriptor) )
                    throw new Error(`Expected factory descriptor for ${name}, got assertion descriptor`);
            }

            let element = descriptor as HTMLElement;
            if( typeof descriptor === "function")
                element = (descriptor as any)();

            // @ts-ignore
            elements[name] = element;
            elems[i].replaceWith(element);

            continue;
        }

        if( __DEBUG__ ) {
            if( ! isClass(descriptor) )
                throw new Error(`Expected assertion descriptor for ${name}, got factory descriptor`);

            if( ! (elems[i] instanceof descriptor) )
                throw new Error(`Element mismatch: ${name} expecting ${descriptor.name}, got ${elements[name].constructor.name}`);
        }

        // @ts-ignore
        elements[name] = elems[i];
    }

    if( __DEBUG__ ) {
        for(let name in elemsDescriptor)
            if( ! (name in elements) )
                throw new Error(`Element missing: ${name}`);
    }

    return elements;
}
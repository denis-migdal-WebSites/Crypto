export type Elems = Record<string, HTMLElement>;

export type ElemsDesc<T extends Elems> = {
    [K in keyof T]: T[K]|(new() => T[K])
}

export default function extractElements<
            ELEMS extends Elems
        >(
            target         : DocumentFragment|HTMLElement,
            elemsDescriptor: ElemsDesc<ELEMS>
        ): ELEMS {

    const elems = target.querySelectorAll<HTMLElement>('[data-wc-id]');


    let elements = {} as ELEMS;
    for(let i = 0; i < elems.length; ++i) {

        const name = elems[i].dataset.wcId!;
        if(elems[i].localName === "wc-placeholder") {
            // @ts-ignore
            elements[name] = elemsDescriptor[name];

            elems[i].replaceWith(elemsDescriptor[name] as HTMLElement);

            continue;
        }

        // @ts-ignore
        elements[name] = elems[i];
    }

    if( __DEBUG__ ) {
    
        for(let name in elements) {

            const descriptor = elemsDescriptor[name];

            if( descriptor === undefined )
                throw new Error(`Unextracted element: ${name}`);

            if( typeof descriptor !== "function")
                continue;

            if( ! (elements[name] instanceof descriptor) )
                throw new Error(`Element mismatch: ${name} expecting ${descriptor.name}, got ${elements[name].constructor.name}`);
        }

        for(let name in elemsDescriptor)
            if( ! (name in elements) )
                throw new Error(`Element missing: ${name}`);
    }

    return elements;
}
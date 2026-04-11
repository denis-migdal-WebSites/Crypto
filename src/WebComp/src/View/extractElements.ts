export type Elems = Record<string, HTMLElement>;

export type ElemsDesc<T extends Elems> = {
    [K in keyof T]: new() => T[K]
}

export default function extractElements<
            ELEMS extends Elems
        >(
            target         : DocumentFragment|HTMLElement,
            elemsDescriptor: ElemsDesc<ELEMS>
        ): ELEMS {

    const elems = target.querySelectorAll<HTMLElement>('[data-wc-id]');


    let elements = {} as ELEMS;
    for(let i = 0; i < elems.length; ++i)
        // @ts-ignore
        elements[elems[i].dataset.wcId!] = elems[i];

    if( __DEBUG__ ) {
    
        for(let name in elements)
            if( ! (elements[name] instanceof elemsDescriptor[name]) )
                throw new Error(`Element mismatch: ${name} expecting ${elemsDescriptor[name].name}, got ${elements[name].constructor.name}`);

        for(let name in elemsDescriptor)
            if( ! (name in elements) )
                throw new Error(`Element missing: ${name}`);
    }

    return elements;
}
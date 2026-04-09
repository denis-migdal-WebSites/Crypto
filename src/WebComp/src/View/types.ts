export type Elems = Record<string, HTMLElement>;

// used as this.
export interface ViewCtx<ELEMS extends Elems> {
    target  : HTMLElement,
    root    : DocumentFragment|HTMLElement,
    elements: ELEMS
}
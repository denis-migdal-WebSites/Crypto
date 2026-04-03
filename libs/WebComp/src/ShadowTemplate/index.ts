export type ContentGenerator = () => DocumentFragment|HTMLElement;

export type ShadowTemplateArgs = {
    content  ?: ContentGenerator|null,
    style    ?: CSSStyleSheet[]|CSSStyleSheet
}

export default class ShadowTemplate {

    protected generateContent: ContentGenerator|null;
    protected styles         : CSSStyleSheet[];

    constructor({
                    content  = null,
                    style    = [],
                }: ShadowTemplateArgs = {}
            ) {

        this.generateContent = content;

        if( style !== null && ! Array.isArray(style) )
            style = [style];
        this.styles = style;
    }

    createShadowRoot(target: HTMLElement) {

        const root = target.attachShadow({ mode: 'open' });

        // in order to avoid redraw :
        // - style before content.
        // - setup before insertion.
        if( this.styles.length )
            root.adoptedStyleSheets.push(...this.styles);

        if( this.generateContent !== null) {
            const content = this.generateContent();

            customElements.upgrade(content); //TODO: vérifier.

            root.replaceChildren(content);
        }

        return root;
    }
}
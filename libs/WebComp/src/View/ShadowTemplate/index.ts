import style    from "./parsers/style";
import template from "./parsers/template";

export type ContentGenerator = () => DocumentFragment|HTMLElement;

type ContentType = ContentGenerator|null;
type StyleType   = CSSStyleSheet[];

type RawContentType = string|ContentGenerator|null;
type RawStyleType   = string|CSSStyleSheet[]|CSSStyleSheet;

export type ShadowTemplateArgs = {
    content  ?: RawContentType,
    style    ?: RawStyleType
}

export default class ShadowTemplate {

    protected generateContent: ContentGenerator|null;
    protected styles         : CSSStyleSheet[];

    static parseContent(rawContent: RawContentType): ContentType {

        if( typeof rawContent !== "string" )
            return rawContent;

        const contentTemplate = template(rawContent); 
        return () => contentTemplate.cloneNode(true);
    }

    static parseStyle(rawStyle: RawStyleType): StyleType {

        if( typeof rawStyle === "string" )
            return [style(rawStyle)];

        if( ! Array.isArray(rawStyle) )
            return [rawStyle];
        
        return rawStyle;
    }

    constructor({
                    content  = null,
                    style    = [],
                }: ShadowTemplateArgs = {}
            ) {

        this.generateContent = ShadowTemplate.parseContent(content);
        this.styles          = ShadowTemplate.parseStyle  (style);
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
import { UI } from ".";
import { onPropertiesChange, propertiesChangeDetector } from "../../Properties/PropertiesListeners";

export class RefreshRules<C extends {properties: T}, T extends Record<string, any>> {

    readonly controller: C;
    readonly ui        : UI;

    readonly callback  = () => this.evaluate();
    readonly callbacks = new Array<() => void>();

    isListeningProperties = false;

    evaluate() {
        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i]();
    }

    constructor(controller: C, ui: UI) {
        this.controller = controller;
        this.ui         = ui;

        ui.addToRefresh( this.callback );
    }

    whenPropertiesChanged(keys   : readonly (Extract<keyof T, string>)[],
                         callback: () => void) {

        if( ! this.isListeningProperties ) {
            onPropertiesChange( this.controller.properties as any, //TODO...
                                this.ui.requestRefresh )
            this.isListeningProperties = true;
        }

        const detectChange = propertiesChangeDetector(
                                        this.controller.properties,
                                        ...keys);

        this.callbacks.push(() => {
            if( detectChange() )
                callback();
        });
    }
}
import { PropertiesStore } from "./PropertiesStore";
import { PROXY_TARGET, ProxyProperties } from "./PropertiesProxy";

export function onPropertiesChange<T extends Record<string, any>>(
                            target  : ProxyProperties<T, PropertiesStore<T>>,
                            callback: (src: unknown) => void
                        ) {

    const store = target[PROXY_TARGET];

    store.addListener( callback );
}

export function onPropertiesExternalChange<T extends Record<string, any>>(
                            target  : ProxyProperties<T, PropertiesStore<T>>,
                            callback: () => void
                        ) {

    onPropertiesChange( target, (src) => {
        if( src !== target ) callback();
    })
}
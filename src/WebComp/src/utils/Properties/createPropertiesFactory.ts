import { Descriptors, PropertiesStore } from "./PropertiesStore";
import createProxyClass from "./PropertiesProxy";

export default function createPropertiesFactory<T extends Record<string, any>>(
                                                    descriptors: Descriptors<T>
                                                ) {

    const keys  = [...Object.keys(descriptors)] as (Extract<keyof T, string>)[];
    const Proxy = createProxyClass<T>(keys);

    return () => {

        const store = new PropertiesStore(descriptors, Proxy as any);

        return store.mainProxy;
    }
}
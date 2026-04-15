import { Descriptors, PropertiesStore } from "./PropertiesStore";
import createProxyClass from "./PropertiesProxy";

export default function createPropertiesFactory<T extends Record<string, any>>(
                                                    descriptors: Descriptors<T>
                                                ) {

    const keys  = [...Object.keys(descriptors)] as (Extract<keyof T, string>)[];
    const Proxy = createProxyClass<T>(keys);

    return (initialValues: Partial<T> = {}) => {

        const store = new PropertiesStore(descriptors, Proxy as any);

        store.updateProperties(initialValues);

        return store.mainProxy;
    }
}
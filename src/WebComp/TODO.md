Features
========

Pas besoin actuellement
-----------------------

- Option to choose when to construct/initialize View...

- resolveElements
    - validation vs generation fct => (target) => (?) depends on the returnedTyped.

- lazyUpdateProperties(obj[, keys], [src?]) /!\ get keys !
    - getKeys() => sources[name] = obj.
    - has Lazy()...
    -> plusieurs formes possibles...
        -> true obj... (easier to get keys if not provided...)
            -> requires ROPropertiesProxy... (i.e. no set)...
        -> () => obj...
            ~> + facile à tester que LazyValueProvider...
            -> no need for ad hoc classes...
    -> trigger once...  **NON** => can update without accessing.

- RefreshStrategy (plus loin que isConnected)
    => getBoundingClientRect / getComputedStyle().visibility => polling (bad)
        ~> à éviter (re-ajoute renderTask à chaque frame...)
    => IntersectionObserver
        ~> à éviter (saute une frame...)

[.descriptors]
// add properties to datasets (?).
-> data : liveArray<string>()
    -> exposes .add()/.remove() -> marks things as stale.
    -> .elements (roArray).

- liveAggregation({color: References<T>("color")}) [=> instance => structuredClone()].
        => stucturedClone + list references -> addX() (target[key] = value)
    => addX( update: (data) => void ); [interne = libre].
    => + setup => store original value to re-establish when removeX().
    => ext. references needs to also transmit stale.
    addReference(props, path, props, propname) [?].

ChartJS++
---------

=> ChartJS : config générator (testable) vs Chart.
    => ChartCfg
    => DatasetCfg
        => can be shared or not (use DOM API).
        => .chartjs / .value (?).
    => TESTS !!!

=> override rAF when .update() [?].
    => chart.render();

- parts (for easier reuse...)

- createControllerProviderFromState(state) [?].

Types
-----

/*
    => to merge...
const x = {
    foo: { faa: 34 }
}

type Get<X, T extends string> = T extends `${infer L}.${infer R}` ? Get<X[L], R> : X[T];

type Z = Get<typeof x, "foo.faa">;


type Get2<S extends string, T> = S extends `${infer L}.${infer R}` ? {[K in L]: Get2<R, T>} : {[K in S]: T};

type A = Get2<"foo.fuu.faa", string> & { foo: {fii: 34} };
const a = {} as A;

a.foo.fuu.faa
*/

Refactors
=========

- Event => outside : onX (<- override + create Event structure if does not exists [Symbol]).
    ~> ou directement (moins h4cky).

=> Properties: also RO interface...

- list-loader (?).

- Séparer CreateController (target, hooks)
    -> fct(target, hooks)
        => extractViewData(target).
        => buildHooks(hooks).
    -> define : accept class => default fct.

- fix types
    - rendre types + indépendants (notamment fonctions/classes).
    - PropertiesProxy type issues...
        - inputs vs outputs / {[SYMBOLS]} for fcts
    - use WithProperties type.
    - types in createView + use ViewCallback... (move it somewhere)
    - dont any & @ts-ignore...

- sortir les comportements ?
    /!\ pas trop générique !!! => uniquement si BESOIN.
    - peut-être
        - on      : ViewHooks() -> dans le controllerFactory (?).
    - pas besoin
        - elements: ViewElements()
        - template: ViewTemplate(html, css) [?].
    ...

+ cf TODOs
- use guards
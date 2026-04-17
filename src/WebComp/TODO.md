
Features
========

Pas besoin actuellement:
- refreshStrategy
    ~> IntersectionObserver (cf LISS) ?
    ~> replanify
- forcePropertiesValue (=> prochain set/revalidate, restore ?)
- parts (for easier reuse...)

Refactors
=========

- sortir les comportements ?
    /!\ pas trop générique !!! => uniquement si BESOIN.
    - peut-être
        - on      : ViewHooks() -> dans le controllerFactory (?).
    - pas besoin
        - elements: ViewElements()
        - template: ViewTemplate(html, css) [?].
    ...

- Séparer CreateController (target, hooks)
    -> fct(target, hooks)
        => extractViewData(target).
        => buildHooks(hooks).
    -> define : accept class => default fct.

- fix types
    - rendre types + indépendants
    - PropertiesProxy type issues...
        - inputs vs {[SYMBOLS]} for fcts
    - use WithProperties type.
    - types in createView + use ViewCallback...
    - dont @ts-ignore...
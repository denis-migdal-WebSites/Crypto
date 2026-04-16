
Features
========

Pas besoin actuellement:
- refreshStrategy
    ~> IntersectionObserver (cf LISS) ?
    ~> replanify
- forcePropertiesValue (=> prochain set/revalidate, restore ?)

Refactors
=========

- sortir les comportements ?
    /!\ pas trop générique !!! => uniquement si BESOIN.
    - peut-être
        - on      : ViewHooks() ou dans le attachController (?).
    - pas besoin
        - elements: ViewElements()
        - template: ViewTemplate(html, css) [?].
    ...

- Séparer CreateController (target, hooks) => extractViewData(target).
    a. default function (extract data) - use si pas classe.
    - si class, default function.
    -> pas encore init mais hooks "fonctionnels" (?).

- fix types
    - rendre types + indépendants
    - PropertiesProxy type issues...
        - inputs vs {[SYMBOLS]} for fcts
    - use WithProperties type.
    - types in createView + use ViewCallback...
    - dont @ts-ignore...
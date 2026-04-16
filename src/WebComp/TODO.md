- separer ui functions.
- fix types
    - rendre types + indépendants
    - PropertiesProxy type issues...
        - inputs vs {[SYMBOLS]} for fcts
    - use WithProperties type.
    - types in createView + use ViewCallback...
    - dont @ts-ignore...

~> IntersectionObserver (cf LISS) ?

0. Séparer / Découper en composables...
    4. CreateController (target, hooks) => extractViewData(target).
        a. default function (extract data) - use si pas classe.
        - si class, default function.
        -> pas encore init mais hooks "fonctionnels" (?).

=================================

-> updateUiStrategy => pour le render global (?).
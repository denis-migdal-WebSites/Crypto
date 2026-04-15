0. Séparer / Découper en composables...
    1. ResolveElements (pas de controller).
        a. make it 2 steps.
        b. instance vs function vs klass.
        - step1 : placeholder + filter.
            - fct car also be an assertFct.
            - pas de controller.
            - pas de data => ce n'est pas le moment d'init.
                => si besoin, utiliser initUi.
        - step2 : verify types.
    4. CreateController (target, hooks) => extractViewData(target).
        a. default function (extract data) - use si pas classe.
        - si class, default function.
        -> pas encore init mais hooks "fonctionnels" (?).
    5. initUi system...
        a. TODO (ofc)
    => indep + composition...

2. Placeholders
3. render (+ ui components)
4. Sep. ui data (needs) (?).
5. Remove hooks (or decorator?).

=================================
- placeholder
    - replace elem by callback (data) => elem.
    - data is given to extractElements.
    - also in createView.

- render:
    -> attachController => initUi
        -> option : updateAfterInit (?).
    -> updateUiStrategy => pour le render global (?).
    -> updateUi/~requestUpdateUi pour all -> exposé bypass strat.
    // per data vs -> per ui component...
    -> uiColor: () => { // division intéressant si reuse.
        init  : X,
        update: X
        // ^--- appeler que si changements => fct décorateurs ?
        // adaptors aussi possibles...
        => comme cela :
            - per instance data
            - extraire les paramètres ?
    }
    // /!\ ne pas confondre avec pré-traitements i.e. computed properties.
    // should be indep.

- Option to choose when to initialize View...

=> tsconfig (?)
    => references
    => composite

Principes
=========

- resolveElements pour un accès sécure.
- éviter manipulation attributs sur le DOM.
- éviter de dépendre de l'upgrade d'un parent/enfant.

- savoir "quelle propriété a changée" difficile si defer (changé par rapport à quel état précédent) ?
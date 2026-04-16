0. Séparer / Découper en composables...
    4. CreateController (target, hooks) => extractViewData(target).
        a. default function (extract data) - use si pas classe.
        - si class, default function.
        -> pas encore init mais hooks "fonctionnels" (?).
    5. initUi system...
        a. TODO (ofc)
        => indep + composition...
        => ~render

=================================

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
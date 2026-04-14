1. Simple state/data (build proxy + callback + expose + descriptor + WithData).
    /!\ notion de vue...
    .getVue(callback, callback) [?].
2. Placeholders

3. render (+ ui components)
4. Sep. ui data (needs) (?).

=================================
- placeholder
    - replace elem by callback (data) => elem.
    - data is given to extractElements.
    - also in createView.

- data
    - split into composable fonctions...
        - StrictlyPositive(Int(Default("2"))).
        - Array(String(Default("")))*
    - data vs ui-data (besoin de la séparation ?).
        - ou ~ split (?).

- state:
    -> impl (cf notes)
        => layers (ext vs internal updates) (?)
            ~> getStateProxy (???)
                => event origin
                => callback1
                => callback2
        -> object with properties + default + checks + computed (how?).
        -> onChangeCallback <= with last change (props/obj).
        -> setProperties()/updateProperties().
        => signals = after...
    - state (simple) vs events (cumul - consommation) e.g. animation.
        - onStateChange (state)
            -> (whatChanged) <- used by Signal after ?
        - onXXXX autres events.
    - full notify
        => partial notification complex si deferred.
        => "si a changé" => i.e. par rapport à quel état précédent ?

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
- render:
    - onStateChanged()
    - requestRender => where [?]
    - render(state) <= how to get state (?) <= onRender (?).
        - render(ctrler) [?].
    => requires state+update system... (how?)

- data:
    - configureController
        => better on creation...
        => replace by ~onDataChanged...
    - listen attrs (=> call configureController) [true/false] (?).
    - fonction pour des configurations auto (?).
    - séparer parsing / validations / defaults (?) [parsers vs validators].

- Option to choose when to initialize View...

=> tsconfig (?)
    => references
    => composite
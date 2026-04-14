View:
/!\ besoins avant généricité !
- expose
    - update(X = null) [bypass]
- stable
    - content/style : optional, opinionated.
    - elements : declarative.
    - data     : declarative.
=> découpages only utiles si reuse... (chartjs++ / shared ctrler/data...)
- uiX : ~= declare sub-component init/update.
    - ui => global called first.
        ~> else delegate parent (?)
- onXXXX     : hooks externes => events.
    - onStateChanged() => default requestUpdate().
    - onXXXX => autres events (e.g. animations).
- processXXX : hooks internes.
    - process => global (?) called first (?).
        ~> else delegate parent (?)
    - processDataChange 
    - processUiUpdateRequest (~ strategy ?)

- [Passive]View(target):
    - no logic, only DOM manipulations.
    - instantiate the ShadowRoot
    - listen events and call Controller methods.
    - expose handlers used by Controller (as hooks).
        - render vs actions.
- Controller(hooks):
    - expose an API.
    - expose hooks.

- State(hook):
    - optional, defined/used by Controller.
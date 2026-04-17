Steps
=====

1. ShadowTemplate.
2. ResolveElements.
3. [CreateHooks] (ViewCtx)
4. CreateController.
    - default factory / (data&{hookProvider}) do NOT use elements.
5. SetupUi (ViewCtx)

ViewCtx:
- {target, root, elements}
- controller (separated for testing purposes).

Principes
=========

/!\ besoins réels avant généricité !

- resolveElements pour un accès sécure.
- éviter manipulations des attributs sur le DOM.
- éviter de dépendre de l'upgrade d'un parent/enfant.

- init: elements vs ui.init
    - elements: the element is required by others (known type).
    - ui.init : may use the controller to init, e.g. listen DOM.
    - elements + ui.init: creation + initialization.

- savoir "quelle propriété a changée" difficile si defer (changé par rapport à quel état précédent) ?
- state vs hooks: state = can miss an intermediate change, hooks cannot miss.

Architecture
============

- [Passive]View(target):
    - no logic, only DOM manipulations.
    - instantiate the ShadowRoot
    - initialize and update UI, e.g. listen DOM events.
    - persistant data => dans Controller.properties ou stocké sur élément DOM.

- Controller(properties):
    - [state] expose properties.
    - [hooks] expose an API and hooks.
        -> cannot depends on controller, required data as parameters.

- Properties
    - Property: define the get()/set()/markStale().
    - For dataset: SubProperty to modify value ?
        - color.get() => from dataset.color
        - color.set() => modify dataset.color
            /!\ ChartUpdate (revérifier comportement)...
    - For signals: requires lazyUpdate(source, ...keys).
    - store sources[propname] = source.
    - when get() => fetch lazy updates.
    - either proxy Properties or integrate in PropertiesStore

TODO
====

- Option to choose when to construct/initialize View...
- resolveElements: add args argument for factory functions (not used).
- Controller => si classe, default factory (avec ExtractProperties(target) ).

=> tsconfig (?)
    => references
    => composite
=> fonction callHook(name, ...args) cstr instead of Hooks (?).
        <string, (...args) => X> & Partial<string, (...args) => X|undefined>.
    => create context before controller...
    => ctx.controller issue...
        => hookProvider: {
            callHook : XXX.
            setSource: XXX => permet de bind et fixer ctx (?).
        }
A/ setHandlersProvider
    => trigger(name, ...args).
        => il peut chercher + mettre "ctx" => ctrler dans "ctx" ?

B/ handlers as object, not methods.
C/ Replace ViewClass by object (method initializeView return ViewContext).


1/ Return Object.
    => fcts
    => handlers
    => getController/attachController
2/ View.initializeView(target[, controller]) -> ViewCtx.
    3/ View.createViewContext(target).
    +> add controller but hide it.


=> static props, not methods
    => createViewContext ? initView ?
    => handlers (more secure?)
=> ViewCtx not View

-> ViewCstr => not ViewCtx.

- Option to choose when to initialize View...


=> tsconfig (?)
    => references
    => composite
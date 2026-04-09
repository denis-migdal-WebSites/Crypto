export default function createViewClass2(_args: any) {

}


/**/
type AH = {
    "foo": (i: number) => void
};

class A {

    readonly callHook: HookCaller<AH>;

    // NO_HOOKS quite hard to create (?).
    constructor(hooksProvider: HookProvider<A>) {
        this.callHook = hooksProvider(this);

        const rest = this.callHook("foo", 24);
        void rest; // test
    }
}

new A( hooks({
    foo() {
        return 34;
    }
}));

const View = createViewClass2({})

void View; // test

/**/
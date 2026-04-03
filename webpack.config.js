import buildConfigs from "./build/WebpackFramework/index.js";

export default buildConfigs("./src/",
                            "./dist/${version}/", {
                                "@WebCompLib" : "libs/WebComp/src/lib/",
                            });
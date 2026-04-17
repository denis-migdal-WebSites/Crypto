import buildConfigs from "./build/WebpackFramework/index.js";

export default buildConfigs("./src/",
                            "./dist/${version}/", {
                                // "libs/WebComp/src/lib/",
                                // "@WebCompLib" : "src/WebComp/src/lib",
                            });
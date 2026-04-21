import { resolveElements }  from "@WebCompLib";
import MappedInputGrid      from "@/components/MappedInputGrid";
import CHARSET              from "@/core/charset";
import rotateArray          from "@/core/rotateArray";
import toCharArray          from "@/core/toCharArray";
import { chiffrer, dechiffrer }         from "@/core/cypher";
import IndexNavigator from "@/components/IndexNavigator";

const MESSAGE      = "Ceci est le message à chiffrer.";
const SECRET       = 12;

const MSG = toCharArray(MESSAGE);

const TABLE  = rotateArray(CHARSET, SECRET);
const LABELS = chiffrer(MSG, TABLE);

const question = new MappedInputGrid({
    labels  : LABELS,
    expected: LABELS,
    ro      : true
});

const table = new MappedInputGrid({
    labels  : CHARSET,
    expected: CHARSET,
    ro      : true,
});

resolveElements(document.body, {
    question,
    navigator: new IndexNavigator({
        count   : CHARSET.length,
        callback: (idx) => {
            const TABLE = rotateArray(CHARSET, idx);
            table.properties.expected = TABLE;
            question.properties.expected = dechiffrer(LABELS, TABLE);
        }
    }),
    table
});
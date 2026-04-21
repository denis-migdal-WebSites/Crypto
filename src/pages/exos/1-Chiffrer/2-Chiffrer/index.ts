import { resolveElements }  from "@WebCompLib";
import MappedInputGrid      from "@/components/MappedInputGrid";
import CHARSET              from "@/core/charset";
import rotateArray          from "@/core/rotateArray";
import toCharArray          from "@/core/toCharArray";
import { chiffrer }         from "@/core/cypher";

const MESSAGE      = "Ceci est le message à chiffrer.";
const CESAR_SECRET = 5;

const TABLE    = rotateArray(CHARSET, CESAR_SECRET);
const LABELS   = toCharArray(MESSAGE);
const EXPECTED = chiffrer(LABELS, TABLE);

resolveElements(document.body, {
    question: new MappedInputGrid({
        labels  : LABELS,
        expected: EXPECTED
    }),
    table: new MappedInputGrid({
        labels  : CHARSET,
        expected: TABLE,
        ro      : true,
    })
});
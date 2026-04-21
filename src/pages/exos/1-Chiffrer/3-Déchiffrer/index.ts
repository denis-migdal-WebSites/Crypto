import { resolveElements }  from "@WebCompLib";
import MappedInputGrid      from "@/components/MappedInputGrid";
import CHARSET              from "@/core/charset";
import rotateArray          from "@/core/rotateArray";
import toCharArray          from "@/core/toCharArray";
import { chiffrer }         from "@/core/cypher";

const MESSAGE      = "Je suis un texte très secret.";
const CESAR_SECRET = 5;

const TABLE    = rotateArray(CHARSET, CESAR_SECRET);
const EXPECTED = toCharArray(MESSAGE);
const LABELS   = chiffrer(EXPECTED, TABLE);

resolveElements(document.body, {
    question: new MappedInputGrid({
        labels  : LABELS,
        expected: EXPECTED
    }),
    table: new MappedInputGrid({
        labels  : TABLE,
        expected: CHARSET,
        ro      : true,
    })
});
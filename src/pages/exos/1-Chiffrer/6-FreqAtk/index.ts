import { resolveElements }  from "@WebCompLib";
import MappedInputGrid      from "@/components/MappedInputGrid";
import CHARSET, { Char }              from "@/core/charset";
import rotateArray          from "@/core/rotateArray";
import toCharArray          from "@/core/toCharArray";
import { chiffrer }         from "@/core/cypher";

import freqTable, { countChars, FreqTable } from "@/core/freqTable";
import { onPropertiesChange } from "@/WebComp/src/utils/Properties/PropertiesListeners";

const FR_freq = freqTable();

function freqToLabels(freqTable: FreqTable) {
    return freqTable.map( (entry) => entry[0]);
}
function freqToPercent(freqTable: FreqTable) {
    return freqTable.map( (entry) => `${(entry[1]*100).toFixed(2)}%`);
}

const FR_labels   = freqToLabels(FR_freq);
const FR_expected = freqToPercent(FR_freq);

const FR_freqTable = new MappedInputGrid({
    labels  : FR_labels,
    expected: FR_expected,
    ro      : true
});

const MESSAGE = __LOAD_FILE__("./extrait.txt");
const SECRET       = 12;

const MSG = toCharArray(MESSAGE);

const TABLE  = rotateArray(CHARSET, SECRET);
const LABELS = chiffrer(MSG, TABLE);

const txt_freq = freqTable(countChars(LABELS));


const txt_labels   = freqToLabels(txt_freq);
const txt_expected = freqToPercent(txt_freq);

const question = new MappedInputGrid({
    labels  : LABELS,
    expected: LABELS.map( _ => ''),
    ro      : true
});

const txt_table = new MappedInputGrid({
    labels  : txt_labels,
    expected: txt_expected,
    ro      : true,
});

const table = new MappedInputGrid({
    labels  : CHARSET,
    expected: ["?"],
});

onPropertiesChange(table.properties, () => {
    const corr_table = table.properties.answers as readonly Char[];

    question.properties.expected = chiffrer(LABELS, corr_table);
});

resolveElements(document.body, {
    question,
    FR_table : FR_freqTable,
    txt_table: txt_table,
    table    : table
});
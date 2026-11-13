import { Note } from "./Note";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { VoiceEntry } from "./VoiceEntry";
import { SourceStaffEntry } from "./SourceStaffEntry";
import { Pitch } from "../../Common/DataObjects/Pitch";
import { SourceMeasure } from "./SourceMeasure";
/** One bend movement, measured in semitones rather than fret numbers. */
export interface TabBendSegment {
    bendalter: number;
    direction: string;
}
export declare class TabNote extends Note {
    constructor(voiceEntry: VoiceEntry, parentStaffEntry: SourceStaffEntry, length: Fraction, pitch: Pitch, sourceMeasure: SourceMeasure, stringNumber: number, fretNumber: number, bendArray: TabBendSegment[]);
    /** Whether the fret number is drawn: false when the `<notations>` with string and fret have print-object="no",
     *  e.g. for the end note of a bend from MuseScore (see VoiceGenerator). */
    FretVisible: boolean;
    /** Whether the fret number is drawn in parentheses, from `<notehead parentheses="yes">`. */
    FretParentheses: boolean;
    private stringNumberTab;
    private fretNumber;
    private bendArray;
    /** Returns the string number the note should be played on. Note there can also be violin string numbers in treble clef. */
    get StringNumberTab(): number;
    get FretNumber(): number;
    get BendArray(): TabBendSegment[];
    hasTabEffects(): boolean;
}

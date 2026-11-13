import { Fraction } from "../../Common/DataObjects/Fraction";
export declare enum NoteType {
    UNDEFINED = 0,// e.g. not given in XML
    _1024th = 1,// enum member cannot start with a number
    _512th = 2,
    _256th = 3,
    _128th = 4,
    _64th = 5,
    _32nd = 6,
    _16th = 7,
    /** Misspelled name of EIGHTH (same value), kept for compatibility. */
    EIGTH = 8,
    EIGHTH = 8,// same value, so QUARTER etc. keep their values (= their index in NoteTypeHandler.NoteTypeXmlValues)
    QUARTER = 9,
    HALF = 10,
    WHOLE = 11,
    BREVE = 12,
    LONG = 13,
    MAXIMA = 14
}
export declare class NoteTypeHandler {
    static NoteTypeXmlValues: string[];
    static NoteTypeToString(noteType: NoteType): string;
    static StringToNoteType(noteType: string): NoteType;
    /**
     *
     * @param type
     * @returns {Fraction} - a Note's Duration from a given type (type must be valid).
     */
    static getNoteDurationFromType(type: string): Fraction;
    /** How many quarter notes a metronome beat unit lasts, used to convert a metronome mark's
     *  per-minute value (which is relative to its beat unit) into quarter notes per minute for
     *  playback. E.g. "half" -> 2, "quarter" -> 1, "eighth" -> 0.5. A dot adds half of the beat unit's length and each
     *  further dot half of what the dot before it adds, e.g. 1.5 for a dotted quarter and 1.75 for a double-dotted one.
     *  Falls back to a quarter note (with its dots) for an unknown/missing beat unit so
     *  playback tempo stays sane. */
    static beatUnitInQuarters(beatUnit: string, dots?: number): number;
}

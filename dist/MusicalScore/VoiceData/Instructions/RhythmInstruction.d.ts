import { AbstractNotationInstruction } from "./AbstractNotationInstruction";
import { Fraction } from "../../../Common/DataObjects/Fraction";
/**
 * A [[RhythmInstruction]] is the time signature which specifies the number of beats in each bar, and the value of one beat.
 */
export declare class RhythmInstruction extends AbstractNotationInstruction {
    /**
     * @param numeratorGroups The groups of an additive numerator, e.g. [2, 2, 3] for 2+2+3/8 (see NumeratorGroups).
     *   Their sum is the numerator of rhythm.
     */
    constructor(rhythm: Fraction, rhythmSymbolEnum: RhythmSymbolEnum, numeratorGroups?: number[]);
    private numerator;
    private denominator;
    private rhythm;
    private symbolEnum;
    private numeratorGroups;
    /** Whether this time signature was not given in the source (e.g. MusicXML), but synthesized by default,
     * e.g. a default 4/4 for a sample without a time signature like Satie's Gnossiennes.
     * Such a time signature is not rendered by default (see EngravingRules.RenderTimeSignaturesForSamplesWithoutTimeSignature). */
    SynthesizedFromNoTimeSignature: boolean;
    get Rhythm(): Fraction;
    set Rhythm(value: Fraction);
    /** The groups of an additive numerator as given in the source, e.g. [2, 2, 3] for MusicXML's `<beats>2+2+3</beats>`
     * with `<beat-type>8</beat-type>`: the time signature is drawn as 2+2+3/8 instead of 7/8.
     * Undefined for a single number like 7. Rhythm has their sum (7/8), which is what durations use.
     */
    get NumeratorGroups(): number[];
    get SymbolEnum(): RhythmSymbolEnum;
    set SymbolEnum(value: RhythmSymbolEnum);
    clone(): RhythmInstruction;
    OperatorEquals(rhythm2: RhythmInstruction): boolean;
    OperatorNotEqual(rhythm2: RhythmInstruction): boolean;
    ToString(): string;
}
export declare enum RhythmSymbolEnum {
    NONE = 0,
    COMMON = 1,
    CUT = 2
}

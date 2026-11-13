import { MusicSheet } from "../../MusicSheet";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { Instrument } from "../../Instrument";
import { MultiExpression } from "../../VoiceData/Expressions/MultiExpression";
import { IXmlElement } from "../../../Common/FileIO/Xml";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
export declare class ExpressionReader {
    private musicSheet;
    private placement;
    private soundTempo;
    private soundTimestamp;
    private explicitSoundTempo;
    private soundDynamic;
    private soundDynamicTimestamp;
    private divisions;
    private offsetDivisions;
    private staffNumber;
    private globalStaffIndex;
    private directionTimestamp;
    private currentMultiTempoExpression;
    private openContinuousDynamicExpressions;
    private openContinuousTempoExpression;
    private activeInstantaneousDynamic;
    private openOctaveShifts;
    private pendingOctaveShiftStops;
    private lastWedge;
    private WedgeYPosXml;
    private openPedal;
    private openWavyLine;
    /** Unicode text for SMuFL note symbols between words, e.g. metNote8thUp in "Fast (Straight ♪)".
     *  Notes use the text's font or a fallback font. Stem-down variants use the same note value's stem-up character.
     *  Unsupported names are omitted without removing the surrounding words. */
    private static readonly noteSymbolTexts;
    constructor(musicSheet: MusicSheet, instrument: Instrument, staffNumber: number);
    getMultiExpression: MultiExpression;
    readExpressionParameters(xmlNode: IXmlElement, currentInstrument: Instrument, divisions: number, inSourceMeasureCurrentFraction: Fraction, inSourceMeasureFormerFraction: Fraction, currentMeasureIndex: number, ignoreDivisionsOffset: boolean): void;
    read(directionNode: IXmlElement, currentMeasure: SourceMeasure, inSourceMeasureCurrentFraction: Fraction, inSourceMeasurePreviousFraction?: Fraction, dirNodes?: IXmlElement[]): void;
    /** Usually called at end of last measure. */
    closeOpenExpressions(sourceMeasure: SourceMeasure, timestamp: Fraction): void;
    addOctaveShift(directionNode: IXmlElement, currentMeasure: SourceMeasure, endTimestamp: Fraction, endVoiceEntryCount?: number): void;
    addPedalMarking(directionNode: IXmlElement, currentMeasure: SourceMeasure, endTimestamp: Fraction): void;
    private endOpenPedal;
    addWavyLine(wavyLineNode: IXmlElement, currentMeasure: SourceMeasure, currentTimestamp: Fraction, previousTimestamp: Fraction): void;
    private initialize;
    private readPlacement;
    private readExpressionPlacement;
    private readPosition;
    /** Parse a complex metronome mark with metronome-note elements and a metronome-relation (e.g. swing notation). */
    private parseComplexMetronomeMark;
    /** Parse a note equation written with two beat units instead of metronome-note elements, e.g. quarter = dotted quarter
     *  (MusicXML's simpler form of a metric modulation). The first beat unit, with its dots and tied beat units, is the left
     *  side, the second one the right side.
     */
    private parseBeatUnitNoteEquation;
    /** Add a note equation (e.g. a swing mark or a metric modulation) as a metronome mark. Its BPM is the direction's
     *  sound tempo, or 0, which TemposCalculator replaces with the tempo in force times the equation's tempo factor.
     */
    private addNoteEquation;
    private interpretInstantaneousDynamics;
    private interpretWords;
    private readNumber;
    private interpretWedge;
    private interpretRehearsalMark;
    private createNewMultiExpressionIfNeeded;
    private readDirectionTimestamp;
    /** Returns the number of a MusicXML decimal, e.g. of an `<offset>` or a `<sound tempo>`: an optional sign and digits
     *  with an optional decimal point, e.g. "142.5", "-0.5", "+120." or ".5", with or without surrounding XML whitespace
     *  (spaces, tabs, line breaks). Returns NaN for any other text, e.g. "1e3", "120,5" or "", and an infinite number for
     *  a decimal too large for a number.
     */
    private static readDecimal;
    /** The vertical position a `<words>` or `<dynamics>` element gives, in tenths of a staff space (see
     *  AbstractExpression.YPositionXml): its default-y plus its relative-y, or undefined without a default-y (a relative-y
     *  alone is relative to a position the file doesn't give). */
    private static readYPositionXml;
    private createNewTempoExpressionIfNeeded;
    private addWedge;
    private fillMultiOrTempoExpression;
    private createExpressionFromString;
    private closeOpenContinuousDynamic;
    private closeOpenContinuousTempo;
    private checkIfWordsNodeIsRepetitionInstruction;
    private hasDigit;
}

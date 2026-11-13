import { MusicSheet } from "../../MusicSheet";
import { IXmlElement } from "../../../Common/FileIO/Xml";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
import { RepetitionInstruction } from "../../VoiceData/Instructions/RepetitionInstruction";
export declare class RepetitionInstructionReader {
    /**
     * A global list of all repetition instructions in the musicsheet.
     */
    repetitionInstructions: RepetitionInstruction[];
    xmlMeasureList: IXmlElement[][];
    private musicSheet;
    private currentMeasureIndex;
    set MusicSheet(value: MusicSheet);
    /**
     * is called when starting reading an xml measure
     * @param measure
     * @param currentMeasureIndex
     */
    prepareReadingMeasure(measure: SourceMeasure, currentMeasureIndex: number): void;
    handleLineRepetitionInstructions(barlineNode: IXmlElement): boolean;
    /**
     * Reads the passes an ending is played on from its number attribute or text, e.g. [1, 3] from "1, 3", "1,3" or "1., 3.".
     * Ranges and plus signs aren't MusicXML, but are read too: [1, 2, 3, 6] from "1 - 3, 6", [1, 2] from "1 + 2".
     */
    private static readEndingNumbers;
    /**
     * Reads a repetition instruction (e.g. D.S., Fine, a segno sign) from a direction.
     * @param directionTypeNode the direction-type element (words, segno or coda)
     * @param relativeMeasurePosition the position of the direction in the measure: a jump at 0 may be taken at the barline before
     * @param soundNode the direction's sound element, if any: <sound segno="..."> marks a segno as the target of a D.S.
     *   Its dacapo, dalsegno, fine, tocoda, segno and coda attributes say which instruction the direction is when its words
     *   don't name one themselves, e.g. "Fin", "Da Capo bis Ende" or "D.C. senza replica".
     * @returns true if the direction is a repetition instruction, false if it is drawn as text
     */
    handleRepetitionInstructionsFromWordsOrSymbols(directionTypeNode: IXmlElement, relativeMeasurePosition: number, soundNode?: IXmlElement): boolean;
    /**
     * Returns the repetition instruction that the words are, or undefined if they are a general text,
     * which may mention an instruction, e.g. "voice tacet on D.S." (see #1687).
     * @param text the words, trimmed and in lower case
     */
    private static repetitionInstructionFromWords;
    /**
     * Returns the repetition instruction that the sound element's attributes mark, whatever the language of the words,
     * or undefined if they mark none.
     * @param soundNode the direction's sound element, if any
     */
    private static repetitionInstructionFromSound;
    /**
     * Returns the instruction a sound element states for the jump (see repetitionInstructionFromSound), e.g. a D.S. for a
     * D.S. al Coda, or undefined if the instruction isn't a jump: a segno or coda sign marks where the music lands.
     */
    private static soundTypeOfJump;
    /** Whether a sound element at the start of the current measure (before its first note or forward), in any part,
     *  states the instruction (see repetitionInstructionFromSound). */
    private isStatedAtMeasureStart;
    /** Whether the instruction type is a D.C. or D.S. (with or without al Fine / al Coda). */
    private static isJumpFromWords;
    removeRedundantInstructions(): void;
    private findInstructionInPreviousMeasure;
    private backwardSearchForPreviousIdenticalInstruction;
    /**
     * Adds the instruction unless the list has it already.
     * @param atBarlineBefore whether it's a jump read at the start of its measure but taken at the barline before (#1766).
     *   It goes where words at the end of the measure before would be read, so that the repetition calculator, which handles
     *   the list in order, treats both the same: before the instructions read since, those of the barline before (a backward
     *   repeat, an ending's end) and those of its own measure (e.g. an ending's start).
     */
    private addInstruction;
    /** Whether the instruction is read after words at the end of the measure: at the measure's right barline or later. */
    private static isAfterWordsAtMeasureEnd;
}

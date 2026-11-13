import { MusicSheet } from "../MusicSheet";
import { PartListEntry } from "../MusicSource/PartListEntry";
import { Repetition } from "../MusicSource/Repetition";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { MusicPartManagerIterator } from "./MusicPartManagerIterator";
export declare class MusicPartManager {
    constructor(musicSheet: MusicSheet);
    private parts;
    private timestamps;
    private musicSheet;
    private sheetStart;
    private sheetEnd;
    /**
     * Does what init() does again. Call it after changing how often a repetition is played (Repetition.UserNumberOfRepetitions,
     * e.g. with MusicSheet.setRepetitionNewUserNumberOfRepetitions()), so that the mapping between enrolled and sheet timestamps
     * follows the new order of the measures.
     */
    reInit(): void;
    /**
     * Main initialize method for MusicPartManager, called by MusicSheetReader when it has read a sheet:
     * copies the sheet's repetitions into Parts, sets the selection to the whole sheet (MusicSheet.SelectionStart and SelectionEnd,
     * which the cursor sets to the measures it draws when it's reset), and calculates the mapping between enrolled and sheet
     * timestamps (see absoluteEnrolledToSheetTimestamp()) by iterating through the sheet.
     */
    init(): void;
    /**
     * Returns the transform for the part of the enrolled time line that an enrolled timestamp is in. A part starts at each jump of
     * the playback, e.g. back to the start of a repeat or forward over an ending, and where a repetition starts.
     * In the part, the sheet timestamp is the enrolled timestamp + (to - $from).
     * @param curEnrolledTimestamp An enrolled timestamp, e.g. MusicPartManagerIterator.CurrentEnrolledTimestamp.
     */
    getCurrentRepetitionTimestampTransform(curEnrolledTimestamp: Fraction): TimestampTransform;
    /**
     * Returns the sheet timestamp of an enrolled timestamp. The enrolled timestamp is the time on the time line with the
     * repetitions played out (like MusicPartManagerIterator.CurrentEnrolledTimestamp), the sheet timestamp the position in the
     * sheet (like CurrentSourceTimestamp): in the second pass of a repeat, the sheet timestamp is earlier by the length of the
     * first pass.
     * @param timestamp An enrolled timestamp.
     */
    absoluteEnrolledToSheetTimestamp(timestamp: Fraction): Fraction;
    get Parts(): PartListEntry[];
    get MusicSheet(): MusicSheet;
    getIterator(start?: Fraction): MusicPartManagerIterator;
    setSelectionStart(beginning: Fraction): void;
    setSelectionRange(start: Fraction, end: Fraction): void;
    private calcMapping;
}
/**
 * The start of a part of the enrolled time line (see MusicPartManager.getCurrentRepetitionTimestampTransform()):
 * $from is the enrolled timestamp where the part starts, to the sheet timestamp there.
 */
export declare class TimestampTransform {
    constructor(enrolledTimestamp: Fraction, sheetTimestamp: Fraction, repetition: Repetition, curRepetitionIteration: number);
    $from: Fraction;
    to: Fraction;
    nextBackJump: Fraction;
    nextForwardJump: Fraction;
    curRepetition: Repetition;
    curRepetitionIteration: number;
}

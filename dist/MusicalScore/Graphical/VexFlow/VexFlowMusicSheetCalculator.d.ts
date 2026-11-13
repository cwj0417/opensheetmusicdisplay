import { MusicSheetCalculator } from "../MusicSheetCalculator";
import { GraphicalMeasure } from "../GraphicalMeasure";
import { StaffLine } from "../StaffLine";
import { VoiceEntry } from "../../VoiceData/VoiceEntry";
import { GraphicalNote } from "../GraphicalNote";
import { GraphicalStaffEntry } from "../GraphicalStaffEntry";
import { GraphicalTie } from "../GraphicalTie";
import { Tie } from "../../VoiceData/Tie";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
import { MultiExpression } from "../../VoiceData/Expressions/MultiExpression";
import { RepetitionInstruction } from "../../VoiceData/Instructions/RepetitionInstruction";
import { Beam } from "../../VoiceData/Beam";
import { ClefInstruction } from "../../VoiceData/Instructions/ClefInstruction";
import { OctaveEnum } from "../../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { LyricWord } from "../../VoiceData/Lyrics/LyricsWord";
import { OrnamentContainer } from "../../VoiceData/OrnamentContainer";
import { Articulation } from "../../VoiceData/Articulation";
import { Tuplet } from "../../VoiceData/Tuplet";
import { VexFlowMeasure } from "./VexFlowMeasure";
import Vex from "vexflow";
import VF = Vex.Flow;
import { TechnicalInstruction } from "../../VoiceData/Instructions/TechnicalInstruction";
import { Slur } from "../../VoiceData/Expressions/ContinuousExpressions/Slur";
import { GraphicalSlur } from "../GraphicalSlur";
import { ContinuousDynamicExpression } from "../../VoiceData/Expressions/ContinuousExpressions/ContinuousDynamicExpression";
import { InstantaneousTempoExpression } from "../../VoiceData/Expressions/InstantaneousTempoExpression";
import { EngravingRules } from "../EngravingRules";
import { GraphicalGlissando } from "../GraphicalGlissando";
import { Glissando } from "../../VoiceData/Glissando";
export declare class VexFlowMusicSheetCalculator extends MusicSheetCalculator {
    /** space needed for a dash for lyrics spacing, calculated once */
    private dashSpace;
    beamsNeedUpdate: boolean;
    /** Per-staff overflow (in pre-elongation units) of the previous measure's last lyric/chord
     *  past its bar line. Used to prevent the next measure's first lyric/chord from colliding
     *  with the overflow. Indexed first by Staff, then by verse/container index. */
    private previousLyricOverflowsByStaff;
    private previousChordOverflowsByStaff;
    /** Multi-measure repeat units awaiting skyline reservation in the current render. */
    private measureRepeatUnitsPendingSkyline;
    private metronomePlacements;
    constructor(rules: EngravingRules);
    protected clearRecreatedObjects(): void;
    protected formatMeasures(): void;
    /** Assigns repeat signs after fully written-out measures establish widths and system breaks. */
    private prepareMeasureRepeats;
    /** Groups each staff's contiguous valid repeat declarations into complete units. */
    private static findMeasureRepeatUnits;
    /** Assigns a repeat sign when its unit and referenced pattern are visible and abbreviable. */
    private tryCreateMeasureRepeat;
    /** Whether the unit can hide its notes without losing instructions, lyrics or connections to visible notation. */
    private static canAbbreviateMeasureRepeatUnit;
    /** Scan backwards to a rest-only entry or a lyric in any verse, matching calculateLyricExtend()'s forward scan. */
    private static hasIncomingLyricExtender;
    /** Whether a connection leaves this staff's unit, or a slur has an unattached end that may reach the barline. */
    private static measureRepeatNoteCrosses;
    /** Collects trill wavy-line ranges for this staff. */
    private findWavyLineRanges;
    /** Reserve after calculateSkyBottomLines() replaces the skyline and before measure numbers are placed above it. */
    protected reserveSkylineForMeasureRepeats(): void;
    /**
     * Calculates the x layout of the staff entries within the staff measures belonging to one source measure.
     * All staff entries are x-aligned throughout all vertically aligned staff measures.
     * This method is called within calculateXLayout.
     * The staff entries are aligned with minimum needed x distances.
     * The MinimumStaffEntriesWidth of every measure will be set - needed for system building.
     * Prepares the VexFlow formatter for later formatting
     * Does not calculate measure width from lyrics (which is called from MusicSheetCalculator)
     * @param measures
     * @returns the minimum required x width of the source measure (=list of staff measures)
     */
    protected calculateMeasureXLayout(measures: GraphicalMeasure[]): number;
    private calculateElongationFactor;
    /**
     * @param previousLyricOverflows Per-verse-index array (`[verseIndex]`) holding how far the
     *   previous measure's last lyric extends past its bar line into this measure (in pre-elongation
     *   units, +dashSpace if mid-word). Used to seed lastLyricEntryDict so the first lyric in this
     *   measure is forced to leave clearance from the overhang.
     * @param previousChordOverflows Same as previousLyricOverflows but for chord symbols.
     * @returns
     *   - `factor`: regular elongation factor from within-measure spacing constraints (subject to
     *     MaximumLyricsElongationFactor cap by the caller).
     *   - `lastLyricEntryDict` / `lastChordEntryDict`: final state of the per-verse last-entry
     *     dicts after processing. The caller uses these (with the post-cap measure width) to
     *     compute the overflows passed into the next measure's call.
     */
    calculateElongationFactorFromStaffEntries(staffEntries: GraphicalStaffEntry[], oldMinimumStaffEntriesWidth: number, elongationFactorForMeasureWidth: number, measureNumber: number, previousLyricOverflows?: number[], previousChordOverflows?: number[]): {
        factor: number;
        lastLyricEntryDict: {
            [i: number]: any;
        };
        lastChordEntryDict: {
            [i: number]: any;
        };
    };
    calculateMeasureWidthFromStaffEntries(measuresVertical: GraphicalMeasure[], oldMinimumStaffEntriesWidth: number): number;
    private computeContainerOverflows;
    protected createGraphicalTie(tie: Tie, startGse: GraphicalStaffEntry, endGse: GraphicalStaffEntry, startNote: GraphicalNote, endNote: GraphicalNote): GraphicalTie;
    protected updateStaffLineBorders(staffLine: StaffLine): void;
    protected graphicalMeasureCreatedCalculations(measure: GraphicalMeasure): void;
    /**
     * Can be used to calculate articulations, stem directions, helper(ledger) lines, and overlapping note x-displacement.
     * Is Excecuted per voice entry of a staff entry.
     * After that layoutStaffEntry is called.
     * @param voiceEntry
     * @param graphicalNotes
     * @param graphicalStaffEntry
     * @param hasPitchedNote
     */
    protected layoutVoiceEntry(voiceEntry: VoiceEntry, graphicalNotes: GraphicalNote[], graphicalStaffEntry: GraphicalStaffEntry, hasPitchedNote: boolean): void;
    /**
     * Do all layout calculations that have to be done per staff entry, like dots, ornaments, arpeggios....
     * This method is called after the voice entries are handled by layoutVoiceEntry().
     * @param graphicalStaffEntry
     */
    protected layoutStaffEntry(graphicalStaffEntry: GraphicalStaffEntry): void;
    /**
     * Is called at the begin of the method for creating the vertically aligned staff measures belonging to one source measure.
     */
    protected initGraphicalMeasuresCreation(): void;
    /**
     * add here all given articulations to the VexFlowGraphicalStaffEntry and prepare them for rendering.
     * @param articulations
     * @param voiceEntry
     * @param graphicalStaffEntry
     */
    protected layoutArticulationMarks(articulations: Articulation[], voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry): void;
    /**
     * Calculate the shape (Bezier curve) for this tie.
     * @param tie
     * @param tieIsAtSystemBreak
     * @param isTab Whether this tie is for a tab note (guitar tabulature)
     */
    protected layoutGraphicalTie(tie: GraphicalTie, tieIsAtSystemBreak: boolean, isTab: boolean): void;
    /**
     * Creates a Vexflow tie in a standard staff, curved in the given direction.
     * @param notes The notes of the tie (or of the part of a tie across a system break), see VF.StaveTie.
     * @param direction The direction, e.g. from the XML. Without one, Vexflow takes it from the stem direction of the notes.
     * @returns The Vexflow tie.
     */
    private createStaveTie;
    protected calculateDynamicExpressionsForMultiExpression(multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /**
     * Calculates a wedge that starts before the drawing range (EngravingRules.MinMeasureToDrawIndex, e.g. drawFromMeasureNumber) and
     * ends in it or after it: from the start of the first measure drawn on, like after a system break (see
     * MusicSheetCalculator.calculateGraphicalContinuousDynamic()). The dynamic at its start isn't drawn.
     * @param wedge the wedge (not a verbal one like "cresc.")
     * @param firstMeasureIndex the index of the first measure drawn
     * @param staffIndex the index of the wedge's staff
     */
    protected calculateWedgeStartingBeforeDrawingRange(wedge: ContinuousDynamicExpression, firstMeasureIndex: number, staffIndex: number): void;
    protected createMetronomeMark(metronomeExpression: InstantaneousTempoExpression): void;
    /** Measures the drawn mark and its clearance from the notation, before tempo text takes its space. */
    private prepareMetronomePlacement;
    protected layoutMetronomeMarks(): void;
    /** Convert MetronomeNoteGroup data into the format expected by VexFlow's StaveTempo.drawNoteEquation(). */
    private buildNoteEquationForVexFlow;
    protected calculateRehearsalMark(measure: SourceMeasure): void;
    /** Returns the leftmost (smallest x) Above-placed chord symbol container in the measure, or undefined if there is none.
     *  The rehearsal mark sits at the measure start, so this is the chord it can collide with (see calculateRehearsalMark). */
    private getFirstChordSymbolAbove;
    /**
     * Calculate a single OctaveShift for a [[MultiExpression]].
     * @param sourceMeasure
     * @param multiExpression
     * @param measureIndex
     * @param staffIndex
     */
    protected calculateSingleOctaveShift(sourceMeasure: SourceMeasure, multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    private hasVexFlowNote;
    /** Instruction-only entries carry key/clef changes but cannot anchor a line or bracket. */
    private findBoundaryNoteEntry;
    /** Finds the last staffline measure with a note that can anchor an expression. */
    protected findLastStafflineMeasure(staffline: StaffLine): GraphicalMeasure;
    /** Finds the first staffline measure with a note that can anchor an expression. */
    protected findFirstStafflineMeasure(staffline: StaffLine): GraphicalMeasure;
    protected calculateSinglePedal(sourceMeasure: SourceMeasure, multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    protected calculateSingleWavyLine(sourceMeasure: SourceMeasure, multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    private calculateWavyLineSkyBottomLine;
    /**
     * Raises the trill mark above a voice entry's note to a wavy line raised over what is in its way (see
     * calculateWavyLineSkyBottomLine()), as if the text position of its stave was there: its bottom to y, unless it is higher.
     * By its y_shift, which VexFlowMusicSheetCalculator.calculateMeasureXLayout() resets for every render.
     * @param y the y of the wavy line's bottom, in the stave's coordinates (pixels)
     */
    private raiseTrillMark;
    /**
     * Places a pedal below its staff line: at the height of the other pedals of the staff line (they are drawn at one height,
     * the lowest one any of them needs), and below what is above its signs (Ped., *) and its line, e.g. a beam below the staff.
     * The bottom line gets the space of the pedals only after all of them are placed, see updateBottomLinesWithPedals(),
     * so a pedal isn't pushed below the space of a pedal placed before it, e.g. one released where it is pressed.
     */
    private calculatePedalSkyBottomLine;
    /**
     * Returns the x ranges (relative to the staff line, as while the layout is calculated) in which a pedal is drawn:
     * its Ped. and * signs, if it draws them (" " as their text: the pedal goes on from or into another system),
     * and its line (with hooks), see VexFlow's PedalMarking.
     * @param vfPedal The pedal
     * @param pedalMarking Its VexFlow pedal marking, see VexFlowPedal.getPedalMarking()
     * @returns the [start, stop] ranges of the signs, and of the line, undefined for the sign style
     */
    private getPedalXRanges;
    /**
     * Updates the bottom lines with the space the pedals take, once all of them are placed (see calculatePedalSkyBottomLine()):
     * under a sign down to a unit below it, under a line down to the line.
     */
    protected updateBottomLinesWithPedals(): void;
    private calculateOctaveShiftSkyBottomLine;
    /**
     * Calculate all the textual and symbolic [[RepetitionInstruction]]s (e.g. dal segno) for a single [[SourceMeasure]].
     * @param repetitionInstruction
     * @param measureIndex
     */
    protected calculateWordRepetitionInstruction(repetitionInstruction: RepetitionInstruction, measureIndex: number): void;
    /** The repetition instruction boxes already placed per staff line, for their mutual collision checks.
     *  (a WeakMap, so that the entries of a previous render's staff lines don't linger) */
    private placedWordRepetitionBoxes;
    /**
     * Shifts a repetition instruction (VF.Repetition, e.g. Coda sign or "D.S. al Fine" text) above
     * other objects in its range, e.g. chord symbols, which are calculated before the repetition
     * instructions, or previously placed repetition instructions (see #1689).
     * Shifted instructions reserve their space in the skyline, so that the staffline borders account for them.
     * The horizontal and default vertical position replicate the drawing code
     * in VexFlowPatch/src/staverepetition.js (drawSymbolText() etc).
     * @param measure the (uppermost) measure the repetition instruction was added to
     * @param repetition the VexFlow repetition (stave modifier) to place, created by addWordRepetition()
     */
    protected placeWordRepetitionInSkyline(measure: VexFlowMeasure, repetition: VF.Repetition): void;
    protected calculateSkyBottomLines(): void;
    /** Compute (not reuse) the sky/bottom lines for the given staff lines: geometric, or the batched /
     *  per-staff-line path. This is the original calculateSkyBottomLines body, extracted so the lazy reuse
     *  path can feed it just the staff lines that actually need computing.
     *  lastMeasureFormats: for the geometric calculation, see SkyBottomLineCalculator.calculateLines(). */
    private computeSkyBottomLinesFor;
    /**
     * Re-adjust the x positioning of expressions. Update the skyline afterwards
     */
    protected calculateExpressionAlignements(): void;
    /**
     * Check if the tied graphical note belongs to any beams or tuplets and react accordingly.
     * @param tiedGraphicalNote
     * @param beams
     * @param activeClef
     * @param octaveShiftValue
     * @param graphicalStaffEntry
     * @param duration
     * @param openTie
     * @param isLastTieNote
     */
    protected handleTiedGraphicalNote(tiedGraphicalNote: GraphicalNote, beams: Beam[], activeClef: ClefInstruction, octaveShiftValue: OctaveEnum, graphicalStaffEntry: GraphicalStaffEntry, duration: Fraction, openTie: Tie, isLastTieNote: boolean): void;
    /**
     * Is called if a note is part of a beam.
     * @param graphicalNote
     * @param beam
     * @param openBeams a list of all currently open beams
     */
    protected handleBeam(graphicalNote: GraphicalNote, beam: Beam, openBeams: Beam[]): void;
    protected handleVoiceEntryLyrics(voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry, lyricWords: LyricWord[], onlyNewVerses?: boolean): void;
    protected handleVoiceEntryOrnaments(ornamentContainer: OrnamentContainer, voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry): void;
    /**
     * Add articulations to the given vexflow staff entry.
     * @param articulations
     * @param voiceEntry
     * @param graphicalStaffEntry
     */
    protected handleVoiceEntryArticulations(articulations: Articulation[], voiceEntry: VoiceEntry, staffEntry: GraphicalStaffEntry): void;
    /**
     * Add technical instructions to the given vexflow staff entry.
     * @param technicalInstructions
     * @param voiceEntry
     * @param staffEntry
     */
    protected handleVoiceEntryTechnicalInstructions(technicalInstructions: TechnicalInstruction[], voiceEntry: VoiceEntry, staffEntry: GraphicalStaffEntry): void;
    /**
     * Is called if a note is part of a tuplet.
     * @param graphicalNote
     * @param tuplet
     * @param openTuplets a list of all currently open tuplets
     */
    protected handleTuplet(graphicalNote: GraphicalNote, tuplet: Tuplet, openTuplets: Tuplet[]): void;
    /**
     * Find the Index of the item of the array of all VexFlow Slurs that holds a specified slur
     * @param gSlurs
     * @param slur
     */
    findIndexGraphicalSlurFromSlur(gSlurs: GraphicalSlur[], slur: Slur): number;
    indexOfGraphicalGlissFromGliss(gGlissandi: GraphicalGlissando[], glissando: Glissando): number;
    /** Returns whether a repeat sign replaces the note's graphical measure. */
    private measureRepeatHidesNote;
    /** Whether the note belongs to a hidden voice of a shown instrument (Voice.isHiddenInShownInstrument()), which isn't drawn:
     *  then neither is a slur or glissando from or to it. */
    private isInHiddenVoice;
    protected calculateSlurs(): void;
    calculateGlissandi(): void;
}

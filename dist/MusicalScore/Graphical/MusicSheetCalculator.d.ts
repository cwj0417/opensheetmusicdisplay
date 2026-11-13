import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
import { StaffLine } from "./StaffLine";
import { GraphicalMusicSheet } from "./GraphicalMusicSheet";
import { EngravingRules } from "./EngravingRules";
import { Tie } from "../VoiceData/Tie";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { Note } from "../VoiceData/Note";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { ClefInstruction } from "../VoiceData/Instructions/ClefInstruction";
import { LyricWord } from "../VoiceData/Lyrics/LyricsWord";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
import { GraphicalMusicPage } from "./GraphicalMusicPage";
import { GraphicalNote } from "./GraphicalNote";
import { Beam } from "../VoiceData/Beam";
import { OctaveEnum } from "../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { VoiceEntry } from "../VoiceData/VoiceEntry";
import { OrnamentContainer } from "../VoiceData/OrnamentContainer";
import { Articulation } from "../VoiceData/Articulation";
import { Tuplet } from "../VoiceData/Tuplet";
import { MusicSystem } from "./MusicSystem";
import { GraphicalTie } from "./GraphicalTie";
import { RepetitionInstruction } from "../VoiceData/Instructions/RepetitionInstruction";
import { MultiExpression } from "../VoiceData/Expressions/MultiExpression";
import { StaffEntryLink } from "../VoiceData/StaffEntryLink";
import { MultiTempoExpression } from "../VoiceData/Expressions/MultiTempoExpression";
import { Repetition } from "../MusicSource/Repetition";
import { PointF2D } from "../../Common/DataObjects/PointF2D";
import { SourceStaffEntry } from "../VoiceData/SourceStaffEntry";
import { BoundingBox } from "./BoundingBox";
import { GraphicalLabel } from "./GraphicalLabel";
import { TextAlignmentEnum } from "../../Common/Enums/TextAlignment";
import { TechnicalInstruction } from "../VoiceData/Instructions/TechnicalInstruction";
import { IGraphicalSymbolFactory } from "../Interfaces/IGraphicalSymbolFactory";
import { ITextMeasurer } from "../Interfaces/ITextMeasurer";
import { ITransposeCalculator } from "../Interfaces/ITransposeCalculator";
import { AccidentalCalculator } from "./AccidentalCalculator";
import { GraphicalLyricWord } from "./GraphicalLyricWord";
import { SkyBottomLineCalculator } from "./SkyBottomLineCalculator";
import { AbstractExpression, PlacementEnum } from "../VoiceData/Expressions/AbstractExpression";
import { InstantaneousTempoExpression } from "../VoiceData/Expressions/InstantaneousTempoExpression";
import { FontStyles } from "../../Common/Enums/FontStyles";
import { AbstractTempoExpression } from "../VoiceData/Expressions/AbstractTempoExpression";
import { GraphicalInstantaneousDynamicExpression } from "./GraphicalInstantaneousDynamicExpression";
import { ContinuousDynamicExpression } from "../VoiceData/Expressions/ContinuousExpressions/ContinuousDynamicExpression";
import { GraphicalContinuousDynamicExpression } from "./GraphicalContinuousDynamicExpression";
import { IStafflineNoteCalculator } from "../Interfaces/IStafflineNoteCalculator";
/**
 * Class used to do all the calculations in a MusicSheet, which in the end populates a GraphicalMusicSheet.
 */
export declare abstract class MusicSheetCalculator {
    static symbolFactory: IGraphicalSymbolFactory;
    static transposeCalculator: ITransposeCalculator;
    /** @deprecated Not set anymore: each calculator has its own (the protected stafflineNoteCalculator), with its rules and the
     *  notes it tracks. A static one was shared by all OSMD instances, and kept the rules of the most recently created one,
     *  and through them its rendering, in memory.
     */
    static stafflineNoteCalculator: IStafflineNoteCalculator;
    protected static textMeasurer: ITextMeasurer;
    /** Tracks the pitches on each percussion staff, to put them on one line if there are few of them (PercussionOneLineCutoff). */
    protected stafflineNoteCalculator: IStafflineNoteCalculator;
    protected staffEntriesWithGraphicalTies: GraphicalStaffEntry[];
    protected staffEntriesWithOrnaments: GraphicalStaffEntry[];
    protected staffEntriesWithChordSymbols: GraphicalStaffEntry[];
    protected staffLinesWithLyricWords: StaffLine[];
    protected graphicalLyricWords: GraphicalLyricWord[];
    protected graphicalMusicSheet: GraphicalMusicSheet;
    protected rules: EngravingRules;
    protected musicSystems: MusicSystem[];
    /** Lazy rendering: cache of computed sky/bottom lines, keyed per staff line by its system's
     *  measure range + staff index. A growing-prefix batch re-runs the (expensive) skyline pass over the
     *  whole prefix; this lets stable interior systems reuse the lines computed in an earlier batch instead
     *  of re-measuring them. Only used when EngravingRules.LazyConsistentGraphic; cleared per lazy session. */
    protected skyBottomLineCache: Map<string, {
        sky: number[];
        bottom: number[];
    }>;
    /** The first and the last measure to draw (source measure indices, limited to the sheet) when the multiple rest measures were
     *  made, which begin and end with them, see prepareGraphicalMusicSheet() and multiRestsFitDrawRange(). */
    private multiRestsDrawRange;
    /** Whether a multiple rest measure was divided where the draw range of multiRestsDrawRange begins or ends. */
    private multiRestDividedAtDrawRange;
    private abstractNotImplementedErrorMessage;
    /** @deprecated OSMD measures texts with each instance's own measurer, EngravingRules.TextMeasurer (osmd.EngravingRules.TextMeasurer).
     *  This static one measures with default rules (e.g. DefaultFontFamily), and is only used for labels without rules.
     */
    static get TextMeasurer(): ITextMeasurer;
    static set TextMeasurer(value: ITextMeasurer);
    protected get leadSheet(): boolean;
    protected static setMeasuresMinStaffEntriesWidth(measures: GraphicalMeasure[], minimumStaffEntriesWidth: number): void;
    initialize(graphicalMusicSheet: GraphicalMusicSheet): void;
    /**
     * Build the 2D [[GraphicalMeasure]] list needed for the [[MusicSheetCalculator]].
     * Internally it creates [[GraphicalMeasure]]s, [[GraphicalStaffEntry]]'s and [[GraphicalNote]]s.
     */
    prepareGraphicalMusicSheet(): void;
    /** Whether the measure ends with a clef change (for the next measure, see InstrumentReader) in a staff that is shown. */
    private endsWithClefChangeInVisibleStaff;
    /**
     * Whether a sequence of rest measures that becomes a multiple rest measure (AutoGenerateMultipleRestMeasuresFromRestMeasures)
     * ends before the given rest measure, which can begin the next sequence.
     * A multiple rest measure only shows what its first measure begins with, and the barline and clef change its last measure
     * ends with (see MusicSystemBuilder.getEndInstructionsStaffEntry()),
     * so the sequence ends before a key change or a time signature, a rehearsal mark, and a system or page break from the XML
     * that the layout follows (see MusicSystemBuilder.buildMusicSystems()),
     * and after a double, final or heavy-heavy barline (the other barline styles are drawn like a regular one,
     * see VexFlowMeasure.addMeasureLine()) and after a clef change, which is drawn before the barline.
     * @param previousMeasure the last measure of the sequence
     */
    private multiRestSequenceEndsBefore;
    /**
     * Divides the multiple rest measure of the MusicXML (`<multiple-rest>`) beginning with the measure where the draw range begins or ends
     * inside it (see prepareGraphicalMusicSheet()): the measure at the first boundary inside it begins the rest of it, which is divided
     * again there if needed. A part of one measure is drawn as the rest measure it is.
     * @param measureIndex the first measure of the multiple rest measure
     * @param boundaries the measures before which a multiple rest measure ends: the first measure to draw, and the one after the last one
     */
    private divideMultiRestAtDrawRange;
    /**
     * Whether the multiple rest measures fit the draw range from the first to the last measure to draw (source measure indices, see
     * EngravingRules.MinMeasureToDrawIndex and MaxMeasureToDrawIndex): they begin and end with the measures to draw they were made for
     * (see prepareGraphicalMusicSheet()), so they have to be made again (osmd.render() creates the graphic again) for a draw range
     * that begins or ends inside one, or after one was divided for the previous draw range.
     */
    multiRestsFitDrawRange(firstIndex: number, lastIndex: number): boolean;
    /**
     * The main method for the Calculator.
     */
    calculate(): void;
    /** Drop the lazy sky/bottom-line reuse cache (call when starting a fresh lazy session). */
    clearSkyBottomLineCache(): void;
    /** Stable per-staff-line key for the lazy sky/bottom-line cache: the system's measure range pins the
     *  system (systems partition the measures), the staff index picks the line within it. Returns undefined
     *  for a staff line with no usable measures (so it is never cached/reused).
     *  The measures are named by their index in SourceMeasures, not their number, which can repeat (e.g. it starts again at 1 after a
     *  final barline with EngravingRules.NewPartAndSystemAfterFinalBarline: a system of the second part got the lines of the
     *  first part's system with the same measure numbers), an extra measure at the system end (a key or time signature of the
     *  next system) by the index of the measure it follows and an "x", as in its SVG group's id. */
    protected skyBottomLineCacheKey(staffLine: StaffLine, staffIndexInSystem: number): string;
    calculateXLayout(graphicalMusicSheet: GraphicalMusicSheet, maxInstrNameLabelLength: number): void;
    calculateMeasureWidthFromStaffEntries(measuresVertical: GraphicalMeasure[], oldMinimumStaffEntriesWidth: number): number;
    protected formatMeasures(): void;
    /**
     * Calculates the x layout of the staff entries within the staff measures belonging to one source measure.
     * All staff entries are x-aligned throughout all the measures.
     * @param measures - The minimum required x width of the source measure
     */
    protected calculateMeasureXLayout(measures: GraphicalMeasure[]): number;
    /**
     * Called for every source measure when generating the list of staff measures for it.
     */
    protected initGraphicalMeasuresCreation(): void;
    protected handleBeam(graphicalNote: GraphicalNote, beam: Beam, openBeams: Beam[]): void;
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
    /** Creates the graphical lyrics of the voice entry at the staff entry.
     *  @param onlyNewVerses true to leave out the verses that the staff entry has lyrics of already, e.g. for the lyrics of a hidden
     *  voice under the visible notes, see handleLyricsOfLeftOutVoices() */
    protected handleVoiceEntryLyrics(voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry, openLyricWords: LyricWord[], onlyNewVerses?: boolean): void;
    protected handleVoiceEntryOrnaments(ornamentContainer: OrnamentContainer, voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry): void;
    protected handleVoiceEntryArticulations(articulations: Articulation[], voiceEntry: VoiceEntry, staffEntry: GraphicalStaffEntry): void;
    /**
     * Adds a technical instruction at the given staff entry.
     * @param technicalInstructions
     * @param voiceEntry
     * @param staffEntry
     */
    protected handleVoiceEntryTechnicalInstructions(technicalInstructions: TechnicalInstruction[], voiceEntry: VoiceEntry, staffEntry: GraphicalStaffEntry): void;
    protected handleTuplet(graphicalNote: GraphicalNote, tuplet: Tuplet, openTuplets: Tuplet[]): void;
    protected layoutVoiceEntry(voiceEntry: VoiceEntry, graphicalNotes: GraphicalNote[], graphicalStaffEntry: GraphicalStaffEntry, hasPitchedNote: boolean): void;
    protected layoutStaffEntry(graphicalStaffEntry: GraphicalStaffEntry): void;
    protected createGraphicalTie(tie: Tie, startGse: GraphicalStaffEntry, endGse: GraphicalStaffEntry, startNote: GraphicalNote, endNote: GraphicalNote): GraphicalTie;
    protected updateStaffLineBorders(staffLine: StaffLine): void;
    /**
     * Iterate through all Measures and calculates the MeasureNumberLabels.
     * @param musicSystem
     */
    protected calculateMeasureNumberPlacement(musicSystem: MusicSystem): void;
    private calculateSingleMeasureNumberPlacement;
    private calculateMeasureNumberSkyline;
    /**
     * Calculate the shape (Bézier curve) for this tie.
     * @param tie
     * @param tieIsAtSystemBreak
     */
    protected layoutGraphicalTie(tie: GraphicalTie, tieIsAtSystemBreak: boolean, isTab: boolean): void;
    /**
     * Calculate the Lyrics YPositions for a single [[StaffLine]].
     * @param staffLine
     * @param lyricVersesNumber
     */
    protected calculateSingleStaffLineLyricsPosition(staffLine: StaffLine, lyricVersesNumber: string[]): GraphicalStaffEntry[];
    /**
     * calculates the dashes of lyric words and the extending underscore lines of syllables sung on more than one note.
     * @param lyricsStaffEntries
     */
    protected calculateLyricsExtendsAndDashes(lyricsStaffEntries: GraphicalStaffEntry[]): void;
    /**
     * Calculate a single OctaveShift for a [[MultiExpression]].
     * @param sourceMeasure
     * @param multiExpression
     * @param measureIndex
     * @param staffIndex
     */
    protected calculateSingleOctaveShift(sourceMeasure: SourceMeasure, multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /**
     * Calculate a single Pedal for a [[MultiExpression]].
     * @param sourceMeasure
     * @param multiExpression
     * @param measureIndex
     * @param staffIndex
     */
    protected abstract calculateSinglePedal(sourceMeasure: SourceMeasure, multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /**
     * Updates the bottom lines with the space the pedals take, after all of them are placed by calculateSinglePedal().
     */
    protected abstract updateBottomLinesWithPedals(): void;
    /**
     * Calculate a single Wavy Line for a [[MultiExpression]].
     * @param sourceMeasure
     * @param multiExpression
     * @param measureIndex
     * @param staffIndex
     */
    protected abstract calculateSingleWavyLine(sourceMeasure: SourceMeasure, multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /**
     * Calculate all the textual [[RepetitionInstruction]]s (e.g. dal segno) for a single [[SourceMeasure]].
     * @param repetitionInstruction
     * @param measureIndex
     */
    protected calculateWordRepetitionInstruction(repetitionInstruction: RepetitionInstruction, measureIndex: number): void;
    /**
     * Calculate all the Mood and Unknown Expressions for a single [[MultiExpression]]: its words, drawn together in one label.
     * A verbal crescendo or diminuendo at the same position (e.g. "cresc.") is not part of the label: it's drawn as a dynamic
     * of its own (see calculateDynamicExpressions()).
     * @param multiExpression
     * @param measureIndex
     * @param staffIndex
     */
    protected calculateMoodAndUnknownExpression(multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /**
     * Words and an instantaneous dynamic of the same staff, placement and time are one phrase, engraved on one line, e.g.
     * "più f" or "p dolce": the words go on the dynamic's line, next to it, in the order of the file: the order of the
     * `<direction-type>`s in a `<direction>`, which MusicXML defines as their visual order, or of two `<direction>`s.
     * Before, the words were placed at the bottom (sky) line, which the dynamic had raised there, and went under (over) it,
     * e.g. "f" with "piu" below it (#1913).
     * The dynamic stays at its note. Words before the dynamic reach to the left of it, also across the barline (Gould,
     * Behind Bars, p. 103), words after it to the right. Where the notes, slurs etc. of the measure reach into the words
     * on that line, the words and the dynamic move away from the staff together.
     * The words keep the current placement (under or over the dynamic) where there's no room on the line: at the start of
     * the staff or beyond its end, where the words would run into another expression (a dynamic, wedge or words placed
     * before them), and where the move away from the staff would take the dynamic off the line of words placed beside it
     * before (a second words at the dynamic). Words that the file puts more than a staff space from the dynamic
     * (default-y and relative-y, e.g. a fingering written as words under the dynamic) and words of several lines stay on
     * their own line.
     * @param multiExpression the words' MultiExpression
     * @param measure the words' measure on staffLine
     * @param text the text of the words
     * @param words the first words' expression (its position in the file)
     * @returns the words' label, positioned, or undefined if the words aren't placed beside a dynamic
     */
    protected placeWordsBesideSameTimeDynamic(multiExpression: MultiExpression, staffLine: StaffLine, measure: GraphicalMeasure, text: string, style: FontStyles, placement: PlacementEnum, fontHeight: number, words: AbstractExpression): GraphicalLabel;
    /** The instantaneous dynamic drawn on staffLine with the given placement at the time of multiExpression (in its measure),
     *  or undefined. */
    private sameTimeDynamic;
    /** Whether the words come before the dynamic in the file: the reader adds the MultiExpressions of a staff to
     *  SourceMeasure.StaffLinkedExpressions in the order of the file, and a direction's words and dynamic go into
     *  MultiExpressions of their own (see ExpressionReader.createNewMultiExpressionIfNeeded()). Undefined if the two
     *  aren't in the same staff's list. */
    private wordsBeforeDynamicInFile;
    /** Where the baseline of a label's first line of text is, relative to the label's position: the drawer puts the text's
     *  top at the position, shifted up by the text's height or half of it for a bottom or center alignment (see
     *  MusicSheetDrawer.drawLabel()), and draws the text with its baseline a font height below its top. */
    static labelBaselineOffset(label: GraphicalLabel): number;
    /** Whether rect [left, right, top, bottom] (relative to staffLine) is clear of the dynamics, wedges and words placed on
     *  staffLine so far, except the given expression. */
    private clearOfExpressions;
    /**
     * Delete all Objects that must be recalculated.
     * If graphicalMusicSheet.reCalculate has been called, then this method will be called to reset or remove all flexible
     * graphical music symbols (e.g. Ornaments, Lyrics, Slurs) graphicalMusicSheet will have MusicPages, they will have MusicSystems etc...
     */
    protected clearRecreatedObjects(): void;
    /**
     * This method handles a [[StaffEntryLink]].
     * @param graphicalStaffEntry
     * @param staffEntryLinks
     */
    protected handleStaffEntryLink(graphicalStaffEntry: GraphicalStaffEntry, staffEntryLinks: StaffEntryLink[]): void;
    /**
     * Store the newly computed [[Measure]]s in newly created [[MusicSystem]]s.
     */
    protected calculateMusicSystems(): void;
    protected calculateMarkedAreas(): void;
    protected calculateComments(): void;
    protected calculateChordSymbols(): void;
    /**
     * Sets the x positions of the chord symbols of a measure (relative to their parent bounding boxes), before their y positions:
     * a chord symbol not over a note goes from its staff entry (which has no x position without notes) to the measure,
     * at an x proportional to its timestamp in the measure, and a chord symbol over a whole measure rest after the begin instructions.
     * @param measure The measure whose chord symbols to position.
     * @param measureStafflineIndex The index of the measure in its staffline, to find the measures of the other staves in musicSystem.
     * @param musicSystem The system of the measure: chord symbols without a staff entry x position take the x position
     *   of a staff entry with the same timestamp in the other staves.
     */
    protected calculateChordSymbolsXPositions(measure: GraphicalMeasure, measureStafflineIndex: number, musicSystem: MusicSystem): void;
    /**
     * Returns the highest (minimum) skyline and lowest (maximum) bottom line value under the chord symbols of the given staff entries,
     * where they are drawn (see calculateChordSymbolsXPositions(), called before), to place them at one y position.
     * @param staffEntries The staff entries whose chord symbols to align, e.g. of a staffline or measure (ChordSymbolYAlignmentScope).
     * @param sbc The sky and bottom line calculator of the staffline of the staff entries.
     * @returns The minimum skyline value under chord symbols placed above, and the maximum bottom line value under chord symbols
     *   placed below (Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER if there are none).
     */
    protected calculateAlignedChordSymbolsOffset(staffEntries: GraphicalStaffEntry[], sbc: SkyBottomLineCalculator): {
        minOffset: number;
        maxOffset: number;
    };
    /**
     * Do layout on staff measures which only consist of a full rest.
     * @param rest
     * @param gse
     * @param measure
     */
    protected layoutMeasureWithWholeRest(rest: GraphicalNote, gse: GraphicalStaffEntry, measure: GraphicalMeasure): void;
    protected layoutBeams(staffEntry: GraphicalStaffEntry): void;
    protected layoutArticulationMarks(articulations: Articulation[], voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry): void;
    protected layoutOrnament(ornaments: OrnamentContainer, voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry): void;
    protected calculateRestNotePlacementWithinGraphicalBeam(graphicalStaffEntry: GraphicalStaffEntry, restNote: GraphicalNote, previousNote: GraphicalNote, nextStaffEntry: GraphicalStaffEntry, nextNote: GraphicalNote): void;
    protected calculateTupletNumbers(): void;
    protected calculateSlurs(): void;
    protected calculateGlissandi(): void;
    protected calculateDynamicExpressionsForMultiExpression(multiExpression: MultiExpression, measureIndex: number, staffIndex: number): void;
    /** Calculates a wedge that starts before the drawing range and ends in it or after it, see calculateWedgesStartingBeforeDrawingRange(). */
    protected calculateWedgeStartingBeforeDrawingRange(wedge: ContinuousDynamicExpression, firstMeasureIndex: number, staffIndex: number): void;
    /**
     * This method calculates the RelativePosition of a single verbal GraphicalContinuousDynamic.
     * @param graphicalContinuousDynamic Graphical continous dynamic to be calculated
     * @param startPosInStaffline Starting point in staff line
     */
    protected calculateGraphicalVerbalContinuousDynamic(graphicalContinuousDynamic: GraphicalContinuousDynamicExpression, startPosInStaffline: PointF2D): void;
    /**
     * This method calculates the RelativePosition of a single GraphicalContinuousDynamic.
     * @param graphicalContinuousDynamic Graphical continous dynamic to be calculated
     * @param startPosInStaffline Starting point in staff line
     */
    calculateGraphicalContinuousDynamic(graphicalContinuousDynamic: GraphicalContinuousDynamicExpression, startPosInStaffline: PointF2D): void;
    /**
     * Where a wedge that goes on from the previous system starts in the given staffline (its part after a system break): over the
     * end of the clef, key and time signature at the staffline's start.
     * @param staffLine the staffline
     * @returns the x relative to the staffline
     */
    private getWedgeStartAfterSystemBreak;
    /**
     * This method calculates the RelativePosition of a single GraphicalInstantaneousDynamicExpression.
     * @param graphicalInstantaneousDynamic Dynamic expression to be calculated
     * @param startPosInStaffline Starting point in staff line
     */
    protected calculateGraphicalInstantaneousDynamicExpression(graphicalInstantaneousDynamic: GraphicalInstantaneousDynamicExpression, startPosInStaffline: PointF2D, timestamp: Fraction): void;
    protected calcGraphicalRepetitionEndingsRecursively(repetition: Repetition): void;
    /**
     * Calculate a single GraphicalRepetition.
     * @param start
     * @param end
     * @param numberText
     * @param offset
     * @param leftOpen
     * @param rightOpen
     */
    protected layoutSingleRepetitionEnding(start: GraphicalMeasure, end: GraphicalMeasure, numberText: string, offset: number, leftOpen: boolean, rightOpen: boolean): void;
    /** Creates the label of an expression's text (words, a tempo text ...) with its margins, not yet positioned: for
     *  calculateLabel(), which places it by the sky/bottom line, and placeWordsBesideSameTimeDynamic(). */
    protected createExpressionLabel(staffLine: StaffLine, combinedString: string, style: FontStyles, placement: PlacementEnum, fontHeight: number, textAlignment?: TextAlignmentEnum): GraphicalLabel;
    protected calculateLabel(staffLine: StaffLine, relative: PointF2D, combinedString: string, style: FontStyles, placement: PlacementEnum, fontHeight: number, textAlignment?: TextAlignmentEnum, yPadding?: number): GraphicalLabel;
    protected calculateTempoExpressionsForMultiTempoExpression(sourceMeasure: SourceMeasure, multiTempoExpression: MultiTempoExpression, measureIndex: number): void;
    /** Whether tempo text has already been placed at this position, typically from another part. */
    protected isTempoMarkingAlreadyRendered(staffLine: StaffLine, tempoExpression: AbstractTempoExpression, absoluteTimestamp: Fraction): boolean;
    /** Whether two metronome marks print the same: note equations by their notes rather than their playback tempo,
     *  other marks by beat unit and bpm. */
    protected isSameMetronomeMark(first: InstantaneousTempoExpression, second: InstantaneousTempoExpression): boolean;
    private isSameMetronomeNoteGroup;
    protected createMetronomeMark(metronomeExpression: InstantaneousTempoExpression): void;
    protected layoutMetronomeMarks(): void;
    protected graphicalMeasureCreatedCalculations(measure: GraphicalMeasure): void;
    protected clearSystemsAndMeasures(): void;
    protected handleVoiceEntry(voiceEntry: VoiceEntry, graphicalStaffEntry: GraphicalStaffEntry, accidentalCalculator: AccidentalCalculator, openLyricWords: LyricWord[], activeClef: ClefInstruction, openTuplets: Tuplet[], openBeams: Beam[], octaveShiftValue: OctaveEnum, staffIndex: number, linkedNotes?: Note[], sourceStaffEntry?: SourceStaffEntry): OctaveEnum;
    protected resetYPositionForLeadSheet(psi: BoundingBox): void;
    protected layoutVoiceEntries(graphicalStaffEntry: GraphicalStaffEntry, staffIndex: number): void;
    protected maxInstrNameLabelLength(): number;
    protected calculateSheetLabelBoundingBoxes(): void;
    private calculateFirstPageCreditWordLabels;
    private wrapFirstPageCreditWords;
    protected checkMeasuresForWholeRestNotes(): void;
    protected optimizeRestNotePlacement(graphicalStaffEntry: GraphicalStaffEntry, measure: GraphicalMeasure): void;
    protected getRelativePositionInStaffLineFromTimestamp(timestamp: Fraction, verticalIndex: number, staffLine: StaffLine, multiStaffInstrument: boolean, firstVisibleMeasureRelativeX?: number, useLeftStaffEntryBorder?: boolean): PointF2D;
    protected getRelativeXPositionFromTimestamp(timestamp: Fraction): number;
    protected calculatePageLabels(page: GraphicalMusicPage): void;
    /** Subtitle position shared by drawing and first-page credit clearance. */
    private subtitleRelativeY;
    protected createGraphicalTies(): void;
    /**
     * Creates the graphical ties of a tie from the given note onwards, one from each note to the next.
     * @param tie The tie.
     * @param startGraphicalStaffEntry The staff entry of the note.
     * @param staffIndex The index of the staff.
     * @param measureIndex The index of the measure.
     * @param startNoteIndex The index of the note in tie.Notes. The graphical ties before it were created with the earlier notes
     *   (createGraphicalTies() calls this for each note of a tie but the last), and would be drawn twice if created again.
     */
    private handleTie;
    private setTieDirections;
    private createAccidentalCalculators;
    private calculateVerticalContainersList;
    private setIndicesToVerticalGraphicalContainers;
    private createGraphicalMeasuresForSourceMeasure;
    /**
     * Returns the octave shift active at the given timestamp in a staff: the measure's open one (started in an earlier measure)
     * if the timestamp lies within it, otherwise one of the measure's own octave shifts, or undefined if none is active.
     */
    private getActiveOctaveShift;
    private keyForGraphicalMeasure;
    private createGraphicalMeasure;
    /** Makes a clef change at the end of the measure (for the next measure) the staff's active clef. */
    private updateActiveClefAtMeasureEnd;
    private checkNoteForAccidental;
    private handleStaffEntries;
    protected calculateSkyBottomLines(): void;
    /** Reserves skyline space for measure-repeat counts. */
    protected reserveSkylineForMeasureRepeats(): void;
    /**
     * Re-adjust the x positioning of expressions.
     */
    protected calculateExpressionAlignements(): void;
    private calculateStaffEntryArticulationMarks;
    private calculateOrnaments;
    private getFingeringPlacement;
    calculateFingerings(): void;
    private optimizeRestPlacement;
    private calculateTwoRestNotesPlacementWithCollisionDetection;
    private calculateRestNotePlacementWithCollisionDetectionFromGraphicalNote;
    private calculateTieCurves;
    private calculateLyricsPosition;
    /**
     * This method calculates the dashes within the syllables of a LyricWord
     * @param lyricEntry
     */
    private calculateSingleLyricWord;
    /**
     * This method calculates Dashes for a LyricWord.
     * @param staffLine
     * @param startX
     * @param endX
     * @param y
     */
    private calculateDashes;
    /**
     * This method calculates a single Dash for a LyricWord, positioned in the middle of the given distance.
     * @param {StaffLine} staffLine
     * @param {number} startX
     * @param {number} endX
     * @param {number} y
     */
    private calculateSingleDashForLyricWord;
    /**
     * Layouts the underscore line when a lyric entry is marked as extend
     * @param {GraphicalLyricEntry} lyricEntry
     */
    private calculateLyricExtend;
    private hasLyricsOfVerse;
    /** Whether the voice has syllables of other verses in the measure, but none of the given verse. */
    private isSungOnlyInOtherVerses;
    /** Whether the verse has a syllable in or after the given vertical container. */
    private isVerseSungFrom;
    /** Whether the voice has only rests in the staff entry. False if the voice has no notes there. */
    private voiceRestsInStaffEntry;
    /**
     * This method calculates a single underscoreLine.
     * @param staffLine
     * @param startX
     * @param end
     * @param y
     */
    private calculateSingleLyricWordWithUnderscore;
    /**
     * This method calculates two Dashes for a LyricWord, positioned at the the two ends of the given distance.
     * @param {StaffLine} staffLine
     * @param {number} startX
     * @param {number} endX
     * @param {number} y
     * @returns {number}
     */
    private calculateRightAndLeftDashesForLyricWord;
    protected dynamicExpressionMap: Map<number, BoundingBox>;
    private calculateDynamicExpressions;
    /**
     * Calculates the wedges that start before the drawing range (EngravingRules.MinMeasureToDrawIndex, e.g. drawFromMeasureNumber)
     * and end in it or after it: they are drawn from the start of its first measure, like after a system break (see
     * calculateGraphicalContinuousDynamic()). A verbal one like "cresc." is drawn at its start only, so not at all then.
     * @param firstMeasureIndex the index of the first measure drawn
     */
    private calculateWedgesStartingBeforeDrawingRange;
    private calculateOctaveShifts;
    private calculatePedals;
    private calculateWavyLines;
    private getFirstLeftNotNullStaffEntryFromContainer;
    private getFirstRightNotNullStaffEntryFromContainer;
    private calculateWordRepetitionInstructions;
    private calculateRepetitionEndings;
    private calculateTempoExpressions;
    private calculateRehearsalMarks;
    protected calculateRehearsalMark(measure: SourceMeasure): void;
    private calculateMoodAndUnknownExpressions;
    /**
     * Calculates the desired stem direction depending on the number (or type) of voices.
     * If more than one voice is there, the main voice (typically the first or upper voice) will get stem up direction.
     * The others get stem down direction.
     * @param voiceEntry the voiceEntry for which the stem direction has to be calculated
     */
    private calculateStemDirectionFromVoices;
    /** Whether a voice other than the given entry's has an entry (note or rest) in the same measure on the same staff,
     *  with onlyVisible one with a note or rest that is drawn (Note.isVisible()), e.g. not of a voice only for playback
     *  (print-object="no"). A voice left out of the layout (hidden, see isLeftOutOfLayout()) doesn't count.
     *  A voice with most of its entries of the measure on another staff doesn't count: it only crosses into this staff,
     *  e.g. the top notes of a left-hand arpeggio in the right hand's staff (Dichterliebe m.9). */
    private otherVoicePresentInMeasure;
    /** Whether a voice left out of the layout (hidden, see isLeftOutOfLayout()) has an entry in the same measure on the same staff
     *  as the given entry, so that the given entry's voice is laid out without it there, e.g. as the only voice of the staff.
     *  Like in otherVoicePresentInMeasure(), a voice with most of its entries of the measure on another staff doesn't count. */
    private leftOutVoicePresentInMeasure;
    /** Whether a voice other than the given entry's has an entry that fulfills the condition in the same measure on the same staff,
     *  except a voice with most of its entries of the measure on another staff (see otherVoicePresentInMeasure()). */
    private otherVoiceHasEntryInMeasure;
    /** Whether the notes of the voice are left out of the layout, as if they weren't there: a voice hidden in its shown instrument
     *  (Voice.isHiddenInShownInstrument()), unless EngravingRules.HiddenVoicesKeepLayout lays it out like hidden notes. */
    private isLeftOutOfLayout;
    /** Whether the entry's voice gets the stems of a secondary voice (down where other voices are), not those of the main voice
     *  (up): a linked voice (LinkedVoice, not the first voice of its staff, e.g. a hymn's alto under the soprano), unless all the
     *  voices before it on the staff are left out of the layout (see isLeftOutOfLayout()): then it's the first voice drawn there,
     *  e.g. the alto with the soprano hidden. */
    private isSecondaryVoice;
    /** The voice entries of the source staff entry to lay out: all except those of voices left out of the layout (hidden, see
     *  isLeftOutOfLayout()). Where only such voices start, none, so that the staff entry is left out too, unless it has more to
     *  draw than notes, like a chord symbol or a clef or key change: then their entries are laid out to carry it, but not drawn
     *  (Note.isVisible() is false for them), like hidden notes (print-object="no"). */
    private voiceEntriesToLayOut;
    /** Draws the lyrics of the voices that are left out of the layout at the staff entry (hidden, see voiceEntriesToLayOut()) under
     *  the visible notes that start there, for the verses that these have no lyrics of themselves: e.g. a hymn's lyrics, given with
     *  the soprano, under the alto when only the alto is shown (EngravingRules.RenderLyricsOfHiddenVoices). Where no visible note
     *  starts, the syllable is left out. */
    private handleLyricsOfLeftOutVoices;
    /** Whether the voice has more entries in the measure on other staves than on the staff with the given index. */
    private voiceMostlyOnOtherStaves;
    /** Sets a voiceEntry's stem direction to one already set in other notes in its beam, if it has one. */
    private setBeamNotesWantedStemDirections;
}

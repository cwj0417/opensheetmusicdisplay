import { StaffLine } from "./StaffLine";
import { Instrument } from "../Instrument";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { GroupSymbol, InstrumentalGroup } from "../InstrumentalGroup";
import { GraphicalMusicPage } from "./GraphicalMusicPage";
import { GraphicalLabel } from "./GraphicalLabel";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { GraphicalObject } from "./GraphicalObject";
import { EngravingRules } from "./EngravingRules";
import { SystemLinesEnum } from "./SystemLinesEnum";
import { Dictionary } from "typescript-collections";
import { GraphicalComment } from "./GraphicalComment";
import { GraphicalMarkedArea } from "./GraphicalMarkedArea";
import { SystemLine } from "./SystemLine";
import { SystemLinePosition } from "./SystemLinePosition";
/** Which labels [[MusicSystem.createMusicSystemLabel]] creates left of a system's staves. */
export declare enum SystemLabelsEnum {
    /** The part and part-group names on the first system, their abbreviations on later systems. */
    Default = 0,
    /** On the first system, the part and part-group names on two lines where that makes them narrower, e.g. "Clarinet" / "in B♭". */
    NamesOnTwoLines = 1,
    /** The part and part-group abbreviations, on the first system also for a single staff. */
    Abbreviations = 2,
    /** No labels. */
    None = 3
}
/**
 * A MusicSystem contains the [[StaffLine]]s for all instruments, until a line break
 */
export declare abstract class MusicSystem extends GraphicalObject {
    needsToBeRedrawn: boolean;
    rules: EngravingRules;
    protected parent: GraphicalMusicPage;
    protected id: number;
    protected staffLines: StaffLine[];
    protected graphicalMeasures: GraphicalMeasure[][];
    /** Dictionary of (Instruments and) labels.
     * note that the key needs to be unique, GraphicalLabel is not unique yet.
     * That is why the labels are labels.values() and not labels.keys().
     */
    protected labels: Dictionary<Instrument, GraphicalLabel>;
    protected groupLabels: Map<InstrumentalGroup, GraphicalLabel>;
    protected measureNumberLabels: GraphicalLabel[];
    protected maxLabelLength: number;
    protected objectsToRedraw: [object[], object][];
    protected instrumentBrackets: GraphicalObject[];
    protected groupBrackets: GraphicalObject[];
    protected graphicalMarkedAreas: GraphicalMarkedArea[];
    protected graphicalComments: GraphicalComment[];
    protected systemLines: SystemLine[];
    breaksPage: boolean;
    constructor(id: number);
    get Parent(): GraphicalMusicPage;
    set Parent(value: GraphicalMusicPage);
    get NextSystem(): MusicSystem;
    get StaffLines(): StaffLine[];
    set StaffLines(value: StaffLine[]);
    get GraphicalMeasures(): GraphicalMeasure[][];
    get MeasureNumberLabels(): GraphicalLabel[];
    get Labels(): GraphicalLabel[];
    get ObjectsToRedraw(): [object[], object][];
    get InstrumentBrackets(): GraphicalObject[];
    get GroupBrackets(): GraphicalObject[];
    get GraphicalMarkedAreas(): GraphicalMarkedArea[];
    get GraphicalComments(): GraphicalComment[];
    get SystemLines(): SystemLine[];
    get Id(): number;
    get MaxLabelLength(): number;
    /**
     * Create the left vertical Line connecting all staves of the [[MusicSystem]].
     * @param lineWidth
     * @param systemLabelsRightMargin
     */
    createSystemLeftLine(lineWidth: number, systemLabelsRightMargin: number, isFirstSystem: boolean): void;
    /**
     * Create the vertical Lines after the End of all [[StaffLine]]'s Measures
     * @param xPosition
     * @param lineWidth
     * @param lineType
     * @param linePosition indicates if the line belongs to start or end of measure
     * @param measureIndex the measure index within the staffline
     * @param measure
     */
    createVerticalLineForMeasure(xPosition: number, lineWidth: number, lineType: SystemLinesEnum, linePosition: SystemLinePosition, measureIndex: number, measure: GraphicalMeasure): void;
    /**
     * Set the y-Positions of all the system lines in the system and creates the graphical Lines and dots within.
     * @param rules
     */
    setYPositionsToVerticalLineObjectsAndCreateLines(rules: EngravingRules): void;
    calculateBorders(rules: EngravingRules): void;
    alignBeginInstructions(): void;
    GetLeftBorderAbsoluteXPosition(): number;
    GetRightBorderAbsoluteXPosition(): number;
    AddGraphicalMeasures(graphicalMeasures: GraphicalMeasure[]): void;
    GetSystemsFirstTimeStamp(): Fraction;
    GetSystemsLastTimeStamp(): Fraction;
    /**
     * Create an InstrumentBracket for each multiStave Instrument.
     * @param instruments
     * @param staffHeight
     */
    createInstrumentBrackets(instruments: Instrument[], staffHeight: number): void;
    /**
     * Create a GroupBracket for each [[InstrumentalGroup]] with a group symbol (MusicXML group-symbol: a group without one
     * draws nothing), and for the groups nested in it, which stand a column further left (EngravingRules.GroupBracketColumnDistance).
     * @param instrumentGroups
     * @param staffHeight
     * @param column the column of the brackets, left of the staves: 0 beside the staves, 1 for the groups nested in a bracketed
     *   group, and so on (the brackets drawn around the groups)
     */
    createGroupBrackets(instrumentGroups: InstrumentalGroup[], staffHeight: number, column: number): void;
    /**
     * The first and last staffline of a group's bracket in the system, or undefined if the group has no visible part:
     * a part-group groups whole parts, so the bracket reaches from the first staff of its first part to the last staff of its
     * last part (e.g. both staves of a piano that ends the group), among the system's stafflines (the visible staves).
     */
    private groupBracketStaffLines;
    /**
     * Create the system's labels left of its staves: the part names on the first system, the part abbreviations on later
     * systems, and the names or abbreviations of part groups. Labels created before are replaced.
     * @param instrumentLabelTextHeight
     * @param systemLabelsRightMargin
     * @param labelMarginBorderFactor
     * @param isFirstSystem
     * @param labelsType other labels than the default ones, e.g. when the part names leave the system's measures too little
     *   room (see EngravingRules.FitPartLabelsToMeasures)
     */
    createMusicSystemLabel(instrumentLabelTextHeight: number, systemLabelsRightMargin: number, labelMarginBorderFactor: number, isFirstSystem?: boolean, labelsType?: SystemLabelsEnum): void;
    /** Removes the system's part and part-group labels, also from its bounding box. */
    private removeLabels;
    /**
     * Splits a label's text onto two lines at the space that makes the wider line narrowest, e.g. "Clarinet in B♭" into
     * "Clarinet" and "in B♭". Returns the text unchanged if no split makes it narrower (one word, or several lines already).
     * @param text the text to split
     * @param label the label whose font the lines are measured in
     * @param textHeight the font height
     */
    private textOnTwoLines;
    private createGroupLabels;
    private instrumentBelongsToGroup;
    private staffLinesForGroup;
    /**
     * Set the Y-Positions for the MusicSystem's Labels.
     */
    setMusicSystemLabelsYPosition(): void;
    /**
     * Check if two "adjacent" StaffLines have BOTH a StaffEntry with a StaffEntryLink.
     * This is needed for the y-spacing algorithm.
     * @returns {boolean}
     */
    checkStaffEntriesForStaffEntryLink(): boolean;
    getBottomStaffLine(topStaffLine: StaffLine): StaffLine;
    /**
     * Here the system line is generated, which acts as the container of graphical lines and dots that will be finally rendered.
     * It holds al the logical parameters of the system line.
     * @param xPosition The x position within the system
     * @param lineWidth The total x width
     * @param lineType The line type enum
     * @param linePosition indicates if the line belongs to start or end of measure
     * @param musicSystem
     * @param topMeasure
     * @param bottomMeasure
     */
    protected createSystemLine(xPosition: number, lineWidth: number, lineType: SystemLinesEnum, linePosition: SystemLinePosition, musicSystem: MusicSystem, topMeasure: GraphicalMeasure, bottomMeasure?: GraphicalMeasure): SystemLine;
    /**
     * Create all the graphical lines and dots needed to render a system line (e.g. bold-thin-dots..).
     * @param systemLine
     */
    protected createLinesForSystemLine(systemLine: SystemLine): void;
    /**
     * Calculates the summed x-width of a possibly given Instrument Brace and/or Group Bracket(s).
     * @returns {number} the x-width
     */
    protected calcBracketsWidth(): number;
    protected createInstrumentBracket(firstStaffLine: StaffLine, lastStaffLine: StaffLine): void;
    /**
     * Creates the bracket of a part group, from the given first staffline to the last one, in the given column left of the
     * staves (see createGroupBrackets()): VexFlow's bracket, a brace, or a thin line with right-angled hooks (square) or
     * without them (line), as the group symbol says.
     */
    protected createGroupBracket(firstStaffLine: StaffLine, lastStaffLine: StaffLine, column: number, groupSymbol: GroupSymbol): void;
    /** How far left of the staves a group's bracket of the given symbol reaches in the given column, in units. */
    protected groupBracketReach(groupSymbol: GroupSymbol, column: number): number;
    /** How far left of the staves a part's brace reaches in the given column, in units. */
    protected partBraceReach(column: number): number;
    /**
     * How much further left than a part brace beside the staves the system's group brackets and the part braces inside the
     * groups reach, in units: a bracket nested in another group's bracket stands a column further left, as does the brace of
     * a multi-staff part inside a bracketed group (see createGroupBrackets()). The labels move left by as much, so they keep
     * the distance from the brackets that they keep from a part brace.
     */
    private groupBracketsReachBeyondPartBrace;
    private findFirstVisibleInstrumentInInstrumentalGroup;
    private findLastVisibleInstrumentInInstrumentalGroup;
    /**
     * Update the xPosition of the [[MusicSystem]]'s [[StaffLine]]'s due to [[Label]] positioning.
     * @param systemLabelsRightMargin
     */
    private updateMusicSystemStaffLineXPosition;
}

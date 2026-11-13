import { MusicSystem } from "../MusicSystem";
import { SystemLinesEnum } from "../SystemLinesEnum";
import { SystemLinePosition } from "../SystemLinePosition";
import { GraphicalMeasure } from "../GraphicalMeasure";
import { SystemLine } from "../SystemLine";
import { StaffLine } from "../StaffLine";
import { EngravingRules } from "../EngravingRules";
import { GroupSymbol } from "../../InstrumentalGroup";
export declare class VexFlowMusicSystem extends MusicSystem {
    constructor(id: number, rules: EngravingRules);
    calculateBorders(rules: EngravingRules): void;
    /**
     * This method creates all the graphical lines and dots needed to render a system line (e.g. bold-thin-dots..).
     * @param xPosition
     * @param lineWidth
     * @param lineType
     * @param linePosition indicates if the line belongs to start or end of measure
     * @param musicSystem
     * @param topMeasure
     * @param bottomMeasure
     */
    protected createSystemLine(xPosition: number, lineWidth: number, lineType: SystemLinesEnum, linePosition: SystemLinePosition, musicSystem: MusicSystem, topMeasure: GraphicalMeasure, bottomMeasure?: GraphicalMeasure): SystemLine;
    /**
     * creates an instrument brace for the given dimension.
     * The height and positioning can be inferred from the given staff lines.
     * @param firstStaffLine the upper StaffLine (use a cast to get the VexFlowStaffLine) of the brace to create
     * @param lastStaffLine the lower StaffLine (use a cast to get the VexFlowStaffLine) of the brace to create
     */
    protected createInstrumentBracket(firstStaffLine: StaffLine, lastStaffLine: StaffLine): void;
    /** A bracket, square bracket or line stands 5 px left of the staves, a brace 14 px (VexFlow's StaveConnector); each
     *  column a GroupBracketColumnDistance further left. */
    protected groupBracketReach(groupSymbol: GroupSymbol, column: number): number;
    protected partBraceReach(column: number): number;
    /**
     * creates an instrument group bracket for the given dimension.
     * There can be cascaded brackets (e.g. a group of 2 in a group of 4): a nested group's bracket stands in the next column
     * left of the outer group's (EngravingRules.GroupBracketColumnDistance), as does the brace of a multi-staff part inside
     * the group (a brace is the outermost symbol, Gould, Behind Bars, p. 516; MuseScore and Dorico draw it so).
     * @param firstStaffLine the upper staff line of the bracket to create
     * @param lastStaffLine the lower staff line of the bracket to create
     * @param column the column of the bracket left of the staves, 0 beside them
     * @param groupSymbol the symbol to draw: bracket, brace, square (a thin line with right-angled hooks) or line
     */
    protected createGroupBracket(firstStaffLine: StaffLine, lastStaffLine: StaffLine, column: number, groupSymbol: GroupSymbol): void;
}

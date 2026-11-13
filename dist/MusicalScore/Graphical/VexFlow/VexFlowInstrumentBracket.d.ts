import Vex from "vexflow";
import VF = Vex.Flow;
import { GraphicalObject } from "../GraphicalObject";
import { VexFlowStaffLine } from "./VexFlowStaffLine";
import { GroupSymbol } from "../../InstrumentalGroup";
/**
 * Class that defines a instrument bracket at the beginning of a line.
 */
export declare class VexFlowInstrumentBracket extends GraphicalObject {
    vexflowConnector: VF.StaveConnector;
    Visible: boolean;
    /** The symbol drawn: VexFlow's bracket, a thin line with right-angled hooks (Square) or a thin line (Line); a brace is a
     *  VexFlowInstrumentBrace. */
    Shape: GroupSymbol;
    readonly FirstStaffLine: VexFlowStaffLine;
    readonly LastStaffLine: VexFlowStaffLine;
    private column;
    constructor(firstVexFlowStaffLine: VexFlowStaffLine, lastVexFlowStaffLine: VexFlowStaffLine, column?: number);
    /**
     * The column left of the staves the bracket stands in: 0 beside the staves, 1 one EngravingRules.GroupBracketColumnDistance
     * further left (a group nested in a bracketed group, or the brace of a part inside one), and so on.
     */
    get Column(): number;
    set Column(value: number);
    /** How far left of the staves the symbol reaches in its column, in px: VexFlow draws a brace 14 px wide at 2 px from
     *  the staves, and a bracket's 3 px bar at 5 px; a square bracket and a line stand where the bar stands. */
    protected get reach(): number;
    /**
     * Render the bracket using the given backend
     * @param ctx Render Vexflow context
     */
    draw(ctx: Vex.IRenderContext): void;
    /**
     * A square bracket (a thin line with right-angled hooks reaching towards the staves, the secondary bracket of a group
     * inside a bracketed group) or a line, as in MusicXML's pictures and MuseScore: 1.5 px wide, where VexFlow's bracket bar
     * stands, from the top line of the first staff to the bottom line of the last; the hooks reach 5 px, to the system's
     * barline or the outer bracket.
     */
    private drawThinLine;
    /**
     * Adds a connector between two staves
     *
     * @param {Stave} stave1: First stave
     * @param {Stave} stave2: Second stave
     * @param {Flow.StaveConnector.type} type: Type of connector
     */
    private addConnector;
}

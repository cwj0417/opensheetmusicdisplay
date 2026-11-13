import Vex from "vexflow";
import VF = Vex.Flow;
import { GraphicalOctaveShift } from "../GraphicalOctaveShift";
import { OctaveShift } from "../../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { BoundingBox } from "../BoundingBox";
import { GraphicalStaffEntry } from "../GraphicalStaffEntry";
/**
 * The vexflow adaptation of a graphical shift.
 */
export declare class VexFlowOctaveShift extends GraphicalOctaveShift {
    /** Defines the note where the octave shift starts */
    startNote: VF.StemmableNote;
    /** Source staff, independent of a cross-staff horizontal start anchor. */
    startStave: VF.Stave;
    /** Defines the note where the octave shift ends */
    endNote: VF.StemmableNote;
    /** Top or bottom of the staffline */
    private position;
    /** Supscript is a smaller text after the regular text (e.g. va after 8) */
    private supscript;
    /** Main text element */
    private text;
    /** The stave text position the bracket is drawn at, in staff spaces like Vexflow's Stave options top_text_position (above)
     *  and bottom_text_position (below): set by the calculator from the skyline or bottom line, see getTextBracket().
     *  Undefined: the start stave's own. */
    textPosition: number;
    /**
     * Create a new vexflow ocatve shift
     * @param octaveShift the object read by the ExpressionReader
     * @param parent the bounding box of the parent
     */
    constructor(octaveShift: OctaveShift, parent: BoundingBox);
    /**
     * Set a start note using a staff entry
     * @param graphicalStaffEntry the staff entry that holds the start note
     */
    setStartNote(graphicalStaffEntry: GraphicalStaffEntry): boolean;
    /**
     * Set an end note using a staff entry.
     * @param graphicalStaffEntry the staff entry that holds the end note
     * @param maxVoiceEntryIndex when >= 0, only consider voice entries before this index
     *        (used when an octave shift stop falls between grace notes sharing the same staff entry)
     */
    setEndNote(graphicalStaffEntry: GraphicalStaffEntry, maxVoiceEntryIndex?: number): boolean;
    /**
     * Get the actual vexflow text bracket used for drawing
     */
    getTextBracket(): VF.TextBracket;
}

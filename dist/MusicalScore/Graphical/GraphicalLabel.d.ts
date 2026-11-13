import { TextAlignmentEnum } from "../../Common/Enums/TextAlignment";
import { Label } from "../Label";
import { Note } from "../VoiceData/Note";
import { BoundingBox } from "./BoundingBox";
import { Clickable } from "./Clickable";
import { EngravingRules } from "./EngravingRules";
/**
 * The graphical counterpart of a Label
 */
export declare class GraphicalLabel extends Clickable {
    private label;
    private rules;
    TextLines: {
        text: string;
        xOffset: number;
        width: number;
    }[];
    /** A reference to the Node in the SVG, if SVGBackend, otherwise undefined.
     *  Allows manipulation without re-rendering, e.g. for dynamics, lyrics, etc.
     *  For the Canvas backend, this is unfortunately not possible.
     */
    SVGNode: Node;
    /** Read-only informational variable only set once by lyrics centering algorithm. */
    CenteringXShift: number;
    ColorXML: string;
    /** The note this label was created for, if any. Set for fingerings (GraphicalStaffEntry.FingeringEntries),
     *  which are stacked in the pitch order of their notes rather than the order they were read in,
     *  so that the note a fingering belongs to can be told without re-deriving that order.
     *  Named like GraphicalNote.sourceNote, which holds the same kind of reference.
     */
    sourceNote: Note;
    /** Whether this page label is positioned from the page bottom, i.e. below the last music system, like the
     *  copyright (see MusicSheetCalculator.calculatePageLabels()), rather than from the page top like the title
     *  block (title, subtitle, composer, lyricist). While an incremental render (OpenSheetMusicDisplay.renderNext())
     *  grows the page, the last system moves down with every batch, so such a label is drawn only with the final
     *  batch, once its position is final (#1710). */
    AnchoredToPageBottom: boolean;
    /** The class naming what the label shows, which MusicSheetDrawer.drawLabel() adds to the SVG group the label is drawn
     *  into, next to vf-text, so that CSS and code can find e.g. all chord symbols (`.osmd-chord-symbol`). Prefixed osmd-
     *  (like VexFlow's vf-), so that a page's own classes, e.g. a heading's `.title`, don't reach OSMD's labels:
     *  osmd-title, osmd-subtitle, osmd-composer, osmd-lyricist, osmd-copyright, osmd-credit (other text of the first page,
     *  see EngravingRules.ReadFirstPageCreditWords), osmd-part-name (first system), osmd-part-abbreviation (later
     *  systems), osmd-part-group-name, osmd-part-group-abbreviation, osmd-measure-number, osmd-chord-symbol,
     *  osmd-fingering, osmd-lyrics, osmd-dash (between the syllables of a lyric word), osmd-dynamic (also cresc. and dim.
     *  written as words), osmd-tempo (also rit. and accel.), osmd-words (other text directions, e.g. dolce).
     *  Undefined for a label without one. The drawer names lines and curves itself (see MusicSheetDrawer.addSVGClass()).
     */
    SVGClass: string;
    /**
     * Creates a new GraphicalLabel from a Label
     * @param label  label object containing text
     * @param textHeight Height of text
     * @param alignment Alignement like left, right, top, ...
     * @param parent Parent Bounding Box where the label is attached to
     */
    constructor(label: Label, textHeight: number, alignment: TextAlignmentEnum, rules: EngravingRules, parent?: BoundingBox);
    get Label(): Label;
    toString(): string;
    /**
     * Calculate GraphicalLabel's Borders according to its Alignment
     * Create also the text-lines and their offsets here
     */
    setLabelPositionAndShapeBorders(): void;
}

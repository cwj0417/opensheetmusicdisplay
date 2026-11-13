import { MusicSheetDrawer } from "../MusicSheetDrawer";
import { RectangleF2D } from "../../../Common/DataObjects/RectangleF2D";
import { VexFlowMeasure } from "./VexFlowMeasure";
import { PointF2D } from "../../../Common/DataObjects/PointF2D";
import { GraphicalLabel } from "../GraphicalLabel";
import { MusicSystem } from "../MusicSystem";
import { GraphicalObject } from "../GraphicalObject";
import { GraphicalStaffEntry } from "../GraphicalStaffEntry";
import { VexFlowBackend } from "./VexFlowBackend";
import { StaffLine } from "../StaffLine";
import { GraphicalMeasure } from "../GraphicalMeasure";
import { GraphicalInstantaneousDynamicExpression } from "../GraphicalInstantaneousDynamicExpression";
import { VexFlowContinuousDynamicExpression } from "./VexFlowContinuousDynamicExpression";
import { DrawingParameters } from "../DrawingParameters";
import { GraphicalMusicPage } from "../GraphicalMusicPage";
import { GraphicalMusicSheet } from "../GraphicalMusicSheet";
/**
 * This is a global constant which denotes the height in pixels of the space between two lines of the stave
 * (when zoom = 1.0)
 * @type number
 */
export declare const unitInPixels: number;
export declare class VexFlowMusicSheetDrawer extends MusicSheetDrawer {
    private backend;
    private backends;
    private zoom;
    private pageIdx;
    constructor(drawingParameters?: DrawingParameters);
    get Backends(): VexFlowBackend[];
    drawSheet(graphicalMusicSheet: GraphicalMusicSheet): void;
    protected drawPage(page: GraphicalMusicPage): void;
    /** Clears what was drawn (the backends), and releases the drawn sheet and its pages, which the drawer only needs while drawing:
     *  their graphical objects reference the drawn SVG elements, so they would keep the whole rendering in memory.
     *  drawSheet() sets them again.
     */
    clear(): void;
    setZoom(zoom: number): void;
    /**
     * Converts a distance from unit to pixel space.
     * @param unitDistance the distance in units
     * @returns {number} the distance in pixels
     */
    calculatePixelDistance(unitDistance: number): number;
    protected drawStaffLine(staffLine: StaffLine): void;
    /**
     * Gets the id of the SVG group a staffline is drawn into (g.osmd-staffline), unique in the sheet's drawing: "osmd-staffline",
     * its system's index (MusicSystem.Id, counted from 0 through the pages), "-" and its staff's index in Sheet.Staves (from 0,
     * as in the measures' ids, see GraphicalMeasure.getSVGGElementId()): "osmd-staffline3-1" is the second staff of the 4th
     * system. Lazy horizontal rendering (renderNext() with RenderSingleHorizontalStaffline) draws a staffline into a group per
     * batch: the first one, which starts the staffline, has the id.
     */
    protected getStaffLineSVGGElementId(staffLine: StaffLine): string;
    private drawSlurs;
    /** Lazy horizontal rendering: whether a slur belongs in this batch's draw x-window, based on the absolute
     *  x of its start/end notes (forward-stable as the prefix grows). Returns true when not lazy-horizontal, or
     *  when the notes can't be located (don't suppress). See drawSlurs() for why we avoid the bezier points. */
    private lazyDrawsSlur;
    private drawGlissandi;
    /**
     * Lazy horizontal rendering: whether a glissando belongs in this batch's draw x-window, by the right edge of its
     * staff entries in this staffline.
     * @param gGliss the glissando (the part of it in one staffline)
     * @returns true when not lazy-horizontal, or when the glissando has no staff entries (don't suppress it)
     */
    private lazyDrawsGlissando;
    private drawGlissando;
    private drawSlur;
    protected drawMeasure(measure: VexFlowMeasure): void;
    protected drawBuzzRolls(staffEntry: GraphicalStaffEntry, newBuzzRollId: any): number;
    /** Draws the strokes ("tremolo beams") of tremolos between two notes in this measure,
     *  e.g. two alternating half notes with 3 strokes between them, often seen in orchestral string parts.
     *  (Vexflow doesn't support these tremolos, so we draw them ourselves here.)
     *  Also updates the SkyLine/BottomLine where the strokes exceed it.
     *  Not where a note isn't drawn (see Note.isVisible()): the strokes are left out with it, like those of a single-note
     *  tremolo, which Vexflow draws in the style of its notehead (transparent then).
     */
    protected drawTremolosBetweenNotes(measure: VexFlowMeasure): void;
    /** Draws the strokes between the two notes of a TremoloBetweenNotes (see drawTremolosBetweenNotes). */
    private drawTremoloBetweenTwoNotes;
    /**
     * Gets the id of an SVG element that is drawn for a measure, but outside the measure's group (see
     * GraphicalMeasure.getSVGGElement()), unique in the sheet's drawing: "osmd-", the kind of element, the measure's index in
     * Sheet.SourceMeasures, "-", its staff's index in Sheet.Staves and "-" the element's number among those of its kind in the
     * measure, all counted from 0, the indices as in the measure's own id (see GraphicalMeasure.getSVGGElementId()):
     * "osmd-trem11-1-0" is the first tremolo stroke drawn with the 12th measure of the second staff.
     * @param kind "trem" for the strokes of a tremolo between two notes (drawn with the measure of the second note), "buzz" for
     *   a buzz roll
     * @param measure the measure the element is drawn with
     * @param numberInMeasure the element's number among those of its kind in the measure, from 0, in the order they are drawn
     */
    protected getMeasureElementSVGId(kind: string, measure: GraphicalMeasure, numberInMeasure: number): string;
    /**
     * Sets the id of the SVG group a drawn element was drawn into, e.g. "osmd-trem11-1-0" for a tremolo stroke drawn with
     * DrawPath(), which would add VexFlow's prefix (vf-) to an id given to it.
     * @param node the group, undefined if nothing was drawn, e.g. with the canvas backend
     * @param id the id, unique in the sheet's drawing
     */
    protected setSVGId(node: Node, id: string): void;
    /** Draws a line in the current backend. Only usable while pages are drawn sequentially, because backend reference is updated in that process.
     *  To add your own lines after rendering, use DrawOverlayLine.
     */
    protected drawLine(start: PointF2D, stop: PointF2D, color?: string, lineWidth?: number): Node;
    /** Lets a user/developer draw an overlay line on the score. Use this instead of drawLine, which is for OSMD internally only.
     *  The MusicPage has to be specified, because each page and Vexflow backend has its own relative coordinates.
     *  (the AbsolutePosition of a GraphicalNote is relative to its backend)
     *  To get a MusicPage, use GraphicalNote.ParentMusicPage.
     */
    DrawOverlayLine(start: PointF2D, stop: PointF2D, musicPage: GraphicalMusicPage, color?: string, lineWidth?: number, id?: string): Node;
    DrawPath(inputPoints: PointF2D[], musicPage: GraphicalMusicPage, fill?: boolean, id?: string, color?: string): Node;
    protected drawSkyLine(staffline: StaffLine): void;
    protected drawBottomLine(staffline: StaffLine): void;
    /**
     * Draw a line with a width and start point in a chosen color (used for skyline/bottom line debugging) from
     * a simple array
     * @param line numeric array. 0 marks the base line. Direction given by sign. Dimensions in units
     * @param startPosition Start position in units
     * @param width Max line width in units
     * @param color Color to paint in. Default is red
     */
    private drawSampledLine;
    private drawStaffEntry;
    /**
     * Draw all lyrics to the canvas
     * @param lyricEntries Array of lyric entries to be drawn
     * @param layer Number of the layer that the lyrics should be drawn in
     */
    private drawLyrics;
    protected drawInstrumentBrace(brace: GraphicalObject, system: MusicSystem): void;
    protected drawGroupBracket(bracket: GraphicalObject, system: MusicSystem): void;
    /** Lazy horizontal rendering: whether a spanning element (octave shift, pedal, vibrato, hairpin) belongs
     *  in this batch's draw x-window. It is drawn in the batch where its END MEASURE's right edge first enters
     *  the frontier -- i.e. once its whole span is laid out and stable (same rule as the measure itself).
     *  Returns true when not lazy-horizontal, or when the end measure is unknown (don't suppress). */
    private lazyDrawsSpanToMeasure;
    protected drawOctaveShifts(staffLine: StaffLine): void;
    protected drawPedals(staffLine: StaffLine): void;
    protected drawWavyLines(staffLine: StaffLine): void;
    protected drawExpressions(staffline: StaffLine): void;
    protected drawInstantaneousDynamic(instantaneousDynamic: GraphicalInstantaneousDynamicExpression): void;
    protected drawContinuousDynamic(graphicalExpression: VexFlowContinuousDynamicExpression): void;
    /**
     * Renders a Label to the screen (e.g. Title, composer..)
     * @param graphicalLabel holds the label string, the text height in units and the font parameters
     * @param layer is the current rendering layer. There are many layers on top of each other to which can be rendered. Not needed for now.
     * @param bitmapWidth Not needed for now.
     * @param bitmapHeight Not needed for now.
     * @param heightInPixel the height of the text in screen coordinates
     * @param screenPosition the position of the lower left corner of the text in screen coordinates
     */
    protected renderLabel(graphicalLabel: GraphicalLabel, layer: number, bitmapWidth: number, bitmapHeight: number, fontHeightInPixel: number, screenPosition: PointF2D): Node;
    /**
     * Renders a rectangle with the given style to the screen.
     * It is given in screen coordinates.
     * @param rectangle the rect in screen coordinates
     * @param layer is the current rendering layer. There are many layers on top of each other to which can be rendered. Not needed for now.
     * @param styleId the style id
     * @param alpha alpha value between 0 and 1
     */
    protected renderRectangle(rectangle: RectangleF2D, layer: number, styleId: number, colorHex: string, alpha: number): Node;
    /**
     * Converts a point from unit to pixel space.
     * @param point
     * @returns {PointF2D}
     */
    protected applyScreenTransformation(point: PointF2D): PointF2D;
    /**
     * Converts a rectangle from unit to pixel space.
     * @param rectangle
     * @returns {RectangleF2D}
     */
    protected applyScreenTransformationForRect(rectangle: RectangleF2D): RectangleF2D;
}

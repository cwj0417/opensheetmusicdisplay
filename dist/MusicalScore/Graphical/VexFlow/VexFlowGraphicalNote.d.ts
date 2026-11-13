import Vex from "vexflow";
import VF = Vex.Flow;
import { ColoringOptions, GraphicalNote, VisibilityOptions } from "../GraphicalNote";
import { Note } from "../../VoiceData/Note";
import { ClefInstruction } from "../../VoiceData/Instructions/ClefInstruction";
import { Pitch } from "../../../Common/DataObjects/Pitch";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { OctaveEnum } from "../../VoiceData/Expressions/ContinuousExpressions/OctaveShift";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
import { KeyInstruction } from "../../VoiceData/Instructions/KeyInstruction";
import { EngravingRules } from "../EngravingRules";
/**
 * The VexFlow version of a [[GraphicalNote]].
 */
export declare class VexFlowGraphicalNote extends GraphicalNote {
    constructor(note: Note, parent: GraphicalVoiceEntry, activeClef: ClefInstruction, octaveShift: OctaveEnum, rules: EngravingRules, graphicalNoteLength?: Fraction);
    octaveShift: OctaveEnum;
    vfpitch: [string, string, ClefInstruction];
    vfnote: [VF.StemmableNote, number];
    vfnoteIndex: number;
    private clef;
    /**
     * Update the pitch of this note. Necessary in order to display accidentals correctly.
     * This is called by VexFlowGraphicalSymbolFactory.addGraphicalAccidental.
     * @param pitch
     */
    setAccidental(pitch: Pitch): void;
    drawPitch(pitch: Pitch): Pitch;
    Transpose(keyInstruction: KeyInstruction, activeClef: ClefInstruction, halfTones: number, octaveEnum: OctaveEnum): Pitch;
    /**
     * Set the VexFlow StaveNote corresponding to this GraphicalNote, together with its index in the chord.
     * @param note
     * @param index
     */
    setIndex(note: VF.StemmableNote, index: number): void;
    notehead(vfNote?: VF.StemmableNote): {
        line: number;
    };
    /**
     * Gets the clef for this note
     */
    Clef(): ClefInstruction;
    /**
     * Gets the id of the SVGGElement containing this note, given the SVGRenderer is used.
     * This is for low-level rendering hacks and should be used with caution.
     */
    getSVGId(): string;
    /** Toggle visibility of the note, making it and its stem and beams invisible for `false`.
     * By default, this will also hide the note's slurs, ties and glissandi, e.g. slides (see visibilityOptions).
     * (This only works with the default SVG backend, not with the Canvas backend/renderer)
     * To get a GraphicalNote from a Note, use osmd.EngravingRules.GNote(note).
     * To check whether a note is visible, e.g. after setVisible(false), use isVisible().
     */
    setVisible(visible: boolean, visibilityOptions?: VisibilityOptions): void;
    /** Whether the note is visible: false after setVisible(false), which hides its notehead (unless
     * VisibilityOptions.applyToNotehead is false), and for a note hidden in the score, e.g. by print-object="no", or of a hidden
     * voice (Voice.Visible false), see Note.isVisible().
     * Like setVisible(), this works on the drawn SVG: a new render draws the notes hidden with setVisible() visible again.
     * It's true for a note that isn't drawn at all, e.g. of a hidden instrument (Instrument.Visible false).
     */
    isVisible(): boolean;
    /**
     * Gets the SVGGElement containing this note, given the SVGRenderer is used.
     * This is for low-level rendering hacks and should be used with caution.
     */
    getSVGGElement(): SVGGElement;
    /**
     * Gets the SVG group of the measure the note is drawn in (see GraphicalMeasure.getSVGGElement()). Besides the note's group,
     * it holds the note's ledger lines, which are drawn before the group, and a beam with the stems of its notes, drawn after
     * them (see VexFlowMeasure.drawNotes()).
     */
    private getMeasureSVGGElement;
    /**
     * Gets the element the note's sheet is drawn in: the OSMD container, which holds each page's SVG in a div (see
     * SvgVexFlowBackend.initialize()), e.g. both parts of a tie across a page break.
     * @returns the container, undefined if the note isn't drawn in an SVG, e.g. with the canvas backend
     */
    private getSheetContainer;
    /**
     * Gets the first element with the given id in the scope, a part of the note's drawing, e.g. its measure's group.
     * Searched in the scope, not the document: the document doesn't contain a sheet drawn in a shadow root (e.g. by a web
     * component) or in a container that isn't attached to it, and its first element with the id can be another sheet's,
     * e.g. of a sheet drawn by another OSMD bundle on the page (each bundle's Vexflow numbers the notes it creates from 1000).
     * The id map of the document or shadow root the drawing is in answers first: when no element has the id (e.g. for a note
     * without ledger lines), and when its first element with the id is in the scope. Otherwise the scope is searched, with
     * an attribute selector: jsdom (29) finds nothing for "#id" when the root's first element with the id is outside the scope.
     * @returns the element, null if there is none, undefined without a scope (e.g. with the canvas backend)
     */
    private static getSVGElementById;
    /**
     * Gets the elements with the given id in the scope, e.g. the parts of a tie across a system break, which have the tie's id.
     * Like getSVGElementById(), the id map of the drawing's root answers when no element has the id, e.g. for a note without
     * a tie. Otherwise the scope is searched with an id selector, which browsers answer from their id maps too (Firefox searches
     * the whole scope for an attribute selector). The ids are Vexflow's, e.g. "vf-auto1234-tie", valid in a selector.
     * @returns the elements, none without a scope (e.g. with the canvas backend)
     */
    private static getSVGElementsById;
    /** Gets the SVG path element of the note's stem. */
    getStemSVG(): HTMLElement;
    /** Gets the SVG elements of the beams starting on this note: each beam's path, or with
     *  EngravingRules.SVGMergeSingleChildGroups false, each beam's group (with the path). */
    getBeamSVGs(): HTMLElement[];
    /** Gets the SVG path elements of the note's ledger lines. */
    getLedgerLineSVGs(): HTMLElement[];
    /** Gets the SVG groups of the ties starting at this note, each with the tie's curve.
     *  A tie across a system break has a group in each system (see VexFlowMeasure.addStaveTie()). */
    getTieSVGs(): HTMLElement[];
    /** Gets the SVG path elements of the note's slur curve. */
    getSlurSVGs(): HTMLElement[];
    /** Gets the SVG groups of the glissandi and slides starting at this note: each with the line, and in a TAB staff the label "sl.".
     *  A glissando across a system break has a group in each system (see VexFlowMusicSheetDrawer.drawGlissando()). */
    getGlissandoSVGs(): HTMLElement[];
    /** Gets the SVG elements of the note heads, e.g. the paths of a chord's heads (with EngravingRules.SVGMergeSingleChildGroups
     *  false: each head's group), or the fret numbers of a TAB note (and its chord). */
    getNoteheadSVGs(): HTMLElement[];
    /** Gets the SVG element of the note's flag: its path, or with EngravingRules.SVGMergeSingleChildGroups false, its group. */
    getFlagSVG(): HTMLElement;
    getVFNoteSVG(): HTMLElement;
    /** Gets the SVG elements of the note's modifiers: the groups of a stave note's modifiers (e.g. accidentals; none if the
     *  note has no modifiers), or the shapes of a TAB note's modifiers (e.g. a bend's curve, arrow and label). */
    getModifierSVGs(): HTMLElement[];
    /** Whether the note is drawn in a TAB staff, as a fret number (a Vexflow TabNote, or a GraceTabNote for a grace note). */
    private get isTabNote();
    /**
     * Gets the SVG elements a TAB note is drawn with (see TabNote.draw() in the VexFlowPatch): first a background rect and a
     * fret number (a text, or a path for an x notehead) for each position of its chord, then its modifiers, e.g. a bend.
     * A grace note is drawn with its main note, in its own group, which is skipped.
     */
    private getTabNoteSVGs;
    /** Colors the paths of a group, e.g. of the accidentals, or a single shape, e.g. a note head, a beam, a TAB note or a
     *  glissando: its fill, or its stroke if it's only a line, like the curve of a bend or the line of a slide.
     *  A group in the group keeps its colors, e.g. a grace note in its main note's modifiers (it has its own setColor()):
     *  its shapes would take a fill set on the group, as they leave out the default black (see the VexFlowPatch's SVGContext).
     *  An ornament's group in the modifiers (g.vf-ornament: its glyph and accidental marks) is colored like the modifiers. */
    private static colorShapes;
    /** Change the color of a note (without re-rendering). See ColoringOptions for options like applyToBeams etc.
     * For a TAB note, the note heads are its fret numbers, and its modifiers e.g. bends.
     * This requires the SVG backend (default, instead of canvas backend).
     */
    setColor(color: string, coloringOptions?: ColoringOptions): void;
}

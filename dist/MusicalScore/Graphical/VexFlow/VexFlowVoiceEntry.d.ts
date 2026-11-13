import Vex from "vexflow";
import VF = Vex.Flow;
import { VoiceEntry } from "../../VoiceData/VoiceEntry";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
import { GraphicalStaffEntry } from "../GraphicalStaffEntry";
import { GraphicalNote } from "../GraphicalNote";
import { EngravingRules } from "../EngravingRules";
export declare class VexFlowVoiceEntry extends GraphicalVoiceEntry {
    private mVexFlowStaveNote;
    vfGhostNotes: VF.GhostNote[];
    /** A grace note that no main note follows in its staff entry (e.g. the only note of its voice there), drawn as its own
     *  tickable of the voice. Unlike a grace note after its main note (VoiceEntry.GraceAfterMainNote), it keeps its timestamp. */
    isStandAloneGrace: boolean;
    constructor(parentVoiceEntry: VoiceEntry, parentStaffEntry: GraphicalStaffEntry, rules?: EngravingRules);
    applyBordersFromVexflow(): void;
    /** Sets the vertical borders of this voice entry to the bounding box of its Vexflow note, e.g. from the tip of an up-stem
     *  that a beam extended (see VexFlowMeasure.updateBeamedVoiceEntryBorders()) to the lowest note head. Keeps the position of
     *  the voice entry, which its notes are placed relative to (VexFlowMeasure.correctNotePositions()): the next render's
     *  calculateXPosition() puts the voice entry there again (applyBordersFromVexflow()) and calculates the bounding boxes with
     *  the notes still where this render placed them.
     *  @param staveTopY The y of the stave's top line where the note's bounding box was measured (0 in calculateXPosition()).
     */
    applyVerticalBordersFromVexflow(boundingBox: any, staveTopY?: number): void;
    set vfStaveNote(value: VF.StemmableNote);
    get vfStaveNote(): VF.StemmableNote;
    /** Sorts the notes from bottom to top like Vexflow sorts the keys of a StaveNote: by the staff line they're drawn on,
     *  and notes on the same line (e.g. G and G sharp) by pitch.
     *  Vexflow sorts only its key properties and noteheads, while the accidentals, string numbers, ties etc. of a note are added
     *  at the note's index in this array (VexFlowGraphicalNote.vfnoteIndex), and the note is placed at the notehead at that index.
     *  So in any other order they'd be drawn at another note, e.g. in a chord of G sharp and A flat, which have the same pitch,
     *  the flat at the G and the sharp at the A, and Vexflow warns "Unsorted keys in note will be sorted".
     */
    sortForVexflow(): GraphicalNote[];
    /** The staff line Vexflow draws the note on, from the note's key (VexFlowGraphicalNote.vfpitch, the drawn pitch, e.g. transposed)
     *  like in StaveNote.calculateKeyProps(), but in the treble clef: the note's clef moves all notes of a StaveNote by the same
     *  number of lines, so their order stays the same. 0 for a note without a key (a rest).
     */
    private static drawnStaffLine;
    /** Apply custom noteheads from Note.CustomNoteheadVFCode. This should happen before color(). */
    applyCustomNoteheads(): void;
    /** Whether the note is drawn although its own notehead is hidden (print-object="no"), because it shares the
     * notehead of a visible unison note in another voice and its stem is beamed. The stem emanates from the shared
     * notehead and has to reach the beam. E.g. Beethoven Moonlight Sonata 1st mvt. m.37, heads of the same shape
     * (test_unison_notehead_moonlight_sonata_measure37), and Debussy Arabesque no. 1 m.3, where the hidden eighth's
     * stem rises from a half note's head (test_unison_notehead_tuplet_arabesque_measure3). Vexflow lays the hidden
     * note's notehead out beside the visible one only next to a whole note (mergeableUnison in the VexFlowPatch
     * stavenote.js, see hiddenUnisonBaseHead in VexFlowMusicSheetCalculator.calculateMeasureXLayout()): there it has
     * to be drawn too, otherwise the beam ends on a bare stem with nothing under it.
     * The beam has to be drawn, i.e. join the note to other drawn notes (see inDrawnBeam). Hidden notes that only
     * write out a tremolo for playback, e.g. 16ths under a dotted half with tremolo strokes, are beamed among
     * themselves, and only the first of them shares the half's notehead: it was drawn as a lone 16th with flags
     * (test_unison_hidden_tremolo_playback_notes_actor_prelude_measure33). */
    private drawnAsSharedUnisonNote;
    /** Whether the Vexflow note is part of a beam that is drawn. VexFlowMeasure.finalizeBeams() creates a Vexflow beam
     * only for two or more notes, and Vexflow sets StemmableNote.beam for each of them. */
    private get inDrawnBeam();
    /** Whether the notehead of a hidden unison note (see drawnAsSharedUnisonNote) lands exactly on the head of the
     * visible note it shares, but with another shape, e.g. a filled eighth note head on an open half note head.
     * Vexflow leaves the two heads in one column on purpose where the hidden note is on the base line of its stave
     * note (see drawnAsSharedUnisonNote), and also where the visible note is another note of a chord: Vexflow only
     * compares the base line of each stave note, so it misses that unison. Drawing the hidden head there would fill
     * the visible open head, which then reads as a quarter note - e.g. Liszt's Liebestraum no. 3 m.42, an eighth
     * note run starting on the E3 of a dotted half E2-E3 chord (test_unison_notehead_over_chord_liebestraum_measure42).
     * Where the two heads have the same shape, the hidden one is inked over the visible one without changing it. */
    private overprintsSharedHeadOfOtherShape;
    /** Whether the note is hidden (print-object="no"), but drawn because of EngravingRules.RenderHiddenNotes: then it's drawn
     *  in EngravingRules.HiddenNotesColor, if set. */
    private static drawnAsHiddenNote;
    /** Whether all notes of this voice entry are hidden notes drawn because of EngravingRules.RenderHiddenNotes: then what they
     *  share is drawn in EngravingRules.HiddenNotesColor too, if set: the stem with its flags, the ledger lines (see color())
     *  and a beam that only joins such voice entries (see VexFlowMeasure.finalizeBeams()). */
    drawsOnlyHiddenNotes(): boolean;
    /** (Re-)color notes and stems by setting their Vexflow styles.
     * Could be made redundant by a Vexflow PR, but Vexflow needs more solid and permanent color methods/variables for that
     * See VexFlowConverter.StaveNote()
     * Also runs without EngravingRules.ColoringEnabled: it makes hidden notes (print-object="no") transparent, and draws the
     * other notes in the default colors, like notes without a color in the XML.
     * A beam takes the color of its stems, in VexFlowMeasure.finalizeBeams() (see EngravingRules.ColorBeams).
     */
    color(): void;
}

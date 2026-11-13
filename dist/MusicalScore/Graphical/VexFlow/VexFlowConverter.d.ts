import Vex from "vexflow";
import VF = Vex.Flow;
import { ClefEnum } from "../../VoiceData/Instructions/ClefInstruction";
import { ClefInstruction } from "../../VoiceData/Instructions/ClefInstruction";
import { Pitch } from "../../../Common/DataObjects/Pitch";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { RhythmInstruction } from "../../VoiceData/Instructions/RhythmInstruction";
import { KeyInstruction } from "../../VoiceData/Instructions/KeyInstruction";
import { AccidentalEnum } from "../../../Common/DataObjects/Pitch";
import { GraphicalNote } from "../GraphicalNote";
import { SystemLinesEnum } from "../SystemLinesEnum";
import { FontStyles } from "../../../Common/Enums/FontStyles";
import { Fonts } from "../../../Common/Enums/Fonts";
import { OutlineAndFillStyleEnum } from "../DrawingEnums";
import { SystemLinePosition } from "../SystemLinePosition";
import { GraphicalVoiceEntry } from "../GraphicalVoiceEntry";
import { OrnamentContainer } from "../../VoiceData/OrnamentContainer";
import { Notehead } from "../../VoiceData/Notehead";
import { EngravingRules } from "../EngravingRules";
import { ArpeggioType } from "../../VoiceData/Arpeggio";
/**
 * Helper class, which contains static methods which actually convert
 * from OSMD objects to VexFlow objects.
 */
export declare class VexFlowConverter {
    /**
     * Mapping from numbers of alterations on the key signature to major keys
     * @type {[alterationsNo: number]: string; }
     */
    private static majorMap;
    /**
     * Mapping from numbers of alterations on the key signature to minor keys
     * @type {[alterationsNo: number]: string; }
     */
    private static minorMap;
    /**
     * Convert a fraction to Vexflow string durations.
     * A duration like 5/16 (5 16th notes) can't be represented by a single (dotted) note,
     *   so we need to return multiple durations (e.g. for 5/16th ghost notes).
     * Currently, for a dotted quarter ghost note, we return a quarter and an eighth ghost note.
     *   We could return a dotted quarter instead, but then the code would need to distinguish between
     *   notes that can be represented as dotted notes and notes that can't, which would complicate things.
     *   We could e.g. add a parameter "allowSingleDottedNote" which makes it possible to return single dotted notes instead.
     * But currently, this is only really used for Ghost notes, so it doesn't make a difference visually.
     *   (for other uses like StaveNotes, we calculate the dots separately)
     * @param fraction a fraction representing the duration of a note
     * @returns {string[]} Vexflow note type strings (e.g. "h" = half note)
     */
    static durations(fraction: Fraction, isTuplet: boolean): string[];
    /**
     * Takes a Pitch and returns a string representing a VexFlow pitch,
     * which has the form "b/4", plus its alteration (accidental)
     * @param pitch
     * @returns {string[]}
     */
    static pitch(pitch: Pitch, isRest: boolean, clef: ClefInstruction, notehead?: Notehead, octaveOffsetGiven?: number): [string, string, ClefInstruction];
    static restToNotePitch(pitch: Pitch, clefType: ClefEnum): Pitch;
    /** returns the Vexflow code for a note head. Some are still unsupported, see Vexflow/tables.js */
    static NoteHeadCode(notehead: Notehead): string;
    static GhostNotes(frac: Fraction): VF.GhostNote[];
    /**
     * Adds an accidental to the key (note) of the given index of a VexFlow note.
     * @param inParentheses Draw the accidental in parentheses (a cautionary accidental).
     *   For an accidental made of two signs, only the one next to the notehead gets them,
     *   as VexFlow draws parentheses around a single accidental sign.
     */
    private static addAccidental;
    /**
     * Whether a rest that is moved above (or below) the notes of the other voices of its staff entry would be moved towards
     * the staff of a note's voice, i.e. past a cross-staff note from that staff. MusicXML files usually number the voices of a part
     * with several staves by staff: 1-4 on the upper staff, 5-8 on the lower one, so voices 1 and 5 are the upper voices.
     * E.g. the notes of voice 1 that reach down into the lower staff are above the lower staff's voice 5,
     * so voice 5's rest doesn't go above them, between the staves. Neither does voice 2's rest go below the notes of voice 5
     * that reach up into the upper staff.
     * @param restVoiceId the voice of the rest
     * @param noteVoiceId the voice of a note in the rest's staff entry
     * @param restAbove whether the rest is moved above the other voices' notes (upper voice), or else below them
     * @param numberOfStaves the number of staves of the part
     * @returns true if the note's voice belongs to another staff of the part, on the side the rest would be moved to
     */
    private static restMovesTowardsStaffOfVoice;
    /**
     * Convert a GraphicalVoiceEntry to a VexFlow StaveNote
     * @param gve the GraphicalVoiceEntry which can hold a note or a chord on the staff belonging to one voice
     * @returns {VF.StaveNote}
     */
    static StaveNote(gve: GraphicalVoiceEntry): VF.StaveNote;
    static generateArticulations(vfnote: VF.StemmableNote, gNote: GraphicalNote, rules: EngravingRules): void;
    /** The articulations drawn at the voice entry's note: its own, but the inverted fermatas of its staff entry go to the
     *  staff entry's last voice entry, so that they don't overlap the notes of the other voices (#1278): the fermata of a
     *  stem-up note is drawn right below a lower voice's note, not over it.
     *  The model stays as it is. Before, the fermata was added to the last voice entry's articulations (and stayed in its
     *  own voice entry's), so every further calculation, e.g. after updateGraphic(), drew it once more. */
    private static getDrawnArticulations;
    /** Whether a visible note or rest of another voice in the staff sounds during the voice entry, e.g. a half note of
     *  another voice under the second quarter of the measure. Notes and rests that aren't drawn (see Note.isVisible()),
     *  e.g. of a voice only for playback, don't count. */
    private static otherVoiceSoundsDuring;
    static generateOrnaments(vfnote: VF.StemmableNote, oContainer: OrnamentContainer): void;
    /** The VexFlow accidentals of an ornament's accidental mark, from left to right. As for notes in StaveNote(),
     *  marks without a glyph of their own are drawn as two accidentals, e.g. sharp-sharp as two sharps. */
    static ornamentAccidentals(accidental: AccidentalEnum, accidentalXml: string): string[];
    static StrokeTypeFromArpeggioType(arpeggioType: ArpeggioType): VF.Stroke.Type;
    /**
     * Convert a set of GraphicalNotes to a VexFlow StaveNote
     * @param notes form a chord on the staff
     * @returns {VF.StaveNote}
     */
    static CreateTabNote(gve: GraphicalVoiceEntry): VF.TabNote;
    /**
     * Convert a ClefInstruction to a string represention of a clef type in VexFlow.
     *
     * @param clef The OSMD object to be converted representing the clef
     * @param size The VexFlow size to be used. Can be `default` or `small`.
     * As soon as #118 is done, this parameter will be dispensable.
     * @returns    A string representation of a VexFlow clef
     * @see        https://github.com/0xfe/vexflow/blob/master/src/clef.js
     * @see        https://github.com/0xfe/vexflow/blob/master/tests/clef_tests.js
     */
    static Clef(clef: ClefInstruction, size?: string): {
        type: string;
        size: string;
        annotation: string;
    };
    /**
     * Convert a RhythmInstruction to a VexFlow TimeSignature object
     * @param rhythm
     * @returns {VF.TimeSignature}
     * @constructor
     */
    static TimeSignature(rhythm: RhythmInstruction): VF.TimeSignature;
    /**
     * Convert a KeyInstruction to a string representing in VexFlow a key
     * @param key
     * @returns {string}
     */
    static keySignature(key: KeyInstruction): string;
    /**
     * Converts a lineType to a VexFlow StaveConnector type
     * @param lineType
     * @returns {any}
     */
    static line(lineType: SystemLinesEnum, linePosition: SystemLinePosition): any;
    /**
     * Construct a string which can be used in a CSS font property
     * @param fontSize
     * @param fontStyle
     * @param font
     * @returns {string}
     */
    static font(fontSize: number, fontStyle: FontStyles, font: Fonts, rules: EngravingRules, fontFamily?: string): string;
    /**
     * Sets EngravingRules.VexFlowTextFontFamily, if given, as the family of a font that VexFlow draws a text in,
     * e.g. a rehearsal mark's. The size, weight and style stay VexFlow's.
     */
    static setVexFlowTextFontFamily(font: {
        family: string;
    }, rules: EngravingRules): void;
    /**
     * Returns the text of a tab bend that leaves the string bent by the given semitones from the unbent note (the note's bends
     * so far minus its releases, independent of the fret), in whole tones like in tablature:
     * "1/4", "1/2", "3/4", "Full" (a whole tone), "1 1/4", "1 1/2", ..., "2". Rounded to quarter tones.
     */
    private static bendText;
    /**
     * Draws the text of a bend in EngravingRules.VexFlowTextFontFamily, if given.
     * VexFlow sizes a bend by an estimate of its text width (7px per character, which fits its 10pt Arial),
     * so the bend is widened where its text is wider in that family, as VexFlow's Bend.updateWidth() would size it,
     * if the TextMeasurer can measure it (see ITextMeasurer.computeTextWidthInCssFont()).
     */
    private static setVexFlowTextFontOfBend;
    /** Like setVexFlowTextFontFamily(), for the CSS fonts like "10pt Arial" that VexFlow uses for tab fret numbers and bends. */
    static vexFlowTextCssFont(cssFont: string, rules: EngravingRules): string;
    /**
     * Converts the style into a string that VexFlow RenderContext can understand
     * as the weight of the font
     */
    static fontStyle(style: FontStyles): string;
    /**
     * Convert OutlineAndFillStyle to CSS properties
     * @param styleId
     * @returns {string}
     */
    static style(styleId: OutlineAndFillStyleEnum): string;
}

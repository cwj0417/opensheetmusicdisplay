import { Instrument } from "../Instrument";
import { VoiceEntry } from "./VoiceEntry";
/**
 * A [[Voice]] contains all the [[VoiceEntry]]s in a voice in a [[StaffLine]].
 */
export declare class Voice {
    private voiceEntries;
    private parent;
    private visible;
    private audible;
    private following;
    /**
     * The Id given in the MusicXMl file to distinguish the different voices. It is unique per instrument.
     */
    private voiceId;
    private volume;
    constructor(parent: Instrument, voiceId: number);
    get VoiceEntries(): VoiceEntry[];
    get Parent(): Instrument;
    /** Whether the voice is drawn. The notes of a hidden voice aren't drawn, and the cursor skips them. By default, the other voices
     *  are laid out as if it weren't there: their stems by pitch where they are alone now, the spacing from the visible notes only.
     *  Its lyrics are drawn under the visible notes that start at the same time on its staff, e.g. a hymn's lyrics, given with the
     *  soprano, under the alto. See EngravingRules.HiddenVoicesKeepLayout and RenderLyricsOfHiddenVoices.
     *  An instrument whose voices are all hidden is hidden (Instrument.Visible). A staff whose voices are all hidden is drawn empty,
     *  unless it's hidden too (Staff.Visible).
     *  osmd.render() applies a change without osmd.updateGraphic().
     */
    get Visible(): boolean;
    set Visible(value: boolean);
    /** Whether the voice is hidden (Visible false) in an instrument that is shown (Instrument.Visible, another voice visible):
     *  then its notes aren't drawn on the instrument's staves (see Note.isVisible()), and by default not laid out either.
     *  The voices of a hidden instrument aren't, as the instrument is left out as a whole.
     */
    isHiddenInShownInstrument(): boolean;
    get Audible(): boolean;
    set Audible(value: boolean);
    get Following(): boolean;
    set Following(value: boolean);
    get VoiceId(): number;
    get Volume(): number;
    set Volume(value: number);
}

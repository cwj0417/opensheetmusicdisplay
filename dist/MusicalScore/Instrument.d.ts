import { InstrumentalGroup } from "./InstrumentalGroup";
import { Label } from "./Label";
import { MusicSheet } from "./MusicSheet";
import { Voice } from "./VoiceData/Voice";
import { Staff } from "./VoiceData/Staff";
import { SubInstrument } from "./SubInstrument";
import { MidiInstrument } from "./VoiceData/Instructions/ClefInstruction";
export declare class Instrument extends InstrumentalGroup {
    constructor(id: number, idString: string, musicSheet: MusicSheet, parent: InstrumentalGroup);
    /** Transposition halftones for this instrument only.
     *  This is additive to osmd.Sheet.Transpose (MusicSheet).
     *  osmd.TransposeCaculator needs to be defined/created for this to take effect. (just set it with new TransposeCalculator())
     *  The next osmd.render() applies it (no need to call osmd.updateGraphic()).
     */
    Transpose: number;
    highlight: boolean;
    private voices;
    private staves;
    private nameLabel;
    private idString;
    private id;
    private hasLyrics;
    private hasChordSymbols;
    private playbackTranspose;
    private lyricVersesNumbers;
    private subInstruments;
    private partAbbreviation;
    private partAbbreviationPrintObject;
    get Voices(): Voice[];
    get Staves(): Staff[];
    get NameLabel(): Label;
    get HasLyrics(): boolean;
    set HasLyrics(value: boolean);
    get HasChordSymbols(): boolean;
    set HasChordSymbols(value: boolean);
    get LyricVersesNumbers(): string[];
    set LyricVersesNumbers(value: string[]);
    get Name(): string;
    set Name(value: string);
    get IdString(): string;
    get Id(): number;
    get MidiInstrumentId(): MidiInstrument;
    set MidiInstrumentId(value: MidiInstrument);
    get Volume(): number;
    set Volume(value: number);
    get PlaybackTranspose(): number;
    set PlaybackTranspose(value: number);
    get SubInstruments(): SubInstrument[];
    getSubInstrument(subInstrumentIdString: string): SubInstrument;
    get PartAbbreviation(): string;
    set PartAbbreviation(value: string);
    /** Whether the part abbreviation is shown: false for print-object="no" on part-abbreviation or part-abbreviation-display. */
    get PartAbbreviationPrintObject(): boolean;
    set PartAbbreviationPrintObject(value: boolean);
    /** Whether the instrument is shown: whether any of its voices is visible (Voice.Visible), like Audible.
     *  Setting it shows or hides all its voices. Of a shown instrument, the hidden voices aren't drawn, see Voice.Visible.
     */
    get Visible(): boolean;
    /** Checks that Instrument.Visible and at least one staff visible. */
    isVisible(): boolean;
    set Visible(value: boolean);
    get Audible(): boolean;
    set Audible(value: boolean);
    get Following(): boolean;
    set Following(value: boolean);
    SetVoiceAudible(voiceId: number, audible: boolean): void;
    SetVoiceFollowing(voiceId: number, following: boolean): void;
    SetStaffAudible(staffId: number, audible: boolean): void;
    SetStaffFollow(staffId: number, follow: boolean): void;
    areAllVoiceVisible(): boolean;
    createStaves(numberOfStaves: number): void;
    toString(): string;
}

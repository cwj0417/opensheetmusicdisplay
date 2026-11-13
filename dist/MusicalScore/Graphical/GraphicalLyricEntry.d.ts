import { LyricsEntry } from "../VoiceData/Lyrics/LyricsEntry";
import { GraphicalLyricWord } from "./GraphicalLyricWord";
import { GraphicalLabel } from "./GraphicalLabel";
import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
/**
 * The graphical counterpart of a [[LyricsEntry]]
 */
export declare class GraphicalLyricEntry {
    /** The verse numbers at the start of a lyric's text, with their punctuation and what else is before the first letter:
     * "1. " in "1. Si", "1.2." in "1.2.Si" (a lyric of verses 1 and 2). */
    private static readonly leadingNumber;
    private lyricsEntry;
    private graphicalLyricWord;
    private graphicalLabel;
    private graphicalStaffEntry;
    /** The relative position of the label before the first layout calculation, see resetPosition(). */
    private initialLabelRelativePosition;
    /** The width of the verse number at the start of the lyric's text, if it is to be left of the lyric, else 0.
     *  See measureLeadingNumber(). */
    private leadingNumberWidth;
    /** Whether the verse number is left of the lyric now, see moveLeadingNumberLeftOfLyric(). */
    private leadingNumberMoved;
    /** Whether the verse number is left of the lyric before each layout calculation, as the lyric starts its verse in the staff.
     *  See resetPosition(). */
    private leadingNumberMovedInitially;
    constructor(lyricsEntry: LyricsEntry, graphicalStaffEntry: GraphicalStaffEntry, lyricsHeight: number, staffHeight: number);
    /**
     * The width of the verse number at the start of the lyric's text, e.g. "1. " in "1. Si", if the number is to be left of
     * the lyric (EngravingRules.LyricsVerseNumberLeftOfLyric, for left-aligned lyrics), else 0.
     * MusicXML has no element for such a number, it is part of the lyric's text.
     */
    private measureLeadingNumber;
    /**
     * Aligns a lyric that starts its verse and whose text starts with the verse number, e.g. "1. Si", like a lyric without one:
     * the number is left of where the lyric starts, instead of the lyric being right of that by the number.
     * The label's box is the lyric without the number, so it is spaced like a lyric without one: no lyrics of its verse are
     * before it. The box's left margin reaches to the number, which keeps the number clear of what is above it.
     * Only if the other lyrics with a verse number at the note start their verses too, see numbersStartTheirVerses().
     * @param moved true to move the number left of the lyric, false to put it back at the note, with the lyric right of it
     */
    private moveLeadingNumberLeftOfLyric;
    /**
     * Moves the verse number left of the lyric if the lyric is the first of its verse in its staff line, e.g. at the start of
     * a system in a hymn that repeats the verse numbers in every system, like for the first lyric of the verse in the staff.
     * Called when the lyrics of a staff line are positioned: the systems are built after the lyrics are created and the
     * measures are spaced, so the space for the number after the note stays reserved. resetPosition() puts the number back
     * before the next layout calculation, which spaces the measures again.
     * @param isFirstOfVerseInStaffLine whether no lyric of the given lyric's verse is before it in the staff line
     */
    moveLeadingNumberLeftOfLyricInStaffLine(isFirstOfVerseInStaffLine: (lyricsEntry: LyricsEntry) => boolean): void;
    /**
     * Whether each lyric with a verse number at this lyric's note, in any voice of its staff, is the first lyric of its verse,
     * in the staff or in the staff line. The numbers of a note are moved together, so that its lyrics stay aligned, e.g. where
     * verse 1 sang the measures before ("1.2. When I was young") and goes on with "1. Sea" while verse 2 starts with "2. Sea".
     * @param isFirstOfVerse whether the given lyric is the first of its verse
     */
    private numbersStartTheirVerses;
    /** Whether no lyric of the given verse is before this lyric in its staff. */
    private isFirstOfVerseInStaff;
    /**
     * Puts the label back where it was before the first layout calculation, called before each calculation.
     * MusicSheetCalculator.calculateSingleStaffLineLyricsPosition() moves the label below the staffline, but the bounding box
     * of the staff entry is calculated from its children (including the label) before that, e.g. in
     * VexFlowStaffEntry.calculateXPosition(). Without the reset, a re-render would include the previous render's position of
     * the label there, where the first render included the initial one - e.g. after a resize, a staff entry whose lyrics were
     * lower in the previous layout kept that lower bottom border, making the page taller.
     * The verse number goes back too, see moveLeadingNumberLeftOfLyricInStaffLine(): the measures are spaced by the label's
     * width before the systems are built (VexFlowMusicSheetCalculator.calculateElongationFactor()). Without the reset, a
     * re-render (or the next batch of renderNext()) would space them with the numbers of the previous calculation's systems,
     * e.g. a lyric that started a system then would get the space of a lyric without a number, also where it is in the middle
     * of a system now.
     * The first call takes the snapshot of the initial position.
     */
    resetPosition(): void;
    /**
     * How far the label reaches below the line of its verse: a lyric with line breaks has its first line there, and its
     * further lines below. 0 for a single line. The label is placed by its bottom (below the last line).
     */
    get HeightBelowVerseLine(): number;
    /** The y of the line of the lyric's verse relative to the staff line, where the lyric's first line, its dashes and extend line are. */
    get VerseLineY(): number;
    hasDashFromLyricWord(): boolean;
    get LyricsEntry(): LyricsEntry;
    get ParentLyricWord(): GraphicalLyricWord;
    set ParentLyricWord(value: GraphicalLyricWord);
    get GraphicalLabel(): GraphicalLabel;
    set GraphicalLabel(value: GraphicalLabel);
    get StaffEntryParent(): GraphicalStaffEntry;
    set StaffEntryParent(value: GraphicalStaffEntry);
}

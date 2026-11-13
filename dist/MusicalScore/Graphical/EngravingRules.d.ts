import { PagePlacementEnum } from "./GraphicalMusicPage";
import { TextAlignmentEnum } from "../../Common/Enums/TextAlignment";
import { PlacementEnum } from "../VoiceData/Expressions/AbstractExpression";
import { AutoBeamOptions, AlignRestOption, FillEmptyMeasuresWithWholeRests, SkyBottomLineBatchCalculatorBackendType } from "../../OpenSheetMusicDisplay/OSMDOptions";
import { ColoringModes as ColoringMode } from "../../Common/Enums/ColoringModes";
import { Dictionary } from "typescript-collections";
import { FontStyles } from "../../Common/Enums";
import { NoteEnum, AccidentalEnum } from "../../Common/DataObjects/Pitch";
import { ChordSymbolEnum, CustomChord } from "../../MusicalScore/VoiceData/ChordSymbolContainer";
import { GeometricSkyBottomLineCaches } from "./GeometricSkyBottomLineContext";
import { GraphicalNote } from "./GraphicalNote";
import { Note } from "../VoiceData/Note";
import { ITextMeasurer } from "../Interfaces/ITextMeasurer";
/** Rendering and Engraving options, more fine-grained than [[IOSMDOptions]].
 *  Not all of these options are meant to be modified by users of the library,
 *  full support is only given for [[IOSMDOptions]].
 *  Nevertheless, there are many useful options here,
 *  like Render* to (not) render certain elements (e.g. osmd.rules.RenderRehearsalMarks = false)
 */
export declare class EngravingRules {
    /** A unit of distance. 1.0 is the distance between lines of a stave for OSMD, which is 10 pixels in Vexflow at osmd.Zoom = 1 (default). */
    static unit: number;
    SamplingUnit: number;
    StaccatoShorteningFactor: number;
    /** Height (size) of the sheet title. */
    SheetTitleHeight: number;
    SheetSubtitleHeight: number;
    SheetMinimumDistanceBetweenTitleAndSubtitle: number;
    SheetComposerHeight: number;
    SheetAuthorHeight: number;
    SheetCopyrightHeight: number;
    SheetCopyrightMargin: number;
    /** Whether to use the (deprecated) OSMD < 1.8.6 way of parsing and displaying subtitles and composer,
     * which did not read multiple lines from XML credit-words tags.
     * Option will probably be removed soon.
     * @deprecated
     */
    SheetComposerSubtitleUseLegacyParsing: boolean;
    CompactMode: boolean;
    PagePlacementEnum: PagePlacementEnum;
    PageHeight: number;
    PageTopMargin: number;
    PageTopMarginNarrow: number;
    PageBottomMargin: number;
    PageLeftMargin: number;
    PageRightMargin: number;
    TitleTopDistance: number;
    TitleBottomDistance: number;
    SystemLeftMargin: number;
    SystemRightMargin: number;
    SystemLabelsRightMargin: number;
    /** The distance between the columns of the brackets left of a system's staves, in units (1 unit = 10 px at zoom 1):
     *  a part group's bracket nested in another group's stands this much further left than the outer one, as does the
     *  brace of a multi-staff part inside a bracketed group (a brace is the outermost symbol, Gould, Behind Bars, p. 516).
     *  Default 0.7: 0.4 between a bracket (VexFlow's is 0.3 wide) and the symbol in the next column, about MuseScore's
     *  bracketDistance of 0.45 staff spaces.
     */
    GroupBracketColumnDistance: number;
    SystemComposerDistance: number;
    SystemLyricistDistance: number;
    InstrumentLabelTextHeight: number;
    MinimumDistanceBetweenSystems: number;
    MinSkyBottomDistBetweenSystems: number;
    LastSystemMaxScalingFactor: number;
    StaffDistance: number;
    BetweenStaffDistance: number;
    StaffHeight: number;
    TabStaffInterlineHeight: number;
    TabStaffInterlineHeightForBboxes: number;
    BetweenStaffLinesDistance: number;
    /** Whether to automatically beam notes that don't already have beams in XML. */
    AutoBeamNotes: boolean;
    /** Options for autoBeaming like whether to beam over rests. See AutoBeamOptions interface. */
    AutoBeamOptions: AutoBeamOptions;
    /** Whether to automatically generate new beams for tabs. Also see TabBeamsRendered for existing XML beams. */
    AutoBeamTabs: boolean;
    BeamWidth: number;
    BeamSpaceWidth: number;
    BeamForwardLength: number;
    FlatBeams: boolean;
    FlatBeamOffset: number;
    FlatBeamOffsetPerBeam: number;
    /** Whether to pull extreme high/low ledger line beams closer to the staff. */
    OptimizeExtremeLedgerBeams: boolean;
    ClefLeftMargin: number;
    ClefRightMargin: number;
    /** How many unique note positions a percussion score needs to have to not be rendered on one line.
     * Set this to 0 to disable one-line reduction and percussion note positioning, or -1 to keep the note positioning.
     * A staff whose XML gives the number of lines (<staff-lines>) keeps it, unless PercussionKeepXMLStafflineCount is false.
     */
    PercussionOneLineCutoff: number;
    /** Whether a percussion staff whose XML gives the number of lines (<staff-lines>) keeps it. Default true.
     * If false, PercussionOneLineCutoff also draws such a staff on one line, e.g. a snare drum with <staff-lines>5.
     */
    PercussionKeepXMLStafflineCount: boolean;
    PercussionForceVoicesOneLineCutoff: number;
    PercussionUseXMLDisplayStep: boolean;
    PercussionXMLDisplayStepNoteValueShift: number;
    PercussionOneLineXMLDisplayStepOctaveOffset: number;
    /** Makes the score position notes on the 2 cajon stafflines, and use 2 stafflines even if PercussionOneLineCutoff set.
     * Should only be set for cajon scores, as this will disable the PercussionOneLineCutoff.
     */
    PercussionUseCajon2NoteSystem: boolean;
    BetweenKeySymbolsDistance: number;
    KeyRightMargin: number;
    RhythmRightMargin: number;
    ShowRhythmAgainAfterPartEndOrFinalBarline: boolean;
    /** Begin a new part after a final barline (light-heavy, without a repeat or ending) in the middle of the piece: a new system, also with
     *  RenderSingleHorizontalStaffline, and measure numbers counted from 1 again (read in load()).
     */
    NewPartAndSystemAfterFinalBarline: boolean;
    InStaffClefScalingFactor: number;
    DistanceBetweenNaturalAndSymbolWhenCancelling: number;
    NoteHelperLinesOffset: number;
    MeasureLeftMargin: number;
    MeasureRightMargin: number;
    DistanceBetweenLastInstructionAndRepetitionBarline: number;
    ArpeggioDistance: number;
    IdealStemLength: number;
    StemNoteHeadBorderYOffset: number;
    StemWidth: number;
    StemMargin: number;
    StemMinLength: number;
    StemMaxLength: number;
    BeamSlopeMaxAngle: number;
    StemMinAllowedDistanceBetweenNoteHeadAndBeamLine: number;
    SetWantedStemDirectionByXml: boolean;
    /** Whether a secondary voice (any voice after the first one on a staff, e.g. MusicXML voice 2) that is the only
     *  voice with entries in a measure gets pitch-based (automatic) stem directions instead of the stems-down that
     *  mark a secondary voice. Only affects notes without a <stem> in the MusicXML (see SetWantedStemDirectionByXml).
     *  Default false: stems down are the usual signal for a secondary voice (MuseScore renders it that way too), #1719. */
    AutoStemSecondaryVoicesWhenAloneInMeasure: boolean;
    GraceNoteScalingFactor: number;
    GraceNoteXOffset: number;
    /** Set this to e.g. -0.5 or -0.8 to put grace notes a lot closer to the main note. */
    GraceNoteGroupXMargin: number;
    WedgeOpeningLength: number;
    WedgeMeasureEndOpeningLength: number;
    WedgeMeasureBeginOpeningLength: number;
    WedgePlacementAboveY: number;
    WedgePlacementBelowY: number;
    WedgeHorizontalMargin: number;
    WedgeVerticalMargin: number;
    DistanceOffsetBetweenTwoHorizontallyCrossedWedges: number;
    WedgeMinLength: number;
    WedgeEndDistanceBetweenTimestampsFactor: number;
    /** Whether an accent should by default be placed above the note if its note stem is above. Default false (below).
     * Applies to accents (>/^), staccato (.), pizzicato (+), mainly (in our samples)
     * Note that this can be overwritten if the MusicXML says "placement='below'".
     */
    ArticulationAboveNoteForStemUp: boolean;
    SoftAccentWedgePadding: number;
    SoftAccentSizeFactor: number;
    DistanceBetweenAdjacentDynamics: number;
    TempoChangeMeasureValidity: number;
    TempoContinousFactor: number;
    StaccatoScalingFactor: number;
    BetweenDotsDistance: number;
    OrnamentAccidentalScalingFactor: number;
    ChordSymbolTextHeight: number;
    ChordSymbolTextAlignmentTop: TextAlignmentEnum;
    ChordSymbolTextAlignmentBottom: TextAlignmentEnum;
    ChordSymbolBottomMargin: number;
    ChordSymbolRelativeXOffset: number;
    /** Additional x-shift for short chord symbols (e.g. C, but not Eb/7), to appear more centered. */
    ChordSymbolExtraXShiftForShortChordSymbols: number;
    /** Threshold width below which to apply ChordSymbolExtraXShiftForShortChordSymbols. */
    ChordSymbolExtraXShiftWidthThreshold: number;
    ChordSymbolXSpacing: number;
    ChordOverlapAllowedIntoNextMeasure: number;
    ChordSymbolYOffset: number;
    /** Meant for the y distance between alternate chord symbols placed above each other on a note (not implemented yet, see #897).
     * No effect for now: the chord symbols of a note are placed next to each other, each with ChordSymbolYOffset like a single one.
     */
    ChordSymbolYPadding: number;
    /** The minimum distance from the top staff line up to the baseline of a chord symbol above the staff, in units (staff spaces).
     *  Chord symbols are placed above what is under them (ChordSymbolYOffset), and at least this high, e.g. over a whole rest or
     *  over notes inside the staff. Default 1.5 (MuseScore uses 2.5). 0: no minimum.
     */
    ChordSymbolMinimumBaselineAboveStaff: number;
    /** The minimum distance from the bottom staff line down to the baseline of a chord symbol below the staff, in units (staff spaces),
     *  like ChordSymbolMinimumBaselineAboveStaff. Default 0: no minimum (MuseScore uses 3.5).
     */
    ChordSymbolMinimumBaselineBelowStaff: number;
    ChordSymbolYAlignment: boolean;
    ChordSymbolYAlignmentScope: string;
    /** Offset to start of measure (barline) when chord symbol is on whole measure rest.
     * An offset of 0 would place the chord symbol directly above the barline, so the default is ~1.2.
     */
    ChordSymbolWholeMeasureRestXOffset: number;
    ChordSymbolWholeMeasureRestXOffsetMeasure1: number;
    ChordSymbolLabelTexts: Dictionary<ChordSymbolEnum, string>;
    ChordAccidentalTexts: Dictionary<AccidentalEnum, string>;
    CustomChords: CustomChord[];
    /** Not always a symbol, can also be text (RepetitionInstruction). Keeping the name for backwards compatibility. */
    RepetitionSymbolsYOffset: number;
    /** Adds a percent of the stave's width (e.g. 0.4 = 40%) to the x position of end instructions like Fine or D.C. al fine.
     *  Only applied in the last measure of a staffline, so that the instruction is not shifted into the next measure,
     *  and at most up to the measure's end barline, so that it isn't shifted off the page in a wide measure. */
    RepetitionEndInstructionXShiftAsPercentOfStaveWidth: number;
    RehearsalMarkXOffset: number;
    RehearsalMarkXOffsetDefault: number;
    RehearsalMarkXOffsetSystemStartMeasure: number;
    RehearsalMarkYOffset: number;
    RehearsalMarkYOffsetDefault: number;
    /** y offset added to avoid collisions of rehearsal marks (e.g. "A" or "Verse") with multiple measure rest numbers. */
    RehearsalMarkYOffsetAddedForRehearsalMarks: number;
    RehearsalMarkFontSize: number;
    /** Lift a rehearsal mark above a chord symbol in the same measure so the two don't overlap, and reserve
     *  skyline space for it. The mark is a fixed-offset VexFlow StaveSection that isn't part of the skyline,
     *  while chord symbols are placed (earlier) against the skyline and can end up right where the mark goes. */
    RehearsalMarkAboveChordSymbol: boolean;
    MeasureNumberLabelHeight: number;
    MeasureNumberLabelOffset: number;
    MeasureNumberLabelXOffset: number;
    /** Whether tuplets should display ratio (3:2 instead of 3 for triplet). Default false. */
    TupletsRatioed: boolean;
    /** Whether to show a ratio when the XML says "show-number: both". Otherwise uses the default TupletsRatioed. */
    TupletsRatioedUseXMLValue: boolean;
    /** Whether tuplets (except triplets) should be bracketed (e.g. |--5--| instead of 5). Default false.
     * Note that this doesn't affect triplets (|--3--|), which have their own setting TripletsBracketed.
     * If false, only tuplets given as bracketed in XML (bracket="yes") will be bracketed.
     * (If not given in XML, bracketing is implementation-dependent according to standard)
     */
    TupletsBracketed: boolean;
    /** Whether all triplets should be bracketed. Overrides tupletsBracketed for triplets.
     * If false, only triplets given as bracketed in XML (bracket="yes") will be bracketed.
     * (Bracketing all triplets can be cluttering)
     */
    TripletsBracketed: boolean;
    /** Whether to bracket like the XML says when 'bracket="no"' or "yes" is given.
     * Otherwise, OSMD decides bracket usage.
     * Note that sometimes the XML doesn't have any 'bracket' value. */
    TupletsBracketedUseXMLValue: boolean;
    TupletNumberLabelHeight: number;
    TupletNumberYOffset: number;
    TupletNumberLimitConsecutiveRepetitions: boolean;
    TupletNumberMaxConsecutiveRepetitions: number;
    TupletNumberAlwaysDisableAfterFirstMax: boolean;
    /** Whether to use the <tuplet show-number="value"> value or to ignore it. */
    TupletNumberUseShowNoneXMLValue: boolean;
    LabelMarginBorderFactor: number;
    TupletVerticalLineLength: number;
    /** Whether to show tuplet numbers (and brackets) in tabs. Brackets can be disabled via TabTupletsBracketed. */
    TupletNumbersInTabs: boolean;
    /** Whether to show brackets in tab tuplets. To not render tab tuplets entirely, set TupletNumbersInTabs = false. */
    TabTupletsBracketed: boolean;
    TabTupletYOffsetBottom: number;
    /** Additional offset applied to top tuplets (added to TabTupletYOffset).
     * You could apply a negative offset if the piece doesn't have effects like bends,
     * which often take some vertical space.
     */
    TabTupletYOffsetTop: number;
    TabTupletYOffsetEffects: number;
    /** Opt in to TAB note rhythm (stems, flags and augmentation dots). Defaults to false.
     * Explicit MusicXML stem=none remains stemless; whole notes and grace notes keep their existing rendering.
     * Existing XML beams are controlled separately by TabBeamsRendered.
     */
    TabRhythmRendered: boolean;
    TabBeamsRendered: boolean;
    TabKeySignatureRendered: boolean;
    /** Whether space should be reserved as if there was a key signature.
     * False basically only works for tab-only scores, as it prevents vertical x-alignment with other staves.
     * False is more compact for tab-only scores.
     */
    TabKeySignatureSpacingAdded: boolean;
    TabTimeSignatureRendered: boolean;
    /** Whether space should be reserved as if there was a key signature.
     * False basically only works for tab-only scores, as it prevents vertical x-alignment with other staves.
     * False is more compact for tab-only scores.
     */
    TabTimeSignatureSpacingAdded: boolean;
    TabFingeringsRendered: boolean;
    /** Use an X in tabs when the note has an X notehead, e.g. in the staff above in the classical notes, instead of the fret number */
    TabUseXNoteheadShapeForTabNote: boolean;
    TabUseXNoteheadAlternativeGlyph: boolean;
    TabXNoteheadScale: number;
    /** Whether the first measure is allowed to have a left repeat barline, if explicitly given in the MusicXML. */
    RepetitionAllowFirstMeasureBeginningRepeatBarline: boolean;
    RepetitionEndingLabelHeight: number;
    RepetitionEndingLabelXOffset: number;
    RepetitionEndingLabelYOffset: number;
    RepetitionEndingLineYLowerOffset: number;
    RepetitionEndingLineYUpperOffset: number;
    /** Whether the cursor should ignore / skip repetitions (alternative name: SkipRepetitions). False by default */
    CursorIgnoreRepetitions: boolean;
    VoltaOffset: number;
    /** X offset applied after label was moved to not overflow the staffline to the left.
     * Without this offset, simply removing the overflow is usually too strict, moving it too far unnecessarily.
     * e.g. see Beethoven Geliebte sample ("Ziemlich langsam")
     */
    LabelXOffsetForStafflineLeftOverflowCheck: number;
    TempoExpressionTextAlignment: TextAlignmentEnum;
    UnknownExpressionTextAlignment: TextAlignmentEnum;
    /** Default alignment of lyrics.
     * Left alignments will extend text to the right of the bounding box,
     * which facilitates spacing by extending measure width.
     */
    LyricsAlignmentStandard: TextAlignmentEnum;
    LyricsHeight: number;
    /** Whether to re-link lyric word chains split across voices of the same staff
     * after reading, so that dashes are drawn between their syllables.
     * Set before loading a score: the words are linked when loading. */
    RelinkLyricWordsAcrossVoices: boolean;
    /** Whether the first lyric of a verse in a staff, if its text starts with the verse number, e.g. "1. Si" (MusicXML has no
     * element for the number), is aligned like a lyric without one, with the number left of where the lyric starts. Default true.
     * If false, the text is aligned as a whole, with the lyric right of the number. For left-aligned lyrics (LyricsAlignmentStandard).
     * Set before loading a score: the lyrics are measured when its graphical objects are created. */
    LyricsVerseNumberLeftOfLyric: boolean;
    LyricsYOffsetToStaffHeight: number;
    LyricsYMarginToBottomLine: number;
    /** Extra x-shift (to the right) for short lyrics to be better vertically aligned.
     * Also see ChordSymbolExtraXShiftForShortChordSymbols, same principle, same default value.
     */
    LyricsExtraXShiftForShortLyrics: number;
    /** Threshold of the lyric entry's width below which the x-shift is applied. Default 1.4. */
    LyricsExtraXShiftForShortLyricsWidthThreshold: number;
    /** Whether to enable x padding (to the right) for notes with long lyrics, see LyricsXPaddingFactorForLongLyrics for the degree.
     * This helps avoid overlaps and shorten measures, because otherwise the whole measure needs to be stretched to avoid overlaps,
     * see MaximumLyricsElongationFactor */
    LyricsUseXPaddingForLongLyrics: boolean;
    /** How much spacing/padding should be added after notes with long lyrics on short notes
     * (>4 characters on <8th note),
     * so that the measure doesn't need to be elongated too much to avoid lyrics collisions.
     * Default 1 = 10 pixels */
    LyricsXPaddingFactorForLongLyrics: number;
    /** How wide a text needs to be to trigger lyrics padding for short notes.
     * This is visual width, not number of characters, as e.g. 'zzz' is wider than 'iii'.
     * Default 3.3.
     */
    LyricsXPaddingWidthThreshold: number;
    /** Long notes need less padding than short ones, by default we use 0.7 less padding. */
    LyricsXPaddingReductionForLongNotes: number;
    /** Last note in measure needs less padding because of measure bar and bar start/end padding. */
    LyricsXPaddingReductionForLastNoteInMeasure: number;
    LyricsXPaddingForLastNoteInMeasure: boolean;
    /** Reduction applied for the last note of a measure when its lyric is a multi-syllable
     *  mid-word continuation (a dash trails to the next syllable, which lives in the next measure).
     *  Lower than LyricsXPaddingReductionForLastNoteInMeasure because the next measure's first note
     *  has a syllable + dash glyph right at its start — the usual measure-end buffer doesn't apply.
     *  Set to 0 for maximum cross-measure clearance (no reduction), or up to
     *  LyricsXPaddingReductionForLastNoteInMeasure for the same reduction as a normal last note.
     *  Default 1.0 (regular note 1.2). */
    LyricsXPaddingReductionForLastNoteInMeasureCrossMeasureMidWord: number;
    VerticalBetweenLyricsDistance: number;
    HorizontalBetweenLyricsDistance: number;
    BetweenSyllableMaximumDistance: number;
    BetweenSyllableMinimumDistance: number;
    LyricOverlapAllowedIntoNextMeasure: number;
    MinimumDistanceBetweenDashes: number;
    MaximumLyricsElongationFactor: number;
    SlurPlacementFromXML: boolean;
    SlurPlacementAtStems: boolean;
    SlurPlacementUseSkyBottomLine: boolean;
    BezierCurveStepSize: number;
    TPower3: number[];
    OneMinusTPower3: number[];
    FactorOne: number[];
    FactorTwo: number[];
    TieGhostObjectWidth: number;
    TieYPositionOffsetFactor: number;
    MinimumNeededXspaceForTieGhostObject: number;
    TieHeightMinimum: number;
    TieHeightMaximum: number;
    TieHeightInterpolationK: number;
    TieHeightInterpolationD: number;
    SlurNoteHeadYOffset: number;
    /** Not used anymore: a slur starts and ends SlurNoteHeadYOffset beyond the articulations of its start and end notes on its
     *  side, as drawn (see GraphicalSlur), not this fixed distance beyond the end note.
     * @deprecated
     */
    SlurEndArticulationYOffset: number;
    /** Not used anymore: an accent at the start or end of a slur goes outside it, beyond its curve, unless that is too far from the
     *  note (see GraphicalSlur), not this fixed distance further out at the start of a slur placed in the XML.
     * @deprecated
     */
    SlurStartArticulationYOffsetOfArticulation: number;
    SlurStemXOffset: number;
    SlurSlopeMaxAngle: number;
    SlurTangentMinAngle: number;
    SlurTangentMaxAngle: number;
    SlurHeightFactor: number;
    SlurHeightFlattenLongSlursFactorByWidth: number;
    SlurHeightFlattenLongSlursFactorByAngle: number;
    SlurHeightFlattenLongSlursCutoffAngle: number;
    SlurHeightFlattenLongSlursCutoffWidth: number;
    /** Whether to cap a slur's arc height so it doesn't bow much higher than the notes/objects it spans
     *  (long, steep slurs otherwise overshoot massively, see issue #1466). Default true. */
    SlurFlattenToObstacle: boolean;
    /** How far (in units) above the highest object it spans a slur's apex may reach when capped by
     *  SlurFlattenToObstacle. Larger = taller slurs / more clearance. */
    SlurFlattenToObstacleMargin: number;
    /** A graceful minimum arc height so slurs over flat passages aren't flattened too much: the apex cap never
     *  goes below this factor * sqrt(width) (itself capped at SlurFlattenMaxMinArcHeight). Uses sqrt(width) rather
     *  than width so wide slurs stay proportionally flat instead of ballooning. */
    SlurFlattenMinArcWidthFactor: number;
    /** Upper bound (in units) for the width-based minimum arc height (see SlurFlattenMinArcWidthFactor). */
    SlurFlattenMaxMinArcHeight: number;
    SlursStartingAtSameStaffEntryYOffset: number;
    SlurMaximumYControlPointDistance: number;
    /** How much a cross-staff slur (e.g. left hand to right hand) bows out, as a factor of the distance
     * between its two notes. See [[SlurCrossStaffMinBow]] and [[SlurCrossStaffMaxBow]] for the limits. */
    SlurCrossStaffBowFactor: number;
    SlurCrossStaffMinBow: number;
    SlurCrossStaffMaxBow: number;
    GlissandoNoteOffset: number;
    GlissandoStafflineStartMinimumWidth: number;
    GlissandoStafflineStartYDistanceToNote: number;
    GlissandoStafflineEndOffset: number;
    GlissandoDefaultWidth: number;
    TempoYSpacing: number;
    InstantaneousTempoTextHeight: number;
    ContinuousDynamicTextHeight: number;
    /** Whether to use the XML offset value for expressions, especially wedges (crescendo). See #1477 */
    UseEndOffsetForExpressions: boolean;
    MoodTextHeight: number;
    UnknownTextHeight: number;
    ContinuousTempoTextHeight: number;
    VexFlowDefaultNotationFontScale: number;
    VexFlowDefaultTabFontScale: number;
    TremoloStrokeScale: number;
    TremoloYSpacingScale: number;
    TremoloBuzzRollThickness: number;
    /** Vertical thickness of one stroke ("tremolo beam") of a tremolo between two notes, in units (1 unit = staff space). */
    TremoloBetweenNotesStrokeThickness: number;
    /** Vertical gap between the strokes of a tremolo between two notes, in units. */
    TremoloBetweenNotesStrokeGap: number;
    /** Minimum horizontal padding between the strokes of a tremolo between two notes and the stems (or noteheads for stemless notes), in units. */
    TremoloBetweenNotesXPadding: number;
    /** Maximum length of the strokes of a tremolo between two notes,
     * as a fraction of the space between the stems (or noteheads for stemless notes).
     * (Gould - Behind Bars: the strokes span about two thirds of the space between the notes) */
    TremoloBetweenNotesMaxLengthFactor: number;
    /** Maximum vertical rise/fall (slant) of the strokes of a tremolo between two notes, in units. */
    TremoloBetweenNotesMaxSlant: number;
    /** Vertical padding between the strokes of a tremolo between two notes and the notehead (edge), in units.
     * Stems are lengthened where necessary to make room for the strokes (e.g. for 4+ strokes),
     * as recommended by Gould (Behind Bars). */
    TremoloBetweenNotesYPadding: number;
    StaffLineWidth: number;
    StaffLineColor: string;
    LedgerLineWidth: number;
    LedgerLineStrokeStyle: string;
    LedgerLineColorDefault: string;
    WedgeLineWidth: number;
    TupletLineWidth: number;
    LyricUnderscoreLineWidth: number;
    SystemThinLineWidth: number;
    SystemBoldLineWidth: number;
    SystemRepetitionEndingLineWidth: number;
    SystemDotWidth: number;
    MultipleRestMeasureDefaultWidth: number;
    MultipleRestMeasureAddKeySignature: boolean;
    /** Use the same measure width for all measures (experimental).
     *  Note that this will use the largest width of all measures,
     *  as Vexflow will mess up the layout with overlays if using less than minimum width.
     *  See formatter.preCalculateMinTotalWidth()
     */
    FixedMeasureWidth: boolean;
    /** Use a fixed width for all measures (experimental).
     *  This is mostly for debugging or for when you already know how big the measures
     *  in the target score are, because using a too low width will cause overlaps in Vexflow.
     */
    FixedMeasureWidthFixedValue: number;
    FixedMeasureWidthUseForPickupMeasures: boolean;
    DistanceBetweenVerticalSystemLines: number;
    DistanceBetweenDotAndLine: number;
    RepeatEndStartPadding: number;
    OctaveShiftLineWidth: number;
    OctaveShiftVerticalLineLength: number;
    OctaveShiftOnWholeMeasureNoteUntilEndOfMeasure: boolean;
    GraceLineWidth: number;
    MinimumStaffLineDistance: number;
    MinSkyBottomDistBetweenStaves: number;
    /** Whether to snap the y positions of stafflines and music systems to positions where the
     *  (1px) staff lines render as crisp single pixel rows, instead of being spread (anti-aliased)
     *  over two half-covered, gray-ish pixel rows. Default true.
     *  This makes the staff line weight consistent across all systems (and across releases:
     *  otherwise sub-pixel layout changes shift the anti-aliasing per system, which shows up as
     *  bolder/lighter staff lines, e.g. in visual regression tests).
     *  Exact at zoom 1 (and its integer multiples), within a page.
     */
    SnapStafflinesToCrispPixels: boolean;
    MinimumCrossedBeamDifferenceMargin: number;
    /** Maximum width of sheet / HTMLElement containing the score. Canvas is limited to 32767 in current browsers, though SVG isn't.
     *  Setting this to > 32767 will break the canvas backend (no problem if you only use SVG).
     */
    SheetMaximumWidth: number;
    VoiceSpacingMultiplierVexflow: number;
    VoiceSpacingAddendVexflow: number;
    PickupMeasureWidthMultiplier: number;
    /** The spacing between a repetition that is followed by an implicit/pickup/incomplete measure.
     *  (E.g. in a 4/4 time signature, a measure that repeats after the 3rd beat, continuing with a pickup measure)
     */
    PickupMeasureRepetitionSpacing: number;
    /** Multiplier for PickupMeasureRepetitionSpacing if there is only one note in the pickup measure. This usually needs a lot more space. */
    PickupMeasureSpacingSingleNoteAddend: number;
    DisplacedNoteMargin: number;
    MinNoteDistance: number;
    SubMeasureXSpacingThreshold: number;
    MeasureDynamicsMaxScalingFactor: number;
    WholeRestXShiftVexflow: number;
    MetronomeMarksDrawn: boolean;
    MetronomeMarkXShift: number;
    MetronomeMarkYShift: number;
    SoftmaxFactorVexFlow: number;
    /** Stagger (x-shift) whole notes that are the same note, but in different voices (show 2 instead of 1). */
    StaggerSameWholeNotes: boolean;
    MaxInstructionsConstValue: number;
    NoteDistances: number[];
    NoteDistancesScalingFactors: number[];
    DurationDistanceDict: {
        [_: number]: number;
    };
    DurationScalingDistanceDict: {
        [_: number]: number;
    };
    /** Whether to align rests. 0 = Never, 1 = Always, 2 = Auto.
     * Currently not recommended because rests are now positioned to avoid collisions with notes. */
    AlignRests: AlignRestOption;
    RestCollisionYPadding: number;
    FillEmptyMeasuresWithWholeRest: FillEmptyMeasuresWithWholeRests | number;
    ArpeggiosGoAcrossVoices: boolean;
    RenderArpeggios: boolean;
    RenderSlurs: boolean;
    /** Whether to render slurs that go across staves (e.g. left hand to right hand for piano). Supplementary to
     * [[RenderSlurs]]: with RenderSlurs = true and RenderSlursAcrossStaves = false, all slurs are rendered except
     * the ones across staves. */
    RenderSlursAcrossStaves: boolean;
    RenderGlissandi: boolean;
    /** Whether to draw hidden notes and rests (Note.PrintObject false, e.g. print-object="no" in the MusicXML) like visible
     *  ones, with their beams, ties, tuplets and fingerings, and to let the cursor stop at them. Default false.
     *  E.g. to show what a voice hidden for playback plays, like a tremolo written out as single notes.
     *  Set by OSMDOptions.drawHiddenNotes. Beams and tuplets are created at load(): to change this rule after load(),
     *  call osmd.updateGraphic() before the next render(). */
    RenderHiddenNotes: boolean;
    /** The color of the hidden notes and rests drawn with RenderHiddenNotes, to tell them apart from visible ones.
     *  Default "#A0A0A0CC", a light, slightly transparent gray, like hidden notes shown in MuseScore or Sibelius.
     *  It colors their noteheads, accidentals, dots and articulations, and their stems, flags and ledger lines where all
     *  notes of a chord are hidden notes, and with ColorBeams the beams of such notes. Needs ColoringEnabled.
     *  Set it to "" to draw hidden notes in the colors of visible notes. Set by OSMDOptions.hiddenNotesColor. */
    HiddenNotesColor: string;
    /** Whether hidden voices (Voice.Visible false) keep the layout of the full score: their notes are laid out like hidden notes
     *  (print-object="no"), taking up their space and keeping the stem directions of the other voices, but they aren't drawn.
     *  E.g. for an exercise where a missing voice is filled in, or to show voices one by one without the notes moving.
     *  Default false: the other voices are laid out as if the hidden voices weren't there, e.g. for a singer's part of a hymn,
     *  the alto with stems by pitch instead of the stems down it has next to the soprano, spaced by its own notes only.
     *  To change this rule after load(), call osmd.updateGraphic() before the next render(). */
    HiddenVoicesKeepLayout: boolean;
    /** Whether to draw the lyrics of hidden voices (Voice.Visible false). Default true.
     *  Without HiddenVoicesKeepLayout, they're drawn under the visible notes that start at the same time on the staff, where
     *  these have no lyrics of that verse themselves: e.g. a hymn's lyrics, given with the soprano, under the alto when only
     *  the alto is shown. A syllable where no visible note starts is left out.
     *  With HiddenVoicesKeepLayout, they stay under the hidden notes.
     *  To change this rule after load(), call osmd.updateGraphic() before the next render(). */
    RenderLyricsOfHiddenVoices: boolean;
    ColoringMode: ColoringMode;
    ColoringEnabled: boolean;
    ColorStemsLikeNoteheads: boolean;
    /** Whether to draw a flag in the color of its stem. Default true. Otherwise, flags are drawn in DefaultColorStem.
     *  A transparent stem, e.g. of a hidden note (print-object="no") or of `<stem>none</stem>`, hides its flag either way. */
    ColorFlags: boolean;
    /** Whether to draw a beam in the color of its stems, if two or more of them have a color, all the same, e.g. from the XML
     *  or, with ColorStemsLikeNoteheads, the noteheads' color. Default true. The noteheads alone don't color a beam: an app
     *  can color some noteheads without their beam. */
    ColorBeams: boolean;
    ColoringSetCurrent: Dictionary<NoteEnum | number, string>;
    /** Default color for all musical elements including key signature etc. Default undefined. */
    DefaultColorMusic: string;
    DefaultColorNotehead: string;
    DefaultColorRest: string;
    DefaultColorStem: string;
    DefaultColorLabel: string;
    DefaultColorLyrics: string;
    DefaultColorChordSymbol: string;
    DefaultColorTitle: string;
    DefaultColorCursor: string;
    DefaultFontFamily: string;
    /** Font family of the texts that VexFlow draws in fonts of its own: rehearsal marks, ending numbers, the text of
     *  metronome marks, repetition instructions like "D.C. al Fine", octave shift texts like "8va", fingerings left or right
     *  of notes and of grace notes, string numbers, and in tabs the fret numbers, bends, and the texts of hammer-ons,
     *  pull-offs and slides.
     *  If undefined, these keep VexFlow's fonts (e.g. bold sans-serif for rehearsal marks, Times for repetition instructions).
     *  Their size, weight and style don't change. Set it e.g. to DefaultFontFamily to draw all texts in the same font.
     *  Set before loading a score: fingerings, string numbers, tab fret numbers and bends are created when loading. */
    VexFlowTextFontFamily: string;
    DefaultFontStyle: FontStyles;
    DefaultVexFlowNoteFont: string;
    /** The index (in MusicSheet.SourceMeasures) of the last measure to draw. If MaxMeasureToDrawNumber is set (not
     *  Number.MAX_VALUE), load(), render() and renderNext() put its index for the sheet here. */
    MaxMeasureToDrawIndex: number;
    /** The setting given in osmd.setOptions(), which may lead to a different index if there's a pickup measure. */
    MaxMeasureToDrawNumber: number;
    /** The index (in MusicSheet.SourceMeasures) of the first measure to draw. If MinMeasureToDrawNumber is set (not 0), load(),
     *  render() and renderNext() put its index for the sheet here. */
    MinMeasureToDrawIndex: number;
    /** The setting given in osmd.setOptions(), which may lead to a different index if there's a pickup measure.
     * If there's a pickup measure (measure 0), and we want to draw from measure number 2,
     *   we need to skip measure index 0 (the pickup measure).
     */
    MinMeasureToDrawNumber: number;
    MaxPageToDrawNumber: number;
    MaxSystemToDrawNumber: number;
    /** Whether to render a label for the composer of the piece at the top of the sheet. */
    RenderComposer: boolean;
    /** Whether to read typed first-page credit words and lay out the remaining words above the first system,
     * when page layout cannot supply their roles. With page layout, the default position-based reader is retained.
     * Default false. Set before loading a score; changing it requires reloading the score. Typed title, subtitle,
     * composer and lyricist credits override metadata; identification rights retain priority over rights credits.
     * This reflows plain first-page words and does not reproduce source coordinates, per-run styling, images or later pages.
     */
    ReadFirstPageCreditWords: boolean;
    /** Visibility of independent first-page credit labels, set by DrawingParameters.DrawCredits. */
    RenderFirstPageCreditWords: boolean;
    RenderTitle: boolean;
    RenderSubtitle: boolean;
    RenderLyricist: boolean;
    RenderCopyright: boolean;
    RenderPartNames: boolean;
    /** Whether to render part-group names and abbreviations. Requires RenderPartNames. Default true. */
    RenderPartGroupNames: boolean;
    RenderPartAbbreviations: boolean;
    /** Whether to render part abbreviations on later systems with only one staff (the first system shows the part name,
     *  or its abbreviation when the name leaves too little room, see FitPartLabelsToMeasures).
     *  Requires RenderPartNames and RenderPartAbbreviations. Default false.
     */
    RenderPartAbbreviationsForSingleStaff: boolean;
    /** Whether a system's part names or abbreviations give way when they leave its measures too little room, e.g. in a
     *  narrow container, where the notes of the first measure would be drawn past the end of the staff:
     *  the first system then shows the part names on two lines, else the part abbreviations, else no labels,
     *  and later systems leave out their abbreviations. Default true.
     */
    FitPartLabelsToMeasures: boolean;
    /** Internal cache-gate for lazy (renderAppend) rendering: when true, the lazy reuse caches (skyline)
     *  are active. Set by OpenSheetMusicDisplay.renderAppend() and forced false by a normal render(), so
     *  the caches never affect a non-lazy render. Not a user toggle. */
    LazyConsistentGraphic: boolean;
    /** Whether two render system labels on page 2+. This doesn't affect the default endless PageFormat. */
    RenderSystemLabelsAfterFirstPage: boolean;
    RenderFingerings: boolean;
    RenderMeasureNumbers: boolean;
    RenderMeasureNumbersOnlyAtSystemStart: boolean;
    /** Whether to render measure numbers for measures marked implicit (e.g. implicit="yes" in the MusicXML, like
     * pickup measures or measures without a meter as in Satie's Gnossiennes). Default false: implicit measures
     * don't show a measure number, as per the MusicXML standard. */
    RenderMeasureNumbersForImplicitMeasures: boolean;
    UseXMLMeasureNumbers: boolean;
    RenderLyrics: boolean;
    RenderChordSymbols: boolean;
    RenderMultipleRestMeasures: boolean;
    AutoGenerateMultipleRestMeasuresFromRestMeasures: boolean;
    /** Draw explicit MusicXML measure-repeat declarations as signs (default true).
     *  Notes, timestamps, measure widths, cursor and iterator are preserved.
     *  A whole repeat unit stays written out if it spans systems or the draw range, its reference is not visible,
     *  or it contains clef/key/time changes, grace notes, lyrics/extenders, trill lines, multi-rests,
     *  connections outside the unit or to another staff, or a slur with an unattached end.
     *  TAB staves remain written out. */
    RenderMeasureRepeats: boolean;
    RenderRehearsalMarks: boolean;
    RenderClefsAtBeginningOfStaffline: boolean;
    RenderKeySignatures: boolean;
    RenderTimeSignatures: boolean;
    /** Whether to render a (default) time signature for samples that don't have a time signature in the source (e.g. MusicXML),
     * like Satie's Gnossiennes. Default false, i.e. these samples are rendered without a time signature, as intended.
     * For normal samples that do have a time signature, this rule has no effect (use RenderTimeSignatures to control those). */
    RenderTimeSignaturesForSamplesWithoutTimeSignature: boolean;
    RenderFirstTempoExpression: boolean;
    RenderPedals: boolean;
    /** The minimum distance between a pedal sign (Ped. or *) and what is above it, e.g. a beam below the staff, in units
     * (1.0 = distance between two staff lines). Default 0.5.
     * Only applies where the sign would otherwise be higher: by default, the signs are 3 units below the staff. */
    PedalSignMarginToBottomLine: number;
    /** The distance between the release mark and the Ped. sign where a pedal is released and pressed again at one note by a
     * pedal that starts with the Ped. sign (a pedal change, drawn as * Ped., or as the end of the pedal line, its hook, then
     * Ped.), in units (1.0 = distance between two staff lines). Default 0.5. */
    PedalReleaseSignMarginToPedSign: number;
    /** Whether to draw (Ped.), the Ped. sign in parentheses, at the start of a system where a pedal that starts with the
     * Ped. sign (drawn with signs, or the Ped. sign and then the line) goes on from the system before, to confirm that it is
     * still pressed (as recommended by Elaine Gould, Behind Bars, p. 332). Default false: MusicXML doesn't encode such a sign,
     * the line or the signs of the pedal show it anyway, and (Ped.) takes space at the system's start. */
    RenderPedalContinuationSign: boolean;
    RenderWavyLines: boolean;
    DynamicExpressionMaxDistance: number;
    DynamicExpressionSpacer: number;
    /** Whether words and an instantaneous dynamic of the same staff, placement and time are drawn on one line, in the order
     *  of the file, e.g. "più f" or "p dolce" (see MusicSheetCalculator.placeWordsBesideSameTimeDynamic()). Otherwise the
     *  words are placed under (over) the dynamic. Default true. */
    PlaceWordsBesideSameTimeDynamic: boolean;
    /** Skip a dynamic marking that repeats the currently active one, i.e. has the same text (e.g. a second p in a row). Default false. */
    IgnoreRepeatedDynamics: boolean;
    ExpressionsUseXMLColor: boolean;
    ArticulationPlacementFromXML: boolean;
    /** Percent distance of breath marks to next note or end of staff, e.g. 0.8 = 80%. */
    BreathMarkDistance: number;
    /** Where to draw fingerings (Above, Below, AboveOrBelow, Left, Right, or Auto).
     * Default AboveOrBelow. Auto experimental. */
    FingeringPosition: PlacementEnum;
    FingeringPositionFromXML: boolean;
    FingeringPositionGrace: PlacementEnum;
    FingeringInsideStafflines: boolean;
    FingeringLabelFontHeight: number;
    FingeringOffsetX: number;
    FingeringOffsetY: number;
    FingeringPaddingY: number;
    FingeringTextSize: number;
    /** Whether to render string numbers in classical scores, i.e. not the string numbers in tabs, but e.g. for violin. */
    RenderStringNumbersClassical: boolean;
    /** This is not for tabs, but for classical scores, especially violin. */
    StringNumberOffsetY: number;
    NewSystemAtXMLNewSystemAttribute: boolean;
    /** Whether to begin a new system when a page break is given in XML ('new-page="yes"'), but newPageFromXML is false.
     *  Default false, because it can lead to nonsensical system breaks after a single measure,
     *  as OSMD does a different layout than the original music program exported from.
     * */
    NewSystemAtXMLNewPageAttribute: boolean;
    NewPageAtXMLNewPageAttribute: boolean;
    /** Force OSMD to render only x measures per line/system, creating line breaks / system breaks. Disabled if set to 0. */
    RenderXMeasuresPerLineAkaSystem: number;
    PageFormat: PageFormat;
    PageBackgroundColor: string;
    /** Whether to leave out the SVG group (`<g>`) around a note's head, stem and flag and around a beam when it would hold
     *  only one element, which then gets the group's class, id and pointer-events: e.g. a notehead is drawn as
     *  `<path class="vf-notehead" ...>` instead of `<g class="vf-notehead" ...><path ...></g>`.
     *  Default true: these groups were about a fifth of the elements, and the SVG's elements take most of a rendered score's memory.
     *  Set it to false for the previous structure, e.g. if your code selects `.vf-notehead path` or adds elements to these groups.
     *  VexFlowGraphicalNote's getters like getNoteheadSVGs() and its setColor() work either way.
     *  Only for the SVG backend, read in render().
     */
    SVGMergeSingleChildGroups: boolean;
    /** Whether dark mode is enabled. This is read-only, to set this, please use osmd.setOptions({darkMode: true}). */
    DarkModeEnabled: boolean;
    UsePageBackgroundColorForTabNotes: boolean;
    /** Render the sheet on one horizontal staffline, without line breaks where the width is used up.
     *  Explicit system breaks still begin a new system below, if their rules are set: NewSystemAtXMLNewSystemAttribute,
     *  NewSystemAtXMLNewPageAttribute, NewPageAtXMLNewPageAttribute, RenderXMeasuresPerLineAkaSystem and
     *  NewPartAndSystemAfterFinalBarline. A staffline wider than SheetMaximumWidth is broken too.
     */
    RenderSingleHorizontalStaffline: boolean;
    RestoreCursorAfterRerender: boolean;
    StretchLastSystemLine: boolean;
    /** Ignore brackets - e.g. `( )` - that were supposed to be around a note,
     * but were inserted as a words element in the MusicXML, which can't be matched to the note anymore,
     * and would otherwise just be placed somewhere else. See OSMD Issue 1251. */
    IgnoreBracketsWords: boolean;
    /** Whether to draw cautionary accidentals (<accidental cautionary="yes">) in parentheses when the XML gives
     *  neither parentheses nor bracket, as MuseScore reads them. Default false: only accidentals with parentheses="yes"
     *  or bracket="yes" are drawn in parentheses, as parentheses take space. Read in load().
     */
    RenderCautionaryAccidentalsInParentheses: boolean;
    PlaceWordsInsideStafflineFromXml: boolean;
    PlaceWordsInsideStafflineYOffset: number;
    SpacingBetweenTextLines: number;
    NoteToGraphicalNoteMap: Dictionary<number, GraphicalNote>;
    NoteToGraphicalNoteMapObjectCount: number;
    /** Measures the width of texts like labels in this instance's fonts (e.g. DefaultFontFamily), set by the
     *  VexFlowMusicSheetCalculator. Owned here (per OSMD instance) instead of statically (MusicSheetCalculator.TextMeasurer):
     *  a static one measured with the rules of the most recently created instance in all instances,
     *  and kept those rules, and through NoteToGraphicalNoteMap that instance's rendering, in memory after it was dropped.
     */
    TextMeasurer: ITextMeasurer;
    /** How many times osmd.render() was already called on the currently loaded score.
     * Resets after osmd.load() (via osmd.reset()).
     * Can be relevant for transposition or generally informative.
     */
    RenderCount: number;
    /** Whether to calculate the skyline and bottom-line geometrically, from the extents of the VexFlow draw calls,
     *  instead of drawing each measure on a hidden canvas and reading back its pixels (getImageData), which is much slower (see #937).
     *  Default true. If set to false, the previous pixel-based calculation is used,
     *  see SkyBottomLineBatchMinMeasures.
     */
    UseGeometricSkyBottomLineCalculation: boolean;
    /** Caches for the geometric skyline calculation (text measurements, flattened glyph outlines).
     *  Owned here (per OSMD instance, like NoteToGraphicalNoteMap) instead of statically,
     *  so that multiple OSMD instances stay independent. */
    GeometricSkyBottomLineCaches: GeometricSkyBottomLineCaches;
    /** Not used anymore: the pixel-based batch calculation (UseGeometricSkyBottomLineCalculation false) always reads the pixels
     *  with getImageData (SkyBottomLineBatchCalculatorBackendType.Plain). Its WebGL backend was removed,
     *  as the geometric calculation (the default) is faster.
     * @deprecated
     */
    PreferredSkyBottomLineBatchCalculatorBackend: SkyBottomLineBatchCalculatorBackendType;
    /** Not used anymore: the WebGL backend was removed, see PreferredSkyBottomLineBatchCalculatorBackend.
     * @deprecated
     */
    DisableWebGLInFirefox: boolean;
    /** Not used anymore: the WebGL backend was removed, see PreferredSkyBottomLineBatchCalculatorBackend.
     * @deprecated
     */
    DisableWebGLInSafariAndIOS: boolean;
    /** The minimum number of measures in the sheet where the skyline and bottom-line batch calculation is enabled,
     *  if UseGeometricSkyBottomLineCalculation is false.
     *  Batch is faster for medium to large size scores, but slower for very short scores.
     */
    SkyBottomLineBatchMinMeasures: number;
    /** Not used anymore: the WebGL backend was removed, see PreferredSkyBottomLineBatchCalculatorBackend.
     * @deprecated
     */
    SkyBottomLineWebGLMinMeasures: number;
    /** Not used anymore: the WebGL backend was removed, so there is no backend to choose,
     *  see PreferredSkyBottomLineBatchCalculatorBackend.
     * @deprecated
     */
    AlwaysSetPreferredSkyBottomLineBackendAutomatically: boolean;
    /** Currently only used in audio player */
    UseInterpolatedTempoForAccelerandoEtc: boolean;
    constructor();
    loadDefaultValues(): void;
    /** Not used anymore, without effect: OSMD calculates the skylines geometrically (UseGeometricSkyBottomLineCalculation, default
     *  true), which is faster than the pixel-based calculation with either of its backends, WebGL or Plain. This only sets
     *  PreferredSkyBottomLineBatchCalculatorBackend, which isn't read anymore, to Plain, the only backend left.
     *  It chose WebGL for large scores in Chromium browsers before the WebGL backend was removed.
     * @deprecated
     */
    setPreferredSkyBottomLineBackendAutomatically(numberOfGraphicalMeasures?: number): void;
    /** Makes it so that all musical elements (including key/time signature)
     *  are colored with the given color by default,
     *  unless an element has a different color set (e.g. VoiceEntry.StemColor).
     */
    applyDefaultColorMusic(color: string): void;
    addGraphicalNoteToNoteMap(note: Note, graphicalNote: GraphicalNote): void;
    /** Returns the GraphicalNote corresponding to (its) note. Also used by Cursor.GNotesUnderCursor().
     *  We don't want to save a GraphicalNote reference in Note, see Note.NoteToGraphicalNoteObjectId.
     */
    GNote(note: Note): GraphicalNote;
    /** This should be done before a new sheet is loaded, not each re-render (otherwise the map would end empty). */
    clearMusicSheetObjects(): void;
    resetChordAccidentalTexts(chordAccidentalTexts: Dictionary<AccidentalEnum, string>, useChordAccidentalsUnicode: boolean): void;
    setChordSymbolLabelText(key: ChordSymbolEnum, value: string): void;
    resetChordSymbolLabelTexts(chordtexts: Dictionary<ChordSymbolEnum, string>): Dictionary<ChordSymbolEnum, string>;
    addChordName(altName: string, chordKindText: string, adds: string[], alts: string[], subs: string[]): void;
    renameChord(altName: string, newAltName: string): void;
    resetChordNames(): void;
    /**
     * This method maps NoteDurations to Distances and DistancesScalingFactors.
     */
    /**
     * Calculate Curve-independend factors, to be used later in the Slur- and TieCurvePoints calculation
     */
    private calculateCurveParametersArrays;
}
export declare class PageFormat {
    constructor(width: number, height: number, idString?: string);
    width: number;
    height: number;
    idString: string;
    get aspectRatio(): number;
    /** Undefined page format: use default page format. */
    get IsUndefined(): boolean;
    static get UndefinedPageFormat(): PageFormat;
    Equals(otherPageFormat: PageFormat): boolean;
}

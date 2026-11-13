import { VexFlowBackend } from "./../MusicalScore/Graphical/VexFlow/VexFlowBackend";
import { GraphicalMusicSheet } from "./../MusicalScore/Graphical/GraphicalMusicSheet";
import { VexFlowMusicSheetDrawer } from "./../MusicalScore/Graphical/VexFlow/VexFlowMusicSheetDrawer";
import { MusicSheet } from "./../MusicalScore/MusicSheet";
import { Cursor } from "./Cursor";
import { DrawingParameters } from "../MusicalScore/Graphical/DrawingParameters";
import { IOSMDOptions, BackendType, CursorOptions } from "./OSMDOptions";
import { EngravingRules, PageFormat } from "../MusicalScore/Graphical/EngravingRules";
import { GraphicalMusicPage } from "../MusicalScore/Graphical/GraphicalMusicPage";
import { GraphicalMeasure } from "../MusicalScore/Graphical/GraphicalMeasure";
import { ITransposeCalculator } from "../MusicalScore/Interfaces/ITransposeCalculator";
/**
 * The main class and control point of OpenSheetMusicDisplay.<br>
 * It can display MusicXML sheet music files in an HTML element container.<br>
 * After the constructor, use load() and render() to load and render a MusicXML file.
 */
export declare class OpenSheetMusicDisplay {
    protected version: string;
    /**
     * Creates and attaches an OpenSheetMusicDisplay object to an HTML element container.<br>
     * After the constructor, use load() and render() to load and render a MusicXML file.
     * @param container The container element OSMD will be rendered into.<br>
     *                  Either a string specifying the ID of an HTML container element,<br>
     *                  or a reference to the HTML element itself (e.g. div)
     * @param options An object for rendering options like the backend (svg/canvas) or autoResize.<br>
     *                For defaults see the OSMDOptionsStandard method in the [[OSMDOptions]] class.
     */
    constructor(container: string | HTMLElement, options?: IOSMDOptions);
    /** Options from which OSMD creates cursors in enableOrDisableCursors(). */
    cursorsOptions: CursorOptions[];
    cursors: Cursor[];
    get cursor(): Cursor;
    get Cursor(): Cursor;
    zoom: number;
    protected zoomUpdated: boolean;
    /** Timeout in milliseconds used in osmd.load(string) when string is a URL. */
    loadUrlTimeout: number;
    protected container: HTMLElement;
    protected backendType: BackendType;
    protected needBackendUpdate: boolean;
    protected sheet: MusicSheet;
    protected drawer: VexFlowMusicSheetDrawer;
    protected drawBoundingBox: string;
    protected drawSkyLine: boolean;
    protected drawBottomLine: boolean;
    protected graphic: GraphicalMusicSheet;
    protected drawingParameters: DrawingParameters;
    protected rules: EngravingRules;
    protected autoResizeEnabled: boolean;
    protected resizeHandlerAttached: boolean;
    /** The container's content width (getContainerContentWidth()) the last layout was made for: by render(), or at the start
     *  of incremental rendering. Turning autoResize on re-renders a rendered sheet only if the width differs from it. */
    protected layoutContainerWidth: number;
    /** Removes the window's resize listener added for autoResize (see handleResize()), e.g. in dispose(). */
    private disposeResizeListener;
    /** The callbacks of the window's resize listener (see handleResize()), which reaches them only through this instance. */
    private resizeStartCallback;
    private resizeEndCallback;
    /** The key of the container's property that keeps this instance in memory while autoResize is on (see handleResize()). */
    private static readonly containerInstanceKey;
    protected followCursor: boolean;
    /** Whether this instance uses the page's warm keeper, or "auto" (in Chromium-based browsers), see KeepWarm. */
    private keepWarm;
    /** Whether this instance is counted in warmKeeperUsers (it rendered with KeepWarm on, and isn't disposed). */
    private usesWarmKeeper;
    /** The page's warm keeper (see KeepWarm): one instance, shared by all instances that use it. Static on purpose: its
     *  rendering keeps the compiled code alive for every instance, so one per page is enough. It holds no other instance. */
    private static warmKeeper;
    /** Whether the page's warm keeper was made or is scheduled, so that it's made once. */
    private static warmKeeperScheduled;
    /** How many instances use the warm keeper (see usesWarmKeeper); the last one to stop frees it. A count, not references,
     *  so that it keeps no instance in memory. */
    private static warmKeeperUsers;
    /** The layout width in pixels of the warm keeper, which has no container in the page: getContainerContentWidth() returns it. */
    private fixedLayoutWidth;
    /** A function that is executed when the XML has been read.
     * The return value will be used as the actual XML OSMD parses,
     * so you can make modifications to the xml that OSMD will use.
     * By default it returns the XML unchanged. It can also be set by the onXMLRead option,
     * and osmd.setOptions() keeps it when the option is left out. */
    OnXMLRead: (xml: string) => string;
    /**
     * Load a MusicXML file
     * @param content is either the url of a file, or the root node of a MusicXML document,
     *   or the string content of a .xml/.mxl file, or a file blob.
     *   A string that starts with "<" (after whitespace) is read as XML, also without the XML declaration (<?xml ...?>).
     * @param tempTitle is used as the title for the piece if there is no title in the XML.
     *   The name or path of a MusicXML file (e.g. "scores/Sonata No. 1.musicxml") is used without its folder and extension.
     */
    load(content: string | Document | Blob, tempTitle?: string): Promise<{}>;
    /**
     * (Re-)creates the graphic sheet from the music sheet, and puts the cursors back to the start.
     * Needed e.g. after changing a rule that applies when the graphic is created, like EngravingRules.RenderHiddenNotes.
     * A changed transposition (osmd.Sheet.Transpose, Instrument.Transpose, osmd.TransposeCalculator) or a voice shown or
     * hidden (Voice.Visible, Instrument.Visible) doesn't need it: render() creates the graphic again then, and keeps the
     * cursors where they are.
     */
    updateGraphic(): void;
    /** Creates the graphic sheet from the music sheet: its graphical measures, notes and chord symbols, with the notes and chord
     *  symbols transposed by the current transposition (see GraphicalMusicSheet.TranspositionChanged). Unlike updateGraphic(), it
     *  leaves the cursors alone: render() and renderNext() create them again on the new graphic, where they were.
     *  @param drawRange the first and the last measure to draw (source measure indices, see getDrawRangeIndices()): the multiple
     *   rest measures begin and end with them (see MusicSheetCalculator.prepareGraphicalMusicSheet())
     */
    private createGraphic;
    /** Whether the graphic has to be created again before it's rendered: after a change of the transposition or of the
     *  visible voices, which apply when it's created (see GraphicalMusicSheet.TranspositionChanged and VoiceVisibilityChanged),
     *  or for a draw range that would divide the multiple rest measures otherwise (see MusicSheetCalculator.multiRestsFitDrawRange()).
     *  @param drawRange the first and the last measure to draw (source measure indices, see getDrawRangeIndices())
     */
    private graphicOutdated;
    /** Lazy rendering (LazyConsistentGraphic): number of systems already drawn into the shared
     *  backends across prior batches, counted through the pages. Greedy layout is *usually* forward-stable, so the next
     *  batch skips redrawing these and draws from this index -- but some scores re-position earlier systems as the
     *  prefix grows, so each batch verifies the drawn systems against lazyDrawnSystemPositions and redraws from
     *  the topmost one that moved (reconciliation). */
    private lazyDrawnSystemCount;
    /** Lazy rendering: the page and the absolute Y (in units, on the page) each already-drawn system [index] was drawn at,
     *  used to detect when a later batch's full-prefix layout moves an earlier system (forward-stability
     *  is not universal) so it can be redrawn at its corrected position. */
    private lazyDrawnSystemPositions;
    /** Lazy HORIZONTAL rendering (RenderSingleHorizontalStaffline): number of graphical measures of the top
     *  staffline already drawn, counted through the systems in order (see renderAppendGrowingHorizontal()).
     *  The next batch draws from here. */
    private lazyDrawnHMeasureCount;
    /** Incremental rendering ({@link renderNext}): whether a session is in progress (started, not yet reset). */
    private lazyIncrementalActive;
    /** Incremental rendering: source-measure indices of the first and the last measure the session renders, the ones
     *  render() draws (the draw range, see getDrawRangeIndices()), limited to the sheet. Set when the session starts. */
    private lazyFirstMeasureIndex;
    private lazyLastMeasureIndex;
    /** Incremental rendering: source-measure index of the last measure the session draws, for its progress: lazyLastMeasureIndex,
     *  or the last measure of the last system drawn once a batch's layout ends there before it (drawUpToSystemNumber,
     *  drawUpToPageNumber, see lazyLayoutEndBefore()). Set by the session's first batch. */
    private lazyLayoutLastMeasureIndex;
    /** Incremental rendering: source-measure index where the next batch continues (the drawn frontier). */
    private lazyNextSourceIndex;
    /** Incremental rendering of the endless page: the width in pixels all batches of the session lay the sheet out at, the
     *  container's content width when the first batch read it (like render() reads it once). A batch reading the width again
     *  laid its systems out narrower than the ones drawn before when the container had become narrower in between, e.g. by
     *  the vertical scrollbar the page gets once the first batch makes it longer than the window. */
    private lazyLayoutWidth;
    /** Incremental rendering: the scroll listener + its target, while enableIncrementalRenderingOnScroll() is on. */
    private lazyScrollHandler;
    private lazyScrollTarget;
    /** Render the loaded music sheet to the container.
     *  A changed transposition (osmd.Sheet.Transpose, Instrument.Transpose, osmd.TransposeCalculator) or a voice shown or hidden
     *  (Voice.Visible, Instrument.Visible) is applied without updateGraphic(): render() creates the graphic again then,
     *  see GraphicalMusicSheet.TranspositionChanged and VoiceVisibilityChanged. It does so too when the draw range
     *  (drawFromMeasureNumber, drawUpToMeasureNumber) begins or ends inside a multiple rest measure, which is divided there,
     *  or one was divided for the previous draw range (see MusicSheetCalculator.multiRestsFitDrawRange()).
     */
    render(): void;
    /**
     * Whether this instance uses the page's warm keeper: true, false, or "auto" (default): in Chromium-based browsers (Chrome,
     * Edge, Opera, Electron, ...), see isChromiumBrowser(). The keeper is a small rendering OSMD keeps alive so that a sheet
     * rendered after clear() renders about as fast as the one before it. Also the option keepWarm (constructor, setOptions()).
     * The JavaScript engine (V8 in Chrome, Edge and Node) compiles OSMD's code for the objects it creates, and throws that
     * compiled code away once no such object is left, at a full garbage collection. After clear(), nothing of the sheet is
     * left, so the next sheet then rendered up to ~27% slower if such a collection happened in between (Chrome).
     * Firefox and Safari showed no such slowdown, and no gain from the keeper: "auto" makes none there.
     * After the first render() or renderNext() of an instance that uses it, OSMD renders a built-in score of 8 measures
     * (WarmKeeperScore.ts) when the page is idle (requestIdleCallback), into a container that isn't in the page: about
     * 20 ms in Chrome, and a few MB. One keeper per page, shared by the instances that use it, as any rendering keeps the
     * compiled code alive. It's freed when the last of them is disposed (dispose()) or turns this off. Not made without
     * requestIdleCallback (e.g. Node with jsdom).
     */
    get KeepWarm(): boolean | "auto";
    set KeepWarm(value: boolean | "auto");
    /** Whether this instance uses the page's warm keeper with its KeepWarm setting in this browser ("auto" decided). */
    private keepsWarm;
    /**
     * Whether `browser` (the page's navigator) is a Chromium-based browser, whose JavaScript engine V8 throws away the code it
     * compiled for objects of which none is left (see KeepWarm): from navigator.userAgentData (Chromium 90+, secure pages
     * only), else from the user agent: Chromium-based browsers name "Chrome/" or "Chromium/" in it, Safari and Firefox don't
     * (also not on iOS, where every browser is WebKit-based: CriOS, EdgiOS, FxiOS).
     */
    private static isChromiumBrowser;
    /** Stops using the page's warm keeper (see KeepWarm): the last instance to stop frees it. */
    private stopUsingWarmKeeper;
    /**
     * Uses the page's warm keeper (see KeepWarm), after a render() or renderNext(): makes it when the page is idle, if no
     * instance did yet. The keeper is a separate instance that renders the built-in score into a container that isn't in
     * the page.
     */
    private useWarmKeeper;
    /**
     * The measures render() draws, as source-measure indices: those of the draw range set with setOptions() (drawFromMeasureNumber,
     * drawUpToMeasureNumber, kept in EngravingRules.MinMeasureToDrawNumber and MaxMeasureToDrawNumber), where measure number n is
     * at index n instead of n - 1 if the sheet begins with a pickup measure (number 0). Without a measure number set (the defaults
     * 0 and Number.MAX_VALUE), the index in EngravingRules.MinMeasureToDrawIndex or MaxMeasureToDrawIndex, e.g. one set there.
     * load(), render() and renderNext() put these indices into the rules: the ones there are those of the sheet loaded.
     * @returns the indices of the first and the last measure. The last one can be beyond the sheet (by default
     *  Number.MAX_VALUE), and if the first one is, the layout starts at the sheet's last measure.
     */
    private getDrawRangeIndices;
    /** Internal range-based engine behind {@link renderNext} (the public incremental API). Lays out the
     *  prefix of the draw range up to toMeasureIndex and APPENDS the newly-stable source measures below previously
     *  rendered batches, without clearing the container, so a large score renders "system by system".
     *  clearFirst=true starts a fresh session (clears prior content, resets the counters). Returns the
     *  source-measure index at which the next batch should continue. fromMeasureIndex is informational --
     *  the drawn frontier is tracked internally. Targets the endless vertical-scroll format and
     *  RenderSingleHorizontalStaffline (laid out once, then drawn to the right batch by batch).
     *  `targetNewSystems`, if set, draws that many whole systems this batch (vertical path only; ignored for
     *  the single horizontal staffline, which is one system). */
    private renderAppend;
    /**
     * Incrementally render the loaded sheet one batch at a time, appending each batch so a large score
     * paints progressively ("system by system") instead of blocking on a full render(). The first call --
     * or the first after load(), render() or resetIncrementalRendering() -- starts a fresh session: it
     * clears the container and lays the score out from the first measure to draw. Each later call appends the
     * next batch. Returns progress; once `done` is true all measures are rendered and further calls are no-ops.
     * A session renders the measures render() draws: the whole sheet, or the range set with the options
     * drawFromMeasureNumber and drawUpToMeasureNumber when the session starts (the progress counts the measures in it).
     * Like render(), a session lays the sheet out at the container's width when it starts: to adapt it to a new
     * width, e.g. after a resize, start a new session.
     * Like render(), it applies a changed transposition (osmd.Sheet.Transpose, Instrument.Transpose, osmd.TransposeCalculator)
     * without updateGraphic(): during a session, the next call then starts it over from its first measure.
     * Page labels are drawn with the batch that finalizes their position: the title block (title, subtitle,
     * composer, lyricist) with the first batch, the copyright (below the last system) with the final batch.
     *
     * Pair with {@link enableIncrementalRenderingOnScroll} for scroll-to-load, or {@link renderRemaining}
     * to finish synchronously (e.g. before PDF/image export). Works for the endless vertical-scroll page
     * format and for RenderSingleHorizontalStaffline (one staffline scrolling right).
     *
     * @param options batch options; defaults to 8 visual measures (a multi-rest counts as one). Pass
     *   `systems` instead to advance by whole music systems (vertical only); see {@link IRenderNextOptions}.
     */
    renderNext(options?: IRenderNextOptions): IRenderNextResult;
    /**
     * Finish an in-progress incremental render synchronously: render all remaining measures at once. Useful
     * before PDF/image export or printing, which need every system, not just the ones scrolled into view.
     * No-op if no incremental render is in progress, or it is already complete.
     */
    renderRemaining(): void;
    /** Whether an incremental render ({@link renderNext}) is in progress (started and not yet reset). */
    get IncrementalRenderingActive(): boolean;
    /** Whether the in-progress incremental render has rendered all its measures (up to the last one of the sheet, or of
     *  the draw range, see {@link renderNext}). */
    get IncrementalRenderingComplete(): boolean;
    /** Current incremental-render progress as a snapshot (same shape {@link renderNext} returns), queryable
     *  at any time -- e.g. for a progress bar, or to re-render the same extent after a resize. Reports zero
     *  rendered measures when no session is active (of the measures a session would render now). */
    get IncrementalRenderProgress(): IRenderNextResult;
    /** All GraphicalMeasures (one per staff/instrument) at the measure position for source-measure index
     *  `sourceIndex`, walking BACK over collapsed multi-rest members (which have no graphical measure of their
     *  own) to the nearest real measure, not before the first measure of the incremental render. Empty if there is
     *  none at/before it. Used to resolve the last- / next-measure handles for renderNext(). */
    private graphicalMeasuresAtOrBefore;
    /**
     * Abandon any in-progress incremental render, so that the next renderNext() starts a new session (with the draw
     * range set then). Called automatically by render(), load() and clear(); call it directly only to cancel a session
     * yourself.
     */
    resetIncrementalRendering(): void;
    /**
     * Drive {@link renderNext} automatically from scrolling: render the next batch whenever the user scrolls
     * within ~1.5 viewports of the not-yet-rendered edge (the page bottom for the endless vertical format,
     * the right edge for RenderSingleHorizontalStaffline). Renders the first batch immediately if none has
     * been rendered yet, then keeps appending as the user scrolls, and detaches itself once all measures
     * are rendered (see {@link renderNext}). Re-enabling replaces any previous listener; reset/render/load also detach it.
     *
     * @param options batch size (as {@link renderNext}) plus an optional `scrollElement` -- the element whose
     *  scrolling drives loading. Defaults to the OSMD container for a single horizontal staffline (it scrolls
     *  horizontally) and to `window` otherwise (the page scrolls vertically).
     */
    enableIncrementalRenderingOnScroll(options?: IRenderNextOptions & {
        scrollElement?: HTMLElement | Window;
    }): void;
    /** Stop driving {@link renderNext} from scrolling (see {@link enableIncrementalRenderingOnScroll}). */
    disableIncrementalRenderingOnScroll(): void;
    /** Start a fresh incremental session for the measures render() draws (the draw range). Lazy needs the greedy,
     *  forward-stable builder so earlier systems keep their position as the prefix grows -- public OSMD is
     *  greedy-only, so that is already in effect (nothing to force). */
    private beginIncrementalRendering;
    /** Number of VISUAL measures in the source-measure range [from, toExcl): a multi-rest renders as one
     *  GraphicalMeasure when RenderMultipleRestMeasures collapses it, so it counts as one. */
    private visualMeasureCount;
    /** Source-measure index (inclusive) at which a batch of `visualCount` visual measures starting at source
     *  index `from` ends -- i.e. the toMeasureIndex to render this batch (multi-rests collapsed; see above). */
    private visualBatchEndIndex;
    /**
     * Lazy rendering (EngravingRules.LazyConsistentGraphic). Lays out the WHOLE prefix
     * [first..toMeasureIndex] of the draw range (see beginIncrementalRendering()) into ONE globally-consistent
     * graphic and draws only the systems that became stable since the previous batch, appending them into the
     * shared backend below what's already drawn.
     *
     * There is no per-batch vertical offset or seam-distance
     * computation: the real Y-layout already stacks and crisp-snaps every system at its final absolute
     * position, and the title space / first-system instrument names fall out of laying the prefix from
     * its first measure each time. The greedy builder is forward-stable -- every system except the LAST of a
     * prefix is *usually* forward-stable (an interior system keeps its position as the prefix grows), so
     * we skip drawing the already-drawn systems above and DEFER the last system of a non-final batch (it
     * is unstretched and shifts once it becomes an interior, stretched system next batch). But this is NOT
     * universal -- some scores re-position earlier systems by several px as later systems are added -- so
     * each batch first VERIFIES the drawn systems against their drawn Y (lazyDrawnSystemPositions) and, if any
     * moved, redraws the whole drawn range at the corrected positions (reconciliation). In the common
     * (stable) case nothing is redrawn. See export/inspect_prefix_stability.mjs / inspect_optionb_drawpos.mjs.
     * The layout can have several pages (NewPageAtXMLNewPageAttribute), each drawn into its own backend like in render():
     * the systems are counted through the pages, and a backend is added for each page the layout grows to.
     *
     * @returns the source-measure index at which the next batch should continue (past the last drawn system).
     */
    private renderAppendGrowing;
    /**
     * Lazy rendering: where the furthest octave shift ends that reaches into the systems a batch draws and ends in the last
     * system of its layout, or beyond. Such an octave shift needs a longer layout: its parts depend on the system it ends in,
     * e.g. it ends at a note there. The last system still grows (and is stretched once complete), and the end can be beyond the
     * layout, which cuts it off there, so the systems drawn now would be drawn with other parts. They aren't drawn again. An
     * octave shift without an end is ignored. A wedge doesn't need a longer layout: its part in a system depends only on that
     * system and the wedge's first one (see MusicSheetCalculator.calculateGraphicalContinuousDynamic()).
     * @param systems the systems of the layout, in order
     * @param drawToIdxExcl the index of the first system the batch doesn't draw
     * @returns the source-measure index of the furthest end in the last system or beyond, or -1 if there is none
     */
    private lazySpannerEndInLastSystem;
    /**
     * Lazy rendering: the systems of the laid-out pages that are drawn (see EngravingRules.MaxPageToDrawNumber), in order.
     * The systems a batch draws are counted through them (see MusicSheetDrawer.LazyDrawSystemsFromIndex).
     * @returns the systems of the pages in order
     */
    private lazyLaidOutSystems;
    /**
     * Lazy rendering: where the layout ends if it ends before a measure at the last system or page to draw
     * (EngravingRules.MaxSystemToDrawNumber, MaxPageToDrawNumber: drawUpToSystemNumber, drawUpToPageNumber). Then the layout has
     * all systems to draw, and the measures after them aren't drawn, like in render().
     * @param systems the systems of the layout that are drawn, in order (see lazyLaidOutSystems())
     * @param measureIndex the source-measure index of the last measure laid out
     * @returns the source-measure index of the last measure of the last system (of a multiple rest measure there: its last
     *  one), or undefined if the layout doesn't end before measureIndex at the last system or page to draw
     */
    private lazyLayoutEndBefore;
    /**
     * Lazy rendering for RenderSingleHorizontalStaffline (one staffline growing to the right, horizontal scroll).
     * The first batch lays the score (its draw range) out like render(), and each batch reuses that layout and draws only the
     * measures entering the drawn frontier (and the elements ending in them), so that the finished incremental render
     * looks like a normal render(). Laying out a growing prefix instead would move what is drawn already, e.g. a
     * higher note further right moves the staffline down, and the lyrics of a staffline are aligned at one height.
     * Laying out the whole staffline is fast anyway, drawing it is the expensive part, which stays lazy.
     * The layout can have several systems, e.g. with forced system breaks (NewSystemAtXMLNewSystemAttribute,
     * RenderXMeasuresPerLineAkaSystem) or where the staffline would be wider than SheetMaximumWidth, and pages
     * (NewPageAtXMLNewPageAttribute): the frontier advances through the measures of all systems in order, and each
     * system a batch reaches is drawn in its own x-window, from the system's previous frontier to its new one. A
     * system's first window is open to the left and its last one to the right, so that every element is drawn once,
     * also the ones beyond the first or last measure, like the instrument names or a long last chord symbol.
     * @param toMeasureIndex source-measure index up to which this batch draws (at least the next measure, so that
     *  the frontier always advances)
     * @param clearFirst whether this batch starts a new session: lays the score out and creates the backends
     * @returns the source-measure index at which the next batch should continue.
     */
    private renderAppendGrowingHorizontal;
    /**
     * Removes the backends (SVG or canvas) from the container and creates a new one for each page drawn.
     * @param pageWidth the width of the pages in pixels. By default the container's content width, read after removing the
     *  backends. An incremental render passes the width all its batches lay the sheet out at (see lazyLayoutWidth).
     */
    protected createOrRefreshRenderBackend(pageWidth?: number): void;
    /**
     * Returns the width in pixels of the container's content box, which the page fills.
     * The page is drawn inside the container's border and padding, so a page as wide as the container's offsetWidth
     * overflowed the container by their width.
     * Like offsetWidth, the width includes a vertical scrollbar of the container. clientWidth doesn't: it would change
     * when createOrRefreshRenderBackend() empties the container and the scrollbar disappears, after render() used it
     * for the layout. It's also 0 in generateImages_browserless, which only sets offsetWidth.
     */
    protected getContainerContentWidth(): number;
    exportSVG(): void;
    /** States whether the render() function can be safely called. */
    IsReadyToRender(): boolean;
    /**
     * Clears what OSMD has drawn on its canvas, and releases the loaded sheet, so that its memory can be freed while you keep
     * this instance: the sheet's data, its graphical objects and the SVG elements they drew.
     * To show a sheet again, call load() and render(). Until then, the cursors stay hidden, and moving them does nothing.
     * When you don't need the instance anymore, call dispose(), which removes OSMD's listeners on the window.
     */
    clear(): void;
    /**
     * Removes the listeners OSMD added to the window and the container's reference to this instance, and ends incremental
     * rendering (see renderNext()). Call it when you don't need this instance anymore but keep its container, e.g. to show
     * something else in it: with autoResize (on by default), the container keeps the instance in memory with its loaded and
     * rendered sheet, so that the drawing adapts to the window's size, and a resize would draw the sheet again, replacing the
     * container's content.
     * Without dispose(), an instance is freed together with its container, once the container was removed from the page and
     * your code references neither. Except while incremental rendering on scroll (enableIncrementalRenderingOnScroll()) hasn't
     * drawn the whole sheet: its scroll listener keeps the instance. And in browsers without WeakRef (Chrome before 84,
     * Firefox before 79, Safari before 14.1), the window's resize listener keeps it.
     * The drawing stays in the container. To remove it and free the sheet's memory while you keep the instance, call clear().
     * @example
     * osmd.dispose();
     * container.innerHTML = ""; // the instance can be garbage collected now, once your code doesn't reference it anymore
     */
    dispose(): void;
    /** Set OSMD rendering options using an IOSMDOptions object.
     *  Can be called during runtime. Also called by constructor.
     *  For example, setOptions({autoResize: false}) will disable autoResize even during runtime.
     */
    setOptions(options: IOSMDOptions): void;
    setColoringMode(options: IOSMDOptions): void;
    /**
     * Sets the logging level for this OSMD instance. By default, this is set to `warn`.
     *
     * @param: content can be `trace`, `debug`, `info`, `warn` or `error`.
     */
    setLogLevel(level: string): void;
    getLogLevel(): number;
    /**
     * Initialize this object to default values
     * FIXME: Probably unnecessary
     */
    protected reset(): void;
    /**
     * Attach the appropriate handler to the window.onResize event
     */
    protected autoResize(): void;
    /** Re-render and scroll back to previous scroll bar y position in percent.
     * If the document keeps the same height/length, the scroll bar position will basically be unchanged.
     * For example, if you scroll to the bottom of the page, resize by one pixel (or enable dark mode) and call this,
     *   for the human eye there will be no detectable scrolling or change in the scroll position at all.
     * If you just call render() instead of renderAndScrollBack(),
     *   it will scroll you back to the top of the page, even if you were scrolled to the bottom before. */
    renderAndScrollBack(): void;
    /**
     * Helper function for managing window's onResize events.
     * The window keeps its listeners as long as the page is open, so the listener reaches this instance only through a WeakRef:
     * it doesn't keep an instance in memory, with its sheet and drawing, that the app has dropped. Instead, the container keeps
     * the instance until the listener is removed (e.g. by dispose()), so that the drawing adapts to the window's size as long as
     * the container exists, also when the app keeps no reference to the instance, e.g. after
     * `const osmd = new OpenSheetMusicDisplay(div); osmd.load(url).then(() => osmd.render());` in a function.
     * In browsers without WeakRef, the listener keeps the instance.
     * @param startCallback is the function called when resizing starts
     * @param endCallback is the function called when resizing (kind-of) ends
     */
    protected handleResize(startCallback: () => void, endCallback: () => void): void;
    /**
     * Adds a listener to the window's resize events that calls the instance's resize callbacks (see handleResize()):
     * the start callback when a resize starts, the end callback once no resize event came for 200 ms.
     * The listener and its timers reach the instance only through `instanceRef`. When it's a WeakRef and the instance has been
     * freed, the listener removes itself at the next resize event.
     * It's made here, not in handleResize(), because all closures made in one function call share the variables that any of
     * them uses: next to the closures there that reference `this`, the listener would keep the instance in memory too.
     * @param instanceRef a WeakRef to the instance, or (without WeakRef) an object that keeps it
     * @returns a function that removes the listener
     */
    private static addWindowResizeListener;
    /** Enable or disable (hide) the cursor.
     * @param enable whether to enable (true) or disable (false) the cursor
     */
    enableOrDisableCursors(enable: boolean): void;
    createBackend(type: BackendType, page: GraphicalMusicPage, idOverride?: string): VexFlowBackend;
    /** Standard page format options like A4 or Letter, in portrait and landscape. E.g. PageFormatStandards["A4_P"] or PageFormatStandards["Letter_L"]. */
    static PageFormatStandards: {
        [type: string]: PageFormat;
    };
    static StringToPageFormat(pageFormatString: string): PageFormat;
    /** Sets page format by string. Used by setOptions({pageFormat: "A4_P"}) for example. */
    setPageFormat(formatId: string): void;
    setCustomPageFormat(width: number, height: number): void;
    set DrawSkyLine(value: boolean);
    get DrawSkyLine(): boolean;
    set DrawBottomLine(value: boolean);
    get DrawBottomLine(): boolean;
    set DrawBoundingBox(value: string);
    get DrawBoundingBox(): string;
    setDrawBoundingBox(value: string, render?: boolean): void;
    get AutoResizeEnabled(): boolean;
    /** Turns autoResize on or off, also during runtime, like setOptions({autoResize}).
     *  Off removes the window's resize listener and the container's reference to this instance (see handleResize());
     *  on adds them again.
     */
    set AutoResizeEnabled(value: boolean);
    get Zoom(): number;
    set Zoom(value: number);
    set FollowCursor(value: boolean);
    get FollowCursor(): boolean;
    set TransposeCalculator(calculator: ITransposeCalculator);
    get TransposeCalculator(): ITransposeCalculator;
    get Sheet(): MusicSheet;
    get Drawer(): VexFlowMusicSheetDrawer;
    get GraphicSheet(): GraphicalMusicSheet;
    get DrawingParameters(): DrawingParameters;
    get EngravingRules(): EngravingRules;
    /** Returns the version of OSMD this object is built from (the version you are using). */
    get Version(): string;
}
/** Options for {@link OpenSheetMusicDisplay.renderNext} (incremental, "system by system" rendering). */
export interface IRenderNextOptions {
    /** Target number of visual measures to advance per batch (a multi-rest counts as ONE -- it renders as a
     *  single GraphicalMeasure). Defaults to 8. This is a TARGET, not an exact count: a batch always ends on a
     *  whole music-system (line) boundary, so the system the measure count lands inside is deferred to the next
     *  batch (and a batch always renders at least one whole system). The measures actually drawn may therefore
     *  be somewhat fewer or more than this -- e.g. 8 lands part-way into a system, so only the complete systems
     *  before it are drawn; or if 8 doesn't fill one system, the layout extends until one whole system is ready.
     *  To see what was actually rendered, read the returned {@link IRenderNextResult}: `renderedMeasures` (total
     *  visual measures drawn so far, cumulative) and `lastRenderedMeasure` (the GraphicalMeasures at the last
     *  drawn measure position). Ignored when `systems` is set (and applicable). */
    measures?: number;
    /** How many whole music systems (lines) to render in this batch, instead of advancing by `measures`.
     *  Each batch then ends exactly on a system boundary. Takes precedence over `measures` when > 0.
     *  VERTICAL ONLY: a single horizontal staffline (RenderSingleHorizontalStaffline) is one system, so
     *  `systems` is ignored there and rendering falls back to `measures`. */
    systems?: number;
}
/** Progress returned by {@link OpenSheetMusicDisplay.renderNext}. Measure counts are visual (a multi-rest
 *  counts as one). */
export interface IRenderNextResult {
    /** True once the last measure to render has been rendered -- no more batches remain. The measures to render are the
     *  ones render() draws: the whole sheet, or the draw range (drawFromMeasureNumber, drawUpToMeasureNumber), up to the last
     *  system or page drawn (drawUpToSystemNumber, drawUpToPageNumber). */
    done: boolean;
    /** Visual measures rendered so far, cumulative across batches. */
    renderedMeasures: number;
    /** Total visual measures to render: those of the sheet, or of the draw range (see `done`). With drawUpToSystemNumber or
     *  drawUpToPageNumber, the measures after the last system or page drawn count until a batch's layout reaches it: where it
     *  ends depends on the layout. On a single horizontal staffline, the first batch lays out all of them. */
    totalMeasures: number;
    /** The last measure position rendered so far (highest measure index): all its GraphicalMeasures, one per
     *  staff/instrument (e.g. 3 for a voice + piano score). Empty if nothing has been rendered yet. They
     *  share one source measure -- reach it and its number/index via any element's `.parentSourceMeasure` and
     *  `.parentSourceMeasure.measureListIndex` (0-based). */
    lastRenderedMeasure: GraphicalMeasure[];
    /** The next measure position not yet rendered (the frontier): all its GraphicalMeasures (one per staff),
     *  or empty once `done`. Same `.parentSourceMeasure` / `.parentSourceMeasure.measureListIndex` accessors. */
    nextUnrenderedMeasure: GraphicalMeasure[];
}

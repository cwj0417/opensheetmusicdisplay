import { GraphicalCurve } from "./GraphicalCurve";
import { Slur } from "../VoiceData/Expressions/ContinuousExpressions/Slur";
import { PlacementEnum } from "../VoiceData/Expressions/AbstractExpression";
import { EngravingRules } from "./EngravingRules";
import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
export declare class GraphicalSlur extends GraphicalCurve {
    constructor(slur: Slur, rules: EngravingRules);
    slur: Slur;
    staffEntries: GraphicalStaffEntry[];
    placement: PlacementEnum;
    graceStart: boolean;
    graceEnd: boolean;
    private rules;
    SVGElement: Node;
    /** While calculateCurve() calculates the curve again past the fingerings of its start and end notes it ran into, see
     *  FingeringsRunInto. */
    private fingeringsRunInto;
    /** The far corners of the articulations of the start and end notes the slur clears, for clearObstacles(), see getYPastArticulations(),
     *  and, half SlurNoteHeadYOffset further in, of the accidentals of its end note once its end is as far out past them as it goes,
     *  see retryPastEndAccidentals(). */
    private articulationCorners;
    /** The articulations of the start and end notes that getYPastArticulations() left outside the slur, from the note outward,
     *  see placeArticulationsOutside(). */
    private articulationsOutside;
    /** The fingerings and measure numbers stacked on the articulations left outside the slur, see placeArticulationsOutside(). */
    private labelsOutside;
    /** While calculateCurve() calculates the curve again with the slur past every articulation of its start or end note (or both),
     *  see retryPastArticulationsOutside(). */
    private clearingEveryArticulationAt;
    /** While calculateCurve() calculates the curve again with its end further out, see EndPastAccidentals. */
    private endPastAccidentals;
    /** While calculateCurve() calculates the curve again over the measure numbers it ran into, see retryPastMeasureNumbers(). */
    private pastMeasureNumbers;
    /**
     * Compares the timespan of two Graphical Slurs
     * @param x
     * @param y
     */
    static Compare(x: GraphicalSlur, y: GraphicalSlur): number;
    /**
     *
     * @param rules
     */
    calculateCurve(rules: EngravingRules): void;
    /**
     * Calculates the bezier curve for a slur that crosses between two staves (e.g. left hand to right hand),
     * where the start and end notes lie on different stafflines that are stacked vertically within the same
     * MusicSystem. Unlike [[calculateCurve]], this runs at draw time, because it needs the final vertical
     * positions of both stafflines, which aren't fixed until the system Y-layout (after calculateSlurs()).
     *
     * The resulting bezier points are stored relative to the start note's staffline, so the regular drawSlur()
     * (which adds that staffline's absolute position) renders them at the correct absolute location.
     * @returns true if the curve was calculated and can be drawn, false otherwise (e.g. missing notes, or the
     * two staves are not in the same MusicSystem - a cross-staff plus cross-system slur is not supported).
     */
    calculateCurveCrossStaff(rules: EngravingRules): boolean;
    /**
     * Sums the relative positions from box up to (but not including) the given ancestor box, giving box's
     * position in the ancestor's coordinate system.
     */
    private positionRelativeToBox;
    /**
     * This method calculates the Start and End Positions of the Slur Curve.
     * @param slurStartNote
     * @param slurEndNote
     * @param staffLine
     * @param startX
     * @param startY
     * @param endX
     * @param endY
     * @param rules
     * @param skyBottomLineCalculator
     */
    private calculateStartAndEnd;
    /**
     * The y that the slur keeps its distance (SlurNoteHeadYOffset) from at its start or end note: beyond the note's articulations
     * on the slur's side that go between the note and the slur. Only staccato dots and wedges and tenuto lines do (Behind Bars
     * p. 121): another mark, e.g. an accent or a fermata, and the ones beyond it go outside the slur, which stays closer to the
     * note (p. 122), and placeArticulationsOutside() moves them beyond it, with the fingerings stacked on them. Unless that takes
     * them too far from the note: then the slur goes past them too (see retryPastArticulationsOutside()).
     * So does an ornament, e.g. a trill or a mordent, which wasn't taken into account: the slur started at the note under it and
     * could run through it (isc's comment on PR #1830: Bach, Invention No. 1, m. 14, rising steeply to the next notes; Mozart,
     * Sonata K. 545, m. 15 and 17, under the trill). The marks under it stay inside, see below.
     * The marks are taken where Vexflow draws them, e.g. the staccato of a note on a line in the next stave space.
     * The corners of the marks the slur clears go to articulationCorners, for clearObstacles() to keep the curve that far from them
     * over their width too: e.g. the end of a slur above a stem-up note is at the stem, right of a staccato at the stem end, and a
     * short slur rising to it ran over the dot lower than its end.
     * @param note the slur's start or end note
     * @param isStart whether it is the start note
     * @param headX the x of the center of the note head, relative to the staff line
     * @param y the border of the note's voice entry on the slur's side, relative to the staff line
     * @returns y, or the outer edge of the outermost of the marks inside the slur
     */
    private getYPastArticulations;
    /**
     * Adds the labels stacked on the articulations left outside the slur at its start or end note to labelsOutside, to move along
     * with them: over them and beyond them, the fingerings of the note's staff entry (MusicSheetCalculator.calculateFingerings()
     * places them after the articulations) and, above the first staffline of the system, a measure number
     * (MusicSheetCalculator.calculateMeasureNumberPlacement(), before the fingerings).
     * @param outside the articulations left outside the slur, from the note outward
     */
    private addLabelsOutside;
    /** Whether the articulation is a fermata, which goes outside a slur at its start or end also when the other marks don't
     *  (see getYPastArticulations()). */
    private static isFermata;
    /**
     * Keeps the articulations left outside the slur at its start or end (see getYPastArticulations()) that the curve passes
     * beyond inside it after all, as they are not in its way: e.g. a slur below a note high above the staff starts below the
     * staff (calculateStartAndEnd()), and an accent under the note is between them. From the note outward, up to the first one
     * the curve runs into or passes under. The labels stacked on them then don't move either (see placeArticulationsOutside()).
     * @returns For the start and the end, whether the curve passes one of those closer than SlurNoteHeadYOffset, the distance it
     *          keeps from the marks inside it, less a little (see retryPastArticulationsOutside()).
     */
    private keepPassedArticulationsInside;
    /** How far the curve passes beyond a box from left to right (relative to the staffline) whose far edge is far out (see
     *  getOutwardExtent()), at the closest over its width: negative if it runs into it or passes under it, Infinity if it doesn't
     *  reach over it. */
    private getDistanceBeyond;
    /**
     * Calculates the curve again if placeArticulationsOutside() would move the articulations left outside the slur at its start
     * or end too far from their note, this time with the slur past every articulation of that note but a fermata: if the slur
     * leaves the note so steeply that it gets more than articulationOutsideSlurMaxRise further out over them than at its tip, e.g.
     * a short slur rising to a high note (Behind Bars p. 122: accents at the ends of a slur go inside it when they would otherwise
     * be too far from the note to be immediately apparent; a pause goes outside, pp. 188-189). Or if the curve passes too close
     * beyond one it keeps inside (see keepPassedArticulationsInside()). Before retryPastEndFingerings(), whose fingerings are then
     * those of the new curve.
     * @param passedClose For the start and the end, whether the curve passes too close beyond an articulation it keeps inside.
     * @returns Whether the curve was calculated again (and added to the sky or bottom line), so there is nothing left to do.
     */
    private retryPastArticulationsOutside;
    /**
     * Moves the articulations of the start and end notes that getYPastArticulations() left outside the slur beyond it, where it
     * would run into them or pass closer to them than articulationOutsideSlurDistance, with the labels stacked on them, and adds
     * them to the sky or bottom line. Behind Bars p. 122: accents at the beginning and end of a slur go outside it, so that the
     * slur can remain closer to the note heads; pp. 188-189: so does a pause. Each mark stays at least as far from the one under
     * it as Vexflow put it.
     * The marks move by their y_shift, which VexFlowMusicSheetCalculator.calculateMeasureXLayout() resets for every render.
     * A measure number is added to the sky line after the slurs (MusicSheetCalculator.calculateMeasureNumberSkyline()).
     */
    private placeArticulationsOutside;
    /** How far the articulations left outside the slur at its start or end (see getYPastArticulations()), and the labels stacked
     *  on them, have to move out to keep articulationOutsideSlurDistance from the slur as drawn, over their width (0 if they do). */
    private getShiftOutside;
    /** How much further out the slur's outer edge gets over the articulations left outside it at its start or end, but fermatas,
     *  than at its tip (0 if there are none): see retryPastArticulationsOutside(). */
    private getRiseOutside;
    /** Points along the outer edge of the slur as VexFlowMusicSheetDrawer.drawSlur() draws it, the curve with its ends 0.05 and its
     *  control points 0.3 further out: their x, relative to the staffline, and how far out they are (see getOutwardExtent()). */
    private getOuterEdge;
    /** Adds a box from left to right (relative to the staffline) whose far edge is far out (see getOutwardExtent()) to the sky or
     *  bottom line, like calculateCurve() the curve. */
    private addToSkyBottomLine;
    /** Vexflow's types of the articulations that go inside a slur also at its start and end note (see getYPastArticulations()):
     *  staccato, staccatissimo (wedge), tenuto. */
    private static readonly articulationsInsideSlur;
    /** How far an articulation outside a slur at its start or end stays from it (see placeArticulationsOutside()). */
    private static readonly articulationOutsideSlurDistance;
    /** How much further out than at its tip a slur may get over the articulations outside it at its start or end: if it leaves the
     *  note more steeply, they go inside it (see retryPastArticulationsOutside()). Over an accent, a slur leaving the note gently
     *  rises up to about 0.45. */
    private static readonly articulationOutsideSlurMaxRise;
    /** How many times a slur's end goes further out past the accidentals of its end note at most (see retryPastEndAccidentals()). */
    private static readonly endPastAccidentalsMaxTries;
    /** Where a slur without end note ends (see Slur.HasUnattachedEnd), relative to the staffline: at the barline of its
     *  measure, before the end instructions like a repeat sign or a clef change at the measure end.
     *  If that's too close to the start note to look like a slur (e.g. before a repeat sign), it reaches a bit past the note,
     *  over the repeat dots, but not up to the barline.
     */
    private getUnattachedEndX;
    /**
     * This method calculates the placement of the Curve.
     * @param skyBottomLineCalculator
     * @param staffLine
     */
    private calculatePlacement;
    /**
     * Calculates the curve again if it runs into a fingering of its start or end note, with its start or end past those or beside them
     * (see placePastEndFingerings()), e.g. one right above the last note. calculateTopPoints() and calculateBottomPoints() leave
     * the start and end staff entries out: the tangents to something right above the start or end would be vertical.
     * Only the part of those staff entries the curve passes over counts, from the start or end to the entry's edge
     * towards the other end: not e.g. the fingering left of the stem a slur above a note with its stem up starts at.
     * @param startEntryX The edge of the start note's staff entry towards the end, relative to the staffline.
     * @param endEntryX The edge of the end note's staff entry towards the start.
     * @returns Whether the curve was calculated again (and added to the sky or bottom line), so there is nothing left to do.
     */
    private retryPastEndFingerings;
    /**
     * Calculates the curve again with its start and end past the fingerings of their notes if it starts or ends beside them
     * (see placePastEndFingerings()), low, and then runs into what the sky or bottom line holds where the curve isn't kept clear of
     * it (see getDepthIntoEnds()): e.g. the sharp of its end note, left of the fingering it ends beside, or the flat of the next
     * note, which it ran through from beside the fingering of its start note, or, for a slur from the previous staffline, the key
     * signature. Past the fingerings, the curve stays further out, as before PR #1830 (isc's comment on PR #1830: Chopin, Ballade
     * No. 1, m. 83, m. 108 and m. 111, Nocturne op. 9 no. 2, m. 27). Unless it runs in about as deep from there: then it was something
     * else, e.g. a slur ending above the start note, and the curve goes beside them again.
     * @param beside Whether the curve starts or ends beside the fingerings.
     * @param startEntryX The x where the sky or bottom line points of calculateTopPoints() or calculateBottomPoints() start.
     * @param endEntryX The x where they end.
     * @returns Whether the curve was calculated again (and added to the sky or bottom line), so there is nothing left to do.
     */
    private retryPastBesideFingerings;
    /**
     * Calculates the curve again with its end further out (up for a slur above) if it runs into the accidentals of the chord it
     * ends at (see getEndAccidentals()), or passes closer than half SlurNoteHeadYOffset to them: calculateTopPoints() and
     * calculateBottomPoints() stop at the left border of the end staff entry, left of the accidentals, so the curve ran into e.g.
     * the sharp of a high note it rises to steeply, or the flat of a note it comes down to (sschmidTU's review of PR #1832: Haydn,
     * Concertante, m. 161; Telemann, Sonata No. 1, Dolce, m. 13; Actor Prelude, m. 16; Schubert, An die Musik, m. 16).
     * Not by keeping the curve clear of them with the end at the note: right next to the end, that takes a tangent steeper than
     * SlurTangentMaxAngle (see clearObstacles()), or, steeper tangents counting them in, a high arch over the whole slur.
     * Moving the end out moves the curve near it about as far, so it goes out by how deep the curve ran in, and again if the
     * curve still does, a few times at most. But not further out than the accidentals' far edge plus half SlurNoteHeadYOffset,
     * half as far from them as from the note: rising steeply to its end, the curve is lower over the accidental than there, and
     * the end would float far from the note (Haydn, m. 161). From there, clearObstacles() keeps the curve that far from them,
     * like from the articulations at its start and end (see articulationCorners). A slur that keeps as much space from an
     * accidental as from a note ends far from its note, e.g. a slur below a note with a sharp (Schumann, The Wild Horseman,
     * m. 3), and arches more than needed.
     * @returns Whether the curve was calculated again (and added to the sky or bottom line), so there is nothing left to do.
     */
    private retryPastEndAccidentals;
    /**
     * The accidentals of the chord the slur ends at: their left and right, relative to the staffline, and their far edges from the
     * staff on the slur's side, as distances outward (see getOutwardExtent()). Where Accidental.draw() renders them: the glyph's
     * right edge at the x of getModifierStartXY() plus the accidental's x shift, and a cautionary one's parentheses on either side.
     */
    private getEndAccidentals;
    /**
     * How far the curve runs into what the sky or bottom line holds where it isn't kept clear of it (calculateTopPoints() and
     * calculateBottomPoints() leave it out), or passes closer than half SlurNoteHeadYOffset to it (0 if it doesn't): over the
     * start and end staff entries, between its start and startEntryX and between endEntryX and its end, and, for a slur from the
     * previous staffline, over the clef and the key signature it starts at (see calculateStartAndEnd()). Not over the fingerings
     * of those staff entries, nor the articulations left outside the slur, which move out of its way (see
     * placeArticulationsOutside()).
     * @param startEntryX The x where the sky or bottom line points of calculateTopPoints() or calculateBottomPoints() start.
     * @param endEntryX The x where they end.
     */
    private getDepthIntoEnds;
    /** The fingerings of the note's staff entry that the curve passes closer than SlurNoteHeadYOffset to, or through, from fromX
     *  to toX (relative to the staffline). */
    private getFingeringsRunInto;
    /** Whether the fingering is stacked on articulations left outside the slur, which it moves along with, beyond the slur (see
     *  placeArticulationsOutside()): the slur doesn't go past it. */
    private isFingeringOutside;
    /** Whether the curve passes closer than margin to, or through, a box from left to right whose outward extent (see
     *  getOutwardExtent()) is near to far, from fromX to toX (relative to the staffline). */
    private runsInto;
    /** How far out the curve gets (see getOutwardExtent()), at its furthest point. */
    private getFurthestOut;
    /** The near and far edges of the box from the staff on the slur's side, as distances outward (up for a slur above). */
    private getOutwardExtent;
    /**
     * Where the start or end goes if the curve ran into fingerings of its note (see retryPastEndFingerings()): past them
     * (clearEndFingerings()), or beside them, on the note head's side (on the stem's side, it starts at the stem's tip, where a beam
     * can be): left of their column at the end, right of it at the start. Beside them for a slur from a note to the next one that
     * would then climb by more than half its width, which keeps such a short slur close to its notes, below the fingerings, e.g. from
     * one chord of 16ths to the next. And for a slur whose start or end would be further out past them than the curve got without
     * them, unless it passes over fingerings of the notes between anyway: the slur would only fall from there, lopsided, e.g. from
     * the fingering on the staccato of the first of four chords with staccatos (isc's comment on PR #1828). Unless beside them, the
     * curve ran into what is at its ends (see retryPastBesideFingerings()).
     * @param x The start's or end's x.
     * @param y The start's or end's y.
     * @param entryX The edge of the note's staff entry towards the other end, relative to the staffline.
     * @param otherX The other end's x.
     * @param runInto The fingerings of the note's staff entry the curve ran into, see retryPastEndFingerings().
     * @param toNextNote Whether the slur goes from a note to the next one, both in this staffline.
     */
    private placePastEndFingerings;
    /**
     * Moves the start or the end of the slur away from the staff (up for a slur above, down for one below) past the given
     * fingerings of its note, which the curve ran into, and any stacked on them, keeping the distance from them it keeps from
     * its note (SlurNoteHeadYOffset).
     * @param note The slur's start or end note, if it is in this staffline.
     * @param fromX The left end of the part of the note's staff entry the curve passes over, relative to the staffline.
     * @param toX Its right end.
     * @param y The start's or end's y.
     * @param runInto The fingerings of the note's staff entry the curve ran into, see retryPastEndFingerings().
     * @returns The y of the start or end past the fingerings.
     */
    private clearEndFingerings;
    /** The points of the sky or bottom line for clearObstacles(): each sample at both its edges, since what it holds can be
     *  anywhere along it, e.g. the edge of a fingering under a slur rising steeply from its start. */
    private getObstacles;
    /**
     * Raises the control points where the curve passes closer than SlurNoteHeadYOffset to an obstacle, e.g. the fingering of
     * the note next to the start. The tangents only keep the lines from the start and end through the control points above the
     * obstacles, and the curve runs below those lines, the more so near the start and end.
     * Coordinates as in calculateControlPoints(): the start at the origin, the end on the x-axis, the obstacles above it.
     * Raising a control point doesn't move the curve sideways: the curve's height at an x grows linearly with the control
     * points' heights. But it raises the whole curve, by much for an obstacle next to the start or end, where the control point
     * has only a small share in the curve. So if that would make the curve more than 0.5 higher, the tangents get steeper first
     * (steepenTangents()), which brings the curve up near its ends without raising its top.
     * Only the obstacles under the tangents count: the curve can reach them, running between them and its tangents.
     * The sky or bottom line doesn't say what is under its points: if the curve, raised, runs further into a fingering it passed
     * under or beside, it stays as it was (e.g. under a fingering on the stem of another voice, in the middle of a short slur).
     * The fingerings of the start and end notes are retryPastEndFingerings()'s.
     * @param endX The end point's x.
     * @param obstacles The sky- or bottom line points between the start and end staff entries.
     * @param fingerings The corners of the fingerings of the notes between the start and end, see getFingeringCorners().
     */
    private clearObstacles;
    /**
     * The top corners of the measure numbers the curve ran into (see retryPastMeasureNumbers()), relative to the staffline, for
     * clearObstacles(), SlurNoteHeadYOffset further in: clearObstacles() keeps the curve that far from the corners, and it only
     * needs to pass over the number.
     */
    private getMeasureNumberCorners;
    /**
     * Calculates the curve again over the measure numbers above the staffline (the system's first) it ran into, if any: e.g. a
     * long slur coming down to its end note right after the number of the end note's measure. The number stays above its
     * barline, where calculateMeasureNumberPlacement() placed it (before the slurs), and the slur goes over it, as close as it
     * fits: clearObstacles() raises the curve only where the number is, the more so steepening its tangents.
     * Only the numbers it ran into: the numbers are not in the sky line the slurs are shaped by (calculateMeasureNumberSkyline()
     * adds them after the slurs), so that a number doesn't reshape a slur that passes over or under it anyway, e.g. a slur
     * ending at a low note after the number, or one from the previous system starting just over the number above the clef.
     * Not the numbers it can't get over, rising to them from its start or end at the steepest tangent allowed (SlurTangentMaxAngle,
     * see getRaisedControlPoints()): e.g. a slur from the previous system starting at the height of the number above the clef,
     * or one ending at a note right after the number, low in the staff; only moving its start or end could clear them. Nor the
     * ones moved outward with the articulations left outside the slur (labelsOutside).
     * If the curve still runs into a number then (e.g. limited by SlurTangentMaxAngle near its end, or by a fingering it would run
     * into, see clearObstacles()), it is calculated again without it: as before, rather than reshaped for nothing.
     * Hardly costs any time (2026-11, Chrome): almost every call stops at the reach test, and in the test samples it calculates
     * at most 9 curves again per render (Haydn, Concertante: 271 curves), within the noise of the render time. But it might
     * not be the best solution (e.g. it can't clear a number at a slur's end note, which only moving the end could), and can
     * be removed for a better one, e.g. one that places the numbers and the slurs together. Another option for the numbers it
     * leaves is to move the slur's start or end point away from the number, like retryPastEndAccidentals() does for the end
     * note's accidentals. But that changes more than the overlap: e.g. a start further left and an end further right make a
     * longer slur, an aesthetic change some might not like. Going over the number only changes the arc where the number is.
     * @returns Whether the curve was calculated again (and added to the sky line), so there is nothing left to do.
     */
    private retryPastMeasureNumbers;
    /**
     * The highest and lowest y of the curve between left and right, relative to the staffline like the curve's points (sampled
     * every 1/1000 of the curve), or undefined where the curve doesn't pass between them.
     */
    getYRangeBetween(left: number, right: number): {
        top: number;
        bottom: number;
    } | undefined;
    /** The corners of the fingerings of the notes between the start and end, relative to the staffline (see calculateFingerings()). */
    private getFingeringCorners;
    /** How far the curve runs into the box with these corners, from its nearest edge (0 if it doesn't; coordinates as in clearObstacles()). */
    private getDepthIn;
    /** Where the curve passes closer than SlurNoteHeadYOffset to the obstacles, and by how much (coordinates as in clearObstacles()). */
    private getMisses;
    /**
     * The heights of the control points at which the curve clears the misses, as low as possible: a miss in the first half of
     * the curve raises the start control point, one in the second half the end one, by as much as the miss that needs the most,
     * after what the start control point already gave. Not past the steepest tangent allowed (calculateAngles()): what is right
     * next to an end is out of the curve's reach. Coordinates as in clearObstacles().
     */
    private getRaisedControlPoints;
    /**
     * Moves the start control point towards the start and the end one towards the end, as far as the curve needs to clear the
     * misses before and after its top, but to no steeper tangents than SlurTangentMaxAngle - 10, leaving room to raise them.
     * The curve's height at t only depends on the control points' heights, so the curve then reaches the height it needs sooner
     * after the start (or later before the end), without its top getting higher. Coordinates as in clearObstacles().
     */
    private steepenTangents;
    /** The highest point of the curve (its t and its height), with the control points at the heights startY and endY
     *  (coordinates as in clearObstacles()). */
    private getCurveTop;
    /**
     * This method calculates the Points between Start- and EndPoint (case above).
     * @param start
     * @param end
     * @param staffLine
     * @param skyBottomLineCalculator
     */
    private calculateTopPoints;
    /**
     * This method calculates the Points between Start- and EndPoint (case below).
     * @param start
     * @param end
     * @param staffLine
     * @param skyBottomLineCalculator
     */
    private calculateBottomPoints;
    /**
     * This method calculates the maximum slope between StartPoint and BetweenPoints.
     * @param points
     * @param start
     * @param end
     */
    private calculateMaxLeftSlope;
    /**
     * This method calculates the maximum slope between EndPoint and BetweenPoints.
     * @param points
     * @param start
     * @param end
     */
    private calculateMaxRightSlope;
    /**
     * This method returns the maximum (meaningful) points.Y.
     * @param points
     */
    private getPointListMaxY;
    /**
     * This method calculates the translated and rotated PointsList (case above).
     * @param points
     * @param startX
     * @param startY
     * @param rotationMatrix
     */
    private calculateTranslatedAndRotatedPointListAbove;
    /**
     * This method calculates the translated and rotated PointsList (case below).
     * @param points
     * @param startX
     * @param startY
     * @param rotationMatrix
     */
    private calculateTranslatedAndRotatedPointListBelow;
    /**
     * This method calculates the HeightWidthRatio between the MaxYpoint (from the points between StartPoint and EndPoint)
     * and the X-distance from StartPoint to EndPoint.
     * @param endX
     * @param points
     */
    private calculateHeightWidthRatio;
    /**
     * This method calculates the 2 ControlPoints of the SlurCurve.
     * @param endX
     * @param startAngle
     * @param endAngle
     * @param points
     */
    private calculateControlPoints;
    /**
     * This method calculates the angles for the Curve's Tangent Lines.
     * @param leftAngle
     * @param rightAngle
     * @param startLineSlope
     * @param endLineSlope
     * @param maxAngle
     */
    private calculateAngles;
    private static degreesToRadiansFactor;
}

import { StaffLine } from "./StaffLine";
import { InstantaneousDynamicExpression } from "../VoiceData/Expressions/InstantaneousDynamicExpression";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { AbstractGraphicalExpression } from "./AbstractGraphicalExpression";
export declare class GraphicalInstantaneousDynamicExpression extends AbstractGraphicalExpression {
    protected mInstantaneousDynamicExpression: InstantaneousDynamicExpression;
    protected mMeasure: GraphicalMeasure;
    /** Whether words of the same time are drawn on this dynamic's line, before or after it
     *  (see MusicSheetCalculator.placeWordsBesideSameTimeDynamic()). */
    HasWordsBeside: boolean;
    constructor(instantaneousDynamic: InstantaneousDynamicExpression, staffLine: StaffLine, measure: GraphicalMeasure);
    get InstantaneousDynamic(): InstantaneousDynamicExpression;
    updateSkyBottomLine(): void;
}

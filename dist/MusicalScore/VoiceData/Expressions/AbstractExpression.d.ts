import { SourceMeasure } from "../SourceMeasure";
export declare class AbstractExpression {
    protected placement: PlacementEnum;
    parentMeasure: SourceMeasure;
    ColorXML: string;
    /** The xml:lang of the expression's words, see Label.language. */
    language: string;
    /** The vertical position the file gives the words or dynamic, in tenths of a staff space, up from the top line of the
     *  staff: MusicXML default-y plus relative-y. Undefined without a default-y (see ExpressionReader.readYPositionXml()). */
    YPositionXml: number;
    constructor(placement: PlacementEnum);
    protected static isStringInStringList(stringList: Array<string>, inputString: string): boolean;
    /** Placement of the expression */
    get Placement(): PlacementEnum;
    static PlacementEnumFromString(placementString: string): PlacementEnum;
}
export declare enum PlacementEnum {
    Above = 0,
    Below = 1,
    Left = 2,
    Right = 3,
    NotYetDefined = 4,
    AboveOrBelow = 5
}

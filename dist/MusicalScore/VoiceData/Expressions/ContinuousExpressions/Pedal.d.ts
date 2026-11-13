import { MultiExpression } from "../MultiExpression";
export declare class Pedal {
    constructor(line?: boolean, sign?: boolean);
    private line;
    private sign;
    StaffNumber: number;
    ParentStartMultiExpression: MultiExpression;
    ParentEndMultiExpression: MultiExpression;
    ChangeEnd: boolean;
    ChangeBegin: boolean;
    /** Whether the pedal ends at the stave end (and not before the endNote) */
    EndsStave: boolean;
    /** Whether the pedal begins at the stave beginning (and not before the startNote - e.g. for whole measure rest) */
    BeginsStave: boolean;
    /** Whether the pedal line begins without its start hook (the downstroke), e.g. MusicXML `<pedal type="resume">`:
     *  where a discontinued line goes on, or after a Ped. sign (sign="yes": the Ped. + line style, which has no start hook anyway). */
    BeginsWithoutHook: boolean;
    /** Whether the pedal line ends without its end hook (the lift), e.g. MusicXML `<pedal type="discontinue">`,
     *  where a pedal stopped there would draw the hook. */
    EndsWithoutHook: boolean;
    get IsLine(): boolean;
    get IsSign(): boolean;
}

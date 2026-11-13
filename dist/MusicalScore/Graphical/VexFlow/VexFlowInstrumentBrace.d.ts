import { VexFlowInstrumentBracket } from "./VexFlowInstrumentBracket";
import { VexFlowStaffLine } from "./VexFlowStaffLine";
/**
 * Class that defines a instrument brace at the beginning of a line: of a part with several staves, or of a part group with the
 * group symbol brace.
 */
export declare class VexFlowInstrumentBrace extends VexFlowInstrumentBracket {
    constructor(firstVexFlowStaffLine: VexFlowStaffLine, lastVexFlowStaffLine: VexFlowStaffLine, column?: number);
}

import { MusicSheet } from "../../MusicSheet";
import { Fraction } from "../../../Common/DataObjects/Fraction";
import { Instrument } from "../../Instrument";
import { MultiExpression } from "../../VoiceData/Expressions/MultiExpression";
import { IXmlElement } from "../../../Common/FileIO/Xml";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
export declare class ExpressionReader {
    private musicSheet;
    private placement;
    private soundTempo;
    private soundDynamic;
    private offsetDivisions;
    private staffNumber;
    private globalStaffIndex;
    private directionTimestamp;
    private currentMultiTempoExpression;
    private openContinuousDynamicExpressions;
    private openContinuousTempoExpression;
    private activeInstantaneousDynamic;
    private openOctaveShift;
    private lastWedge;
    private WedgeYPosXml;
    private openPedal;
    constructor(musicSheet: MusicSheet, instrument: Instrument, staffNumber: number);
    getMultiExpression: MultiExpression;
    readExpressionParameters(xmlNode: IXmlElement, currentInstrument: Instrument, divisions: number, inSourceMeasureCurrentFraction: Fraction, inSourceMeasureFormerFraction: Fraction, currentMeasureIndex: number, ignoreDivisionsOffset: boolean): void;
    read(directionNode: IXmlElement, currentMeasure: SourceMeasure, inSourceMeasureCurrentFraction: Fraction, inSourceMeasurePreviousFraction?: Fraction): void;
    /** Usually called at end of last measure. */
    closeOpenExpressions(sourceMeasure: SourceMeasure, timestamp: Fraction): void;
    addOctaveShift(directionNode: IXmlElement, currentMeasure: SourceMeasure, endTimestamp: Fraction): void;
    addPedalMarking(directionNode: IXmlElement, currentMeasure: SourceMeasure, endTimestamp: Fraction): void;
    private endOpenPedal;
    private initialize;
    private readPlacement;
    private readExpressionPlacement;
    private readPosition;
    private interpretInstantaneousDynamics;
    private interpretWords;
    private readNumber;
    private interpretWedge;
    private interpretRehearsalMark;
    private createNewMultiExpressionIfNeeded;
    private createNewTempoExpressionIfNeeded;
    private addWedge;
    private fillMultiOrTempoExpression;
    private createExpressionFromString;
    private closeOpenContinuousDynamic;
    private closeOpenContinuousTempo;
    private checkIfWordsNodeIsRepetitionInstruction;
    private hasDigit;
}

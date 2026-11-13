import { MusicSheet } from "./MusicSheet";
/** The symbol drawn left of a part group's staves: MusicXML's group-symbol (none if not given). */
export declare enum GroupSymbol {
    None = 0,
    Brace = 1,
    Line = 2,
    Bracket = 3,
    Square = 4
}
export declare class InstrumentalGroup {
    constructor(name: string, musicSheet: MusicSheet, parent: InstrumentalGroup);
    private name;
    private abbreviation;
    private printName;
    private printAbbreviation;
    private groupSymbol;
    private musicSheet;
    private parent;
    private instrumentalGroups;
    get InstrumentalGroups(): InstrumentalGroup[];
    get Parent(): InstrumentalGroup;
    get Name(): string;
    set Name(value: string);
    get Abbreviation(): string;
    set Abbreviation(value: string);
    get PrintName(): boolean;
    set PrintName(value: boolean);
    get PrintAbbreviation(): boolean;
    set PrintAbbreviation(value: boolean);
    /** The symbol drawn left of the group's staves (MusicXML group-symbol). None, the default, draws nothing. */
    get GroupSymbol(): GroupSymbol;
    set GroupSymbol(value: GroupSymbol);
    get GetMusicSheet(): MusicSheet;
}

import { W3oContract } from "./W3oContract";
export declare abstract class W3oToken {
    get symbol(): string;
    get address(): string;
    abstract isSystemToken(): boolean;
    abstract getIconUrl(): string;
    abstract getDisplayName(): string;
    abstract getSymbol(): string;
    abstract getDecimals(): number;
    abstract getUSDPrice(): number;
    abstract getContract(): W3oContract;
    abstract snapshot(): any;
}

import { LoggerContext, W3oContractManager, W3oNetwork, W3oNetworkSettings, W3oToken } from "@vapaee/w3o-core";
import { Observable } from "rxjs";
export declare class AntelopeNetwork extends W3oNetwork {
    constructor(settings: W3oNetworkSettings, parent?: LoggerContext);
    get w3oVersion(): string;
    get w3oName(): string;
    get w3oRequire(): string[];
    snapshot(): any;
    createContractManager(network: W3oNetwork, parent: LoggerContext): W3oContractManager;
    getSystemToken(): W3oToken;
    getTokensList(): W3oToken[];
    updateState(): Observable<void>;
}

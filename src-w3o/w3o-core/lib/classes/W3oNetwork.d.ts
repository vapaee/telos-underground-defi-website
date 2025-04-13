import { Observable } from 'rxjs';
import { LoggerContext, W3oContractManager, W3oModule, W3oToken } from '.';
import { W3oNetworkSettings, W3oNetworkType } from '../types';
export declare abstract class W3oNetwork extends W3oModule {
    readonly settings: W3oNetworkSettings;
    private __contractCtrl;
    constructor(settings: W3oNetworkSettings, parent: LoggerContext);
    get type(): W3oNetworkType;
    get name(): string;
    getNetworkType(): W3oNetworkType;
    getToken(token: string, parent: LoggerContext): W3oToken | null;
    getContractManager(): W3oContractManager;
    abstract createContractManager(network: W3oNetwork, parent: LoggerContext): W3oContractManager;
    abstract getSystemToken(): W3oToken;
    abstract getTokensList(): W3oToken[];
    abstract updateState(): Observable<void>;
    abstract snapshot(): any;
}

import { BehaviorSubject } from 'rxjs';
import { LoggerContext, W3oNetwork } from '.';
import { W3oGlobalSettings, W3oNetworkInstance, W3oNetworkName } from '../types';
export declare class W3oNetworkManager implements W3oNetworkInstance {
    private __initialized;
    private __networks;
    onNetworkChange$: BehaviorSubject<W3oNetworkName | null>;
    constructor(settings: W3oGlobalSettings, parent: LoggerContext);
    get currentNetworkName(): string | null;
    get current(): W3oNetwork;
    get list(): W3oNetwork[];
    init(parent?: LoggerContext): void;
    addNetwork(network: W3oNetwork, parent: LoggerContext): void;
    getNetwork(name: W3oNetworkName, parent: LoggerContext): W3oNetwork;
    setCurrentNetwork(name: W3oNetworkName, parent: LoggerContext): void;
    getCurrentNetwork(): W3oNetwork;
    updateState(): Promise<void>;
    snapshot(): any;
}

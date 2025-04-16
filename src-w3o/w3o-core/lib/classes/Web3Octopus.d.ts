import { BehaviorSubject } from 'rxjs';
import { W3oGlobalSettings, W3oInstance, W3oIServices, W3oNetworkSupportSettings } from '../types';
import { LoggerContext } from './Logger';
import { W3oAuthManager } from './W3oAuthManager';
import { W3oService } from './W3oService';
import { W3oNetworkManager } from './W3oNetworkManager';
import { W3oSessionManager } from './W3oSessionManager';
import { W3oModuleManager } from './W3oModuleManager';
interface WithSnapshot {
    snapshot(): any;
}
export declare class Web3Octopus<Tw3o extends W3oIServices & WithSnapshot> implements W3oInstance {
    private __initialized;
    onInitialized$: BehaviorSubject<boolean>;
    private __services;
    private __serviceCtrl;
    private __networkCtrl;
    private __sessionCtrl;
    private __authCtrl;
    private __meduleCtrl;
    private static __instance;
    static get instance(): W3oInstance;
    constructor(parent?: LoggerContext);
    get sessions(): W3oSessionManager;
    get networks(): W3oNetworkManager;
    get auth(): W3oAuthManager;
    get modules(): W3oModuleManager;
    get services(): Tw3o;
    addNetworkSupport(support: W3oNetworkSupportSettings, parent?: LoggerContext): void;
    init(settings?: W3oGlobalSettings, parent?: LoggerContext): void;
    registerServices(services: W3oService[], parent?: LoggerContext): void;
    private createService;
    snapshot(): any;
}
export {};

import { LoggerContext, W3oModuleManager, W3oNetworkManager, W3oSessionManager } from '.';
import { W3oGlobalSettings, W3oInstance, W3oIServices, W3oNetworkSupportSettings } from '../types';
import { W3oAuthManager } from './W3oAuthManager';
import { W3oService } from './W3oService';
interface WithSnapshot {
    snapshot(): any;
}
export declare class Web3Octopus<Tw3o extends W3oIServices & WithSnapshot> implements W3oInstance {
    private __initialized;
    private __services;
    private __serviceCtrl;
    private __networkCtrl;
    private __sessionCtrl;
    private __authCtrl;
    private __meduleCtrl;
    private static __instance;
    static get instance(): W3oInstance;
    constructor(settings?: W3oGlobalSettings, parent?: LoggerContext);
    get sessions(): W3oSessionManager;
    get networks(): W3oNetworkManager;
    get auth(): W3oAuthManager;
    get modules(): W3oModuleManager;
    get services(): Tw3o;
    addNetworkSupport(support: W3oNetworkSupportSettings, parent?: LoggerContext): void;
    init(parent?: LoggerContext): void;
    registerServices(services: W3oService[], parent?: LoggerContext): void;
    private createService;
    snapshot(): any;
}
export {};

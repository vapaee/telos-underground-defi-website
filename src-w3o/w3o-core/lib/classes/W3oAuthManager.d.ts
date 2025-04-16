import { Observable } from 'rxjs';
import { W3oAddress, W3oAuthInstance, W3oAuthSupportName, W3oGlobalSettings, W3oNetworkName, W3oNetworkType } from '../types';
import { LoggerContext } from './Logger';
import { W3oAuthSupport } from './W3oAuthSupport';
import { W3oNetwork } from './W3oNetwork';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oSession } from './W3oSession';
interface W3oOctopusInstanceI {
    networks: {
        getNetwork(name: W3oNetworkName, parent: LoggerContext): W3oNetwork;
    };
    sessions: {
        createCurrentSession(address: W3oAddress, authenticator: W3oAuthenticator, network: W3oNetwork, parent: LoggerContext): W3oSession;
    };
}
export declare class W3oAuthManager implements W3oAuthInstance {
    private instance;
    private __initialized;
    private __byType;
    private __byName;
    constructor(instance: W3oOctopusInstanceI, settings: W3oGlobalSettings, parent: LoggerContext);
    init(parent: LoggerContext): void;
    addAuthSupport(auth: W3oAuthSupport, parent: LoggerContext): void;
    get(name: string): W3oAuthSupport;
    list(type: string): W3oAuthSupport[];
    createAuthenticator(name: W3oAuthSupportName, parent: LoggerContext): W3oAuthenticator;
    login(network: W3oNetworkType, authName: W3oAuthSupportName, parent: LoggerContext): Observable<W3oSession>;
    snapshot(): any;
}
export {};

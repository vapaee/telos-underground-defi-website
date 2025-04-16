import { BehaviorSubject } from 'rxjs';
import { W3oAddress, W3oAuthSupportName, W3oGlobalSettings, W3oNetworkName, W3oSessionInstance } from '../types';
import { LoggerContext } from './Logger';
import { W3oNetwork } from './W3oNetwork';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oSession } from './W3oSession';
interface W3oOctopusInstanceI {
    networks: {
        onNetworkChange$: BehaviorSubject<string | null>;
        getNetwork(name: W3oNetworkName, parent: LoggerContext): W3oNetwork;
    };
    auth: {
        createAuthenticator(name: W3oAuthSupportName, parent: LoggerContext): W3oAuthenticator;
    };
}
export declare class W3oSessionManager implements W3oSessionInstance {
    private instance;
    private __initialized;
    private __sessions;
    private __multiSession;
    private __autologin;
    onSessionChange$: BehaviorSubject<string | null>;
    constructor(instance: W3oOctopusInstanceI, settings: W3oGlobalSettings, parent: LoggerContext);
    get currentSessionId(): string | null;
    get current(): W3oSession;
    get list(): W3oSession[];
    get isMultiSession(): boolean;
    init(parent: LoggerContext): void;
    createSession(address: W3oAddress, authenticator: W3oAuthenticator, network: W3oNetwork, parent: LoggerContext): W3oSession;
    createCurrentSession(address: W3oAddress, authenticator: W3oAuthenticator, network: W3oNetwork, parent: LoggerContext): W3oSession;
    getSession(id: string, parent: LoggerContext): W3oSession;
    getSessions(parent: LoggerContext): W3oSession[];
    deleteSession(id: string, parent: LoggerContext): void;
    setCurrentSession(id: string, parent: LoggerContext): void;
    getCurrentSession(parent: LoggerContext): W3oSession;
    saveSessions(parent: LoggerContext): void;
    loadSessions(parent: LoggerContext): void;
    snapshot(): any;
}
export {};

import { BehaviorSubject } from 'rxjs';
import { LoggerContext, W3oAuthenticator, W3oNetwork, W3oSession } from '.';
import { W3oAddress, W3oGlobalSettings, W3oSessionInstance } from '../types';
export declare class W3oSessionManager implements W3oSessionInstance {
    private __initialized;
    private __sessions;
    private __multiSession;
    private __autologin;
    onSessionChange$: BehaviorSubject<string | null>;
    constructor(settings: W3oGlobalSettings, parent: LoggerContext);
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

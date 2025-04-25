// w3o-core/src/classes/W3oSessionManager.ts

import { BehaviorSubject, defer, mapTo, Observable, of, tap, throwError } from 'rxjs';

import {
    W3oAddress,
    W3oGlobalSettings,
    W3oInstance,
    W3oSessionInstance
} from '../types';
import { Logger, LoggerContext } from './Logger';
import { W3oNetwork } from './W3oNetwork';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oSession } from './W3oSession';
import { W3oError } from './W3oError';

const logger = new Logger('W3oSessionManager');

interface W3oStoredSessions {
    currentSessionId: string | null;
    sessions: string[];
}

const STORAGE_KEY = 'w3o-sessions';

export class W3oSessionManager implements W3oSessionInstance {
    private __initialized = false;
    private __sessions: { [key: string]: W3oSession } = {};
    private __multiSession: boolean;
    private __autologin = false;

    public current$: BehaviorSubject<W3oSession | null> = new BehaviorSubject<W3oSession | null>(null);

    octopus!: W3oInstance;

    /**
     * Initializes the session manager with settings and sets up subscription for session changes.
     */
    constructor(
        settings: W3oGlobalSettings,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', { settings }, parent);
        this.__multiSession = settings.multiSession;
        this.__autologin = settings.autoLogin;

        this.current$.subscribe((session) => {
            context.log('session change detected', { session });
            this.saveSessions(context);
        });
    }

    /**
     * Returns the current session ID, or null if none is set.
     */
    get currentSessionId(): string | null {
        const session = this.current$.value;
        return session ? session.id : null;
    }

    /**
     * Returns the current session instance, or throws if not found.
     */
    get current(): W3oSession | null {
        return this.current$.value;
    }

    /**
     * Returns a list of all stored session instances.
     */
    get list(): W3oSession[] {
        return Object.values(this.__sessions);
    }

    /**
     * Indicates whether multiple sessions are allowed.
     */
    get isMultiSession(): boolean {
        return this.__multiSession;
    }

    /**
     * Initializes the manager with an octopus instance and handles network changes.
     */
    init(
        octopus: W3oInstance,
        parent: LoggerContext,
    ): void {
        const context = logger.method('init', { octopus }, parent);
        if (this.__initialized) {
            throw new W3oError(
                W3oError.ALREADY_INITIALIZED,
                { name: 'W3oSessionManager', message: 'Session manager already initialized' }
            );
        }
        this.octopus = octopus;
        octopus.networks.onNetworkChange$.subscribe(() => {
            context.debug('network change detected -> clearing current session');
            this.current$.next(null);
        });
        this.__initialized = true;
        // this.loadSessions(context);
    }

    /**
     * Creates a new session for the given address, authenticator, and network.
     */
    createSession(
        address: W3oAddress,
        authenticator: W3oAuthenticator,
        network: W3oNetwork,
        parent: LoggerContext
    ): W3oSession {
        const context = logger.method('createSession', { address, authenticator, network }, parent);
        const session = new W3oSession(this, address, authenticator, network, context);
        if (this.__sessions[session.id]) {
            throw new W3oError(W3oError.SESSION_ALREADY_EXISTS, { id: session.id });
        }
        this.__sessions[session.id] = session;
        return session;
    }

    /**
     * Creates a new session and sets it as the current one.
     */
    createCurrentSession(
        address: W3oAddress,
        authenticator: W3oAuthenticator,
        network: W3oNetwork,
        parent: LoggerContext
    ): W3oSession {
        const context = logger.method('createCurrentSession', { address, authenticator, network }, parent);
        const session = this.createSession(address, authenticator, network, context);
        this.setCurrentSession(session.id, parent);
        return session;
    }

    /**
     * Retrieves a specific session by its ID.
     */
    getSession(id: string, parent: LoggerContext): W3oSession {
        logger.method('getSession', { id }, parent);
        const session = this.__sessions[id];
        if (!session) {
            throw new W3oError(W3oError.SESSION_NOT_FOUND, { id });
        }
        return session;
    }

    /**
     * Retrieves a from the context instance.
     * */
    getSessionFromContext(context: LoggerContext): W3oSession {
        logger.method('getSessionFromContext', undefined, context);
        console.error('SIN IMPLEMENTAR')
        const session = this.__sessions['context.sessionId'];
        if (!session) {
            throw new W3oError(W3oError.SESSION_NOT_FOUND, { id: 'context.sessionId' });
        }
        return session;
    }

    /**
     * Returns all existing sessions.
     */
    getSessions(parent: LoggerContext): W3oSession[] {
        logger.method('getSessions', undefined, parent);
        return this.list;
    }

    /**
     * Deletes the session with the specified ID.
     */
    deleteSession(id: string, parent: LoggerContext): void {
        const context = logger.method('deleteSession', { id }, parent);
        const isCurrent = this.currentSessionId === id;
        if (!this.__sessions[id]) {
            throw new W3oError(W3oError.SESSION_NOT_FOUND, { id });
        }
        const deletedSession = this.__sessions[id];
        delete this.__sessions[id];

        // we switch to the first session if the current session is deleted
        context.log('Deleted session', { deletedSession });
        if (isCurrent) {
            const sessions = this.list;
            if (sessions.length > 0) {
                context.log('Switching to the first session', { sessions });
                this.current$.next(sessions[0]);
            } else {
                context.log('No sessions left, setting current session to null');
                this.current$.next(null);
            }
        }
    }

    /**
     * Sets the current session by its ID.
     */
    setCurrentSession(id: string, parent: LoggerContext): void {
        logger.method('setCurrentSession', { id }, parent);
        const session = this.__sessions[id];
        if (!session) {
            throw new W3oError(W3oError.SESSION_NOT_FOUND, { id });
        }
        this.current$.next(session);
    }

    /**
     * Retrieves the current session instance.
     */
    getCurrentSession(parent: LoggerContext): W3oSession | null {
        logger.method('getCurrentSession', undefined, parent);
        return this.current;
    }

    /**
     * Persists session information to localStorage.
     */
    saveSessions(parent: LoggerContext): void {
        logger.method('saveSessions', undefined, parent);
        const stored: W3oStoredSessions = {
            currentSessionId: this.currentSessionId,
            sessions: Object.keys(this.__sessions),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }

    loadSessions(parent: LoggerContext): Observable<void> {
        const context = logger.method('loadSessions', undefined, parent);

        return defer(() => {
            // Prevent loading if sessions already exist
            if (this.list.length > 0) {
                return throwError(() => new W3oError(
                    W3oError.SESSION_ALREADY_EXISTS,
                    { id: this.currentSessionId, message: 'close all sessions before loading' }
                ));
            }

            let stored: string | null;
            try {
                stored = localStorage.getItem(STORAGE_KEY);
            } catch (e) {
                return throwError(() => new W3oError(
                    W3oError.SESSION_LOAD_ERROR,
                    { message: (e as Error).message }
                ));
            }

            if (stored) {
                let isFirstSession = true;
                const data = JSON.parse(stored) as W3oStoredSessions;
                context.log('sessions found in local storage', { data });

                const separator = W3oSession.ID_SEPARATOR;
                for (const id of data.sessions) {
                    const [address, authenticatorName, networkName] = id.split(separator);
                    const network = this.octopus.networks.getNetwork(networkName, context);
                    const authenticator = this.octopus.auth.createAuthenticator(
                        authenticatorName,
                        network,
                        context
                    );
                    console.log('There are ', data.sessions.length, ' sessions in local storage', { address, authenticatorName, networkName });
                    if (isFirstSession) {
                        this.createCurrentSession(address, authenticator, network, context);
                        isFirstSession = false;
                    } else {
                         this.createSession(address, authenticator, network, context);
                    }
                }

                // If autologin is enabled, return the autoLogin Observable
                if (this.__autologin && data.currentSessionId) {
                    const session = this.__sessions[data.currentSessionId];
                    if (!session) {
                        return throwError(() => new W3oError(
                            W3oError.SESSION_NOT_FOUND,
                            { id: data.currentSessionId, message: 'could not perform autologin' }
                        ));
                    }
                    return session.authenticator
                        .autoLogin(session.network.settings.name, session.address, context)
                        .pipe(
                            tap(() => this.setCurrentSession(session.id, context)),
                            mapTo(void 0)
                        );
                }
            } else {
                context.log('no sessions found in local storage');
            }
            return of(void 0);
        });
    }

    /**
     * Returns a snapshot of the manager's state for inspection.
     */
    snapshot(): any {
        return {
            currentSessionId: this.currentSessionId,
            sessionsKeys: Object.keys(this.__sessions),
            sessions: this.__sessions,
        };
    }
}

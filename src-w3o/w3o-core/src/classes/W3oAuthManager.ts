// w3o-core/src/classes/W3oContractManager.ts

import { BehaviorSubject, filter, Observable, tap } from 'rxjs';
import {
    W3oAuthInstance,
    W3oAuthSupportName,
    W3oGlobalSettings,
    W3oNetworkType,
    W3oInstance,
    W3oNetworkName
} from '../types';

import { Logger, LoggerContext } from './Logger';
import { W3oAuthSupport } from './W3oAuthSupport';
import { W3oNetwork } from './W3oNetwork';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oSession } from './W3oSession';
import { W3oError } from './W3oError';

const logger = new Logger('W3oAuthManager');

// Represents a contract manager, including methods to add, get, and list contracts
export class W3oAuthManager implements W3oAuthInstance {
    private __initialized = false;
    private __byType: { [authType: string]: W3oAuthSupport[] } = {};
    private __byName: { [authName: string]: W3oAuthSupport } = {};

    octopus!: W3oInstance
    constructor(
        settings: W3oGlobalSettings,
        parent: LoggerContext
    ) {
        logger.method('constructor', {settings}, parent);
    }

    // Method to initialize the auth manager
    init(octopus: W3oInstance, parent: LoggerContext) {
        const context = logger.method('init', { octopus }, parent);
        this.octopus = octopus;
        if (this.__initialized) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { name: 'W3oAuthManager', message: 'Auth manager already initialized' });
        }
        this.__initialized = true;
    }

    // Method to add an authenticator to the manager
    addAuthSupport(auth: W3oAuthSupport, parent: LoggerContext): void {
        logger.method('add', {auth}, parent);
        console.assert(!this.__initialized, parent.indent + 'Auth manager already initialized. You need to use addAuthSupport before initialization');

        this.__byName[auth.name] = auth;
        if (!this.__byType[auth.type]) {
            this.__byType[auth.type] = [];
        }
        this.__byType[auth.type].push(auth);
    }

    // Method to get an authenticator by name
    get(name: string): W3oAuthSupport {
        return this.__byName[name];
    }

    // Method to get a list of authenticators by type
    list(type: string): W3oAuthSupport[] {
        return this.__byType[type];
    }

    // Method to create an authenticator from its name
    createAuthenticator(name: W3oAuthSupportName, network: W3oNetwork, parent: LoggerContext): W3oAuthenticator {
        logger.method('createAuthenticator', {name, network}, parent);
        const auth = this.get(name);
        if (!auth) {
            throw new W3oError(W3oError.AUTH_SUPPORT_NOT_FOUND, {name});
        }
        return auth.createAuthenticator(network, parent);
    }

    // Main method to authenticate a user from a service
    login(
        chain: W3oNetworkName,
        network: W3oNetworkType,
        authName: W3oAuthSupportName,
        parent: LoggerContext
    ): Observable<W3oSession> {
        // Create a logging context for this method
        const context = logger.method('login', { chain, network, authName }, parent);

        // Retrieve the requested authentication support
        const auth = this.get(authName);
        if (!auth) {
            // Throw an error if the requested authName is not found
            throw new W3oError(W3oError.AUTH_SUPPORT_NOT_FOUND, { authName });
        }

        // Create a BehaviorSubject that will hold the last emitted W3oSession
        const subject = new BehaviorSubject<W3oSession | null>(null);

        try {
            // 1. Get the corresponding network instance
            const networkInstance: W3oNetwork = this.octopus.networks
                .getNetwork(chain, context);

            // 2. Create the authenticator specified by authName
            const authenticator: W3oAuthenticator = auth
                .createAuthenticator(networkInstance, context);

            // 3. Call authenticator.login() immediately to start the authentication
            authenticator.login(chain, context).subscribe({
                next: account => {
                    // 4. When the account is returned, create a new session
                    context.log('-> createCurrentSession', { account: account.getAddress(), authenticator, networkInstance });
                    const session = this.octopus.sessions
                        .createCurrentSession(
                            account.getAddress(),
                            authenticator,
                            networkInstance,
                            context
                        );

                    // 5. Emit the session and complete the subject
                    subject.next(session);
                    subject.complete();
                },
                error: err => {
                    // Emit any authentication error
                    subject.error(err);
                }
            });
        } catch (error) {
            // Catch synchronous exceptions and emit them as well
            context.error(error);
            subject.error(error);
        }

        // Return the BehaviorSubject filtered to emit only non-null values
        return subject.pipe(
            filter(session => session !== null), // Filter out null values
        );
    }

    autoLogin(parent: LoggerContext): Observable<void> {
        const context = logger.method('autoLogin',undefined, parent);
        return this.octopus.sessions.loadSessions(context).pipe(
            tap(() => {
                const session = this.octopus.sessions.current;
                if (session) {
                    context.debug('autoLogin', {session});
                } else {
                    context.warn('autoLogin', 'No session found to auto-login');
                }
            })
        );
    }

    logout(parent: LoggerContext): Observable<void> {
        const context = logger.method('logout',undefined, parent);
        const session = this.octopus.sessions.current;
        if (!session) {
            throw new W3oError(W3oError.SESSION_NOT_FOUND, { sessions: this.octopus.sessions.snapshot() });
        }
        session.logout(context);
        return session.onLogout$;
    }

    // Method to take a snapshot of the auth manager state
    snapshot(): any {
        const snapshot = {
            byType: {} as { [authType: string]: any[] },
            byName: [] as string[],
        };

        for (const type in snapshot.byType) {
            snapshot.byType[type] = snapshot.byType[type].map(auth => auth.snapshot());
        }

        snapshot.byName.push(... Object.keys(this.__byName));

        return snapshot;
    }
}

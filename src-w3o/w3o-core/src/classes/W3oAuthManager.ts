// w3o-core/src/classes/W3oContractManager.ts

import { Observable } from 'rxjs';
import {
    W3oAuthInstance,
    W3oAuthSupportName,
    W3oGlobalSettings,
    W3oNetworkType,
    W3oInstance
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
        // iterate over the __byName object and call the init method of each W3oAuthSupport instance
        // for (const authName in this.__byName) {
        //     const auth = this.__byName[authName];
        //     if (auth) {
        //         auth.init(octopus, context);
        //     } else {
        //         throw new W3oError(W3oError.AUTH_SUPPORT_NOT_FOUND, { name: authName });
        //     }
        // }
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
    createAuthenticator(name: W3oAuthSupportName, parent: LoggerContext): W3oAuthenticator {
        logger.method('createAuthenticator', {name}, parent);
        const auth = this.get(name);
        if (!auth) {
            throw new W3oError(W3oError.AUTH_SUPPORT_NOT_FOUND, {name});
        }
        return auth.createAuthenticator(parent);
    }

    // Main method to authenticate a user from a service
    login(
        network: W3oNetworkType,
        authName: W3oAuthSupportName,
        parent: LoggerContext
    ): Observable<W3oSession> {
        const context = logger.method('login', {network, authName}, parent);
        const auth = this.get(authName);
        if (!auth) {
            throw new W3oError(W3oError.AUTH_SUPPORT_NOT_FOUND, {authName});
        }
        const obs = new Observable<W3oSession>(subscriber => {
            try {
                // 1. Get the network instance
                const networkInstance: W3oNetwork = this.octopus.networks.getNetwork(network, context);

                // 2. Create an authenticator
                const authenticator: W3oAuthenticator = auth.createAuthenticator(context);

                // 3. Call authenticator.login to get an account
                authenticator.login(network, context).subscribe({
                    next: account => {
                        // 4. Create a new session
                        const session = this.octopus.sessions.createCurrentSession(account.getAddress(), authenticator, networkInstance, context);

                        // 5. Notify the subscriber of the created session
                        subscriber.next(session);
                        subscriber.complete();
                    },
                    error: err => {
                        subscriber.error(err);
                    }
                });
            } catch (error) {
                subscriber.error(error);
            }
        });
        return obs;
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

// w3o-core/src/classes/W3oContractManager.ts

import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import {
    W3oAuthInstance,
    W3oAuthSupportName,
    W3oGlobalSettings,
    W3oNetworkType,
    W3oInstance,
    W3oNetworkName
} from '../types';

import { W3oContextFactory, W3oContext } from './W3oContext';
import { W3oAuthSupport } from './W3oAuthSupport';
import { W3oNetwork } from './W3oNetwork';
import { W3oAuthenticator } from './W3oAuthenticator';
import { W3oSession } from './W3oSession';
import { W3oError } from './W3oError';
import { W3oManager } from './W3oManager';

const logger = new W3oContextFactory('W3oAuthManager');

// Represents a contract manager, including methods to add, get, and list contracts
export class W3oAuthManager extends W3oManager implements W3oAuthInstance {
    private __byType: { [authType: W3oNetworkType | string]: W3oAuthSupport[] } = {};
    private __byName: { [authName: W3oAuthSupportName | string]: W3oAuthSupport } = {};

    octopus!: W3oInstance
    constructor(
        settings: W3oGlobalSettings,
        parent: W3oContext
    ) {
        logger.method('constructor', {settings}, parent);
        super('W3oAuthManager');
    }


    // Method to initialize the auth manager
    init(octopus: W3oInstance, parent: W3oContext) {
        const context = logger.method('init', { octopus }, parent);
        this.octopus = octopus;
        if (this.__initCalled) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { name: 'W3oAuthManager', message: 'Auth manager already initialized' });
        }
        this.__initCalled = true;
        this.__initialized$.next(true);
    }

    // Method to add an authenticator to the manager
    addAuthSupport(auth: W3oAuthSupport, parent: W3oContext): void {
        logger.method('add', {auth}, parent);
        // console.assert(!this.__initCalled, parent.indent + 'W3oAuthManager is already initialized and can not. You need to use addAuthSupport before initialization');
        if (this.__initCalled) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { auth });
        }
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
    createAuthenticator(name: W3oAuthSupportName, network: W3oNetwork, parent: W3oContext): W3oAuthenticator {
        logger.method('createAuthenticator', {name, network}, parent);
        const auth = this.get(name);
        if (!auth) {
            throw new W3oError(W3oError.AUTH_SUPPORT_NOT_FOUND, { name });
        }
        return auth.createAuthenticator(network, parent);
    }

    // Main method to authenticate a user from a service using 2 signatures
    // Overload signatures
    // Case 1: login for app with single sessions and default network and authenticator
    login(parent: W3oContext): Observable<W3oSession>;
    // Case 2: login for app with multiple sessions, networks or authenticators
    login(
        chain: W3oNetworkName,
        network: W3oNetworkType,
        authName: W3oAuthSupportName,
        parent: W3oContext
    ): Observable<W3oSession>;

    // Single implementation covering both overloads
    login(
        networkNameOrParent: W3oNetworkName | W3oContext,
        networkType?: W3oNetworkType,
        authName?: W3oAuthSupportName,
        parent?: W3oContext
    ): Observable<W3oSession> {
        return this.__authenticate('login', networkNameOrParent, networkType, authName, parent);
    }

    // Main method to try to auto-login a user from a service using 2 signatures
    // Overload signatures
    // Case 1: autoLogin for app with single sessions and default network and authenticator
    autoLogin(parent: W3oContext): Observable<W3oSession>;
    // Case 2: autoLogin for app with multiple sessions, networks or authenticators
    autoLogin(
        chain: W3oNetworkName,
        network: W3oNetworkType,
        authName: W3oAuthSupportName,
        parent: W3oContext
    ): Observable<W3oSession>;

    autoLogin(
        networkNameOrParent: W3oNetworkName | W3oContext,
        networkType?: W3oNetworkType,
        authName?: W3oAuthSupportName,
        parent?: W3oContext
    ): Observable<W3oSession> {
        return this.__authenticate('autoLogin', networkNameOrParent, networkType, authName, parent);
    }

    // Private method to handle the authentication process
    private __authenticate(
        method: 'login' | 'autoLogin',
        networkNameOrParent: W3oNetworkName | W3oContext,
        networkType?: W3oNetworkType,
        authName?: W3oAuthSupportName,
        parent?: W3oContext
    ): Observable<W3oSession> {
        if (typeof networkNameOrParent !== 'string') {
            const context = logger.method(method, networkNameOrParent);
            const network = this.octopus.networks.current as W3oNetwork;
            const authList = this.list(network.type);
            const defaultAuthName = authList[0]?.name;
            context.assert(!!defaultAuthName, 'No default authenticator found for network type', { networkType: network.type });
            return this.__authenticate(method, network.name, network.type, defaultAuthName, networkNameOrParent);
        }

        const networkName = networkNameOrParent;
        const context = logger.method(method, { networkName, networkType, authName }, parent!);
        const auth = this.get(authName!);

        if (!auth) {
            throw new W3oError(W3oError.AUTH_SUPPORT_NOT_FOUND, { authName });
        }

        const subject = new BehaviorSubject<W3oSession | null>(null);
        const exec = () => {
            try {
                const networkInstance = this.octopus.networks.getNetwork(networkName, context);
                const authenticator = auth.createAuthenticator(networkInstance, context);
                authenticator[method](networkName, context).subscribe({
                    next: account => {
                        const session = this.octopus.sessions.createCurrentSession(
                            account.getAddress(),
                            authenticator,
                            networkInstance,
                            context
                        );
                        subject.next(session);
                        subject.complete();
                    },
                    error: err => subject.error(err)
                });
            } catch (error) {
                context.error(error);
                subject.error(error);
            }
        };

        if (method === 'autoLogin') {
            this.octopus.whenReady.pipe(take(1)).subscribe(() => exec());
        } else {
            exec();
        }

        return subject.pipe(filter(session => session !== null)) as Observable<W3oSession>;
    }

    // Method to log out a user from the current session
    logout(parent: W3oContext): Observable<void> {
        const context = logger.method('logout',parent);
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

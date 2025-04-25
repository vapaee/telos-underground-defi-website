// w3o-core/src/classes/W3oAuthenticator.ts

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
    W3oAddress,
    W3oNetworkName,
    W3oInstance,
    W3oTransaction
} from '../types';

import { Logger, LoggerContext } from './Logger';
import { W3oAccount } from './W3oAccount';
import { W3oAuthSupport } from './W3oAuthSupport';
import { W3oError } from './W3oError';
import { W3oTransactionResponse } from './W3oTransactionResponse';
import { W3oSession } from './W3oSession';
import { W3oNetwork } from './W3oNetwork';

const logger = new Logger('W3oAuthenticator');


export class W3oAuthenticator {
    private __account: W3oAccount | null = null;
    private __session: W3oSession | null = null;
    public onSessionChange$: Subject<string> = new Subject<string>();

    octopus!: W3oInstance;

    constructor(
        public readonly support: W3oAuthSupport,
        public readonly network: W3oNetwork,
        parent: LoggerContext,
    ) {
        logger.method('constructor', {support}, parent);
    }

    // Getter to obtain the user's account (throws an exception if not authenticated)
    get account(): W3oAccount {
        if (!this.__account) {
            throw new W3oError(W3oError.ACCOUNT_NOT_LOGGED, {authenticator: this});
        }
        return this.__account;
    }

    // Getter to obtain the authenticator's name from its support
    get name(): string {
        return this.support.name;
    }

    // Getter to obtain the authenticator's type from its support
    get type(): string {
        return this.support.type;
    }

    // Getter to obtain the session ID
    get sessionId(): string {
        return this.session.id ?? '';
    }

    // Getter to obtain the session (throws an exception if not set)
    get session(): W3oSession {
        if (!this.__session) {
            throw new W3oError(W3oError.SESSION_NOT_SET, {authenticator: this});
        }
        return this.__session;
    }

    // Method to set the session ID (throws exception if the session is already set)
    private setSessionId(sessionId: string, parent: LoggerContext): void {
        logger.method('setSessionId', {sessionId}, parent);
        this.onSessionChange$.next(sessionId);
    }

    // Method to set the session
    setSession(session: W3oSession, parent: LoggerContext): void {
        const context = logger.method('setSession', { session: session.id}, parent);
        if (!!this.__session) {
            throw new W3oError(W3oError.SESSION_ALREADY_SET, {authenticator: this, session});
        }
        this.__session = session;
        this.setSessionId(session.id, context);
    }

    // Method to check if the user is authenticated
    isLogged(): boolean {
        return this.account !== null;
    }

    // Method to obtain the user's address
    getAddress(): W3oAddress {
        return this.account.getAddress();
    }

    // Method to obtain the user's account or null if not authenticated
    getAccount(): W3oAccount | null {
        return this.__account;
    }

    // Method to check if the authenticator is read-only
    isReadOnly(): boolean {
        return this.support.isReadOnly();
    }

    // Method to sign a transaction
    signTransaction(trx: W3oTransaction, parent: LoggerContext): Observable<W3oTransactionResponse> {
        const context = logger.method('signTransaction', {trx}, parent);
        if (this.isReadOnly()) {
            throw new W3oError(W3oError.READ_ONLY_AUTHENTICATOR, {authenticator: this});
        }
        return new Observable<W3oTransactionResponse>(subscriber => {
            try {
                const response = this.support.signTransaction(this, trx, context);
                response.subscribe({
                    next: (res) => subscriber.next(res),
                    error: (err) => subscriber.error(err),
                    complete: () => subscriber.complete(),
                });
            } catch (error) {
                context.error(error);
                subscriber.error(error);
            }
        });
    }

    // Method to log in to a specific network
    login(networkName: W3oNetworkName, parent: LoggerContext): Observable<W3oAccount> {
        const context = logger.method('login', {networkName}, parent);
        return new Observable<W3oAccount>(subscriber => {
            try {
                const accountObservable = this.support.login(this, networkName, context);
                accountObservable.subscribe({
                    next: (account) => {
                        context.log('this.support.login.subscribe() -> result', {account: account.getAddress()});
                        this.__account = account;
                        subscriber.next(account);
                    },
                    error: (err) => subscriber.error(err),
                    complete: () => subscriber.complete(),
                });
            } catch (error) {
                context.error((error as Error).message);
                subscriber.error(error);
            }
        });
    }

    // Method to automatically log in to a specific network
    autoLogin(network: W3oNetworkName, address: W3oAddress, parent: LoggerContext): Observable<W3oAccount> {
        const context = logger.method('autoLogin', {network, address}, parent);
        return new Observable<W3oAccount>(subscriber => {
            try {
                const accountObservable = this.support.autoLogin(this, network, address, context);
                accountObservable.subscribe({
                    next: (account) => {
                        this.__account = account;
                        subscriber.next(account);
                    },
                    error: (err) => subscriber.error(err),
                    complete: () => subscriber.complete(),
                });
            } catch (error) {
                context.error((error as Error).message);
                subscriber.error(error);
            }
        });
    }

    // Method to log out
    logout(parent: LoggerContext): void {
        const context = logger.method('logout', undefined, parent);
        try {
            this.support.logout(this, context);
            this.octopus.sessions.deleteSession(this.sessionId, context);
            this.__account = null;
            this.__session = null;
        } catch (error) {
            context.error((error as Error).message);
        }
    }


    // ------  Attached Data (for storing user custom properties) ------
    private __storage: {[key in string]: any} = {};

    // Método para almacenar un valor en la sesión
    set<TData>(key: string, value: TData): void {
        this.__storage[key] = value;
    }

    // Método para recuperar un valor de la sesión
    get<TData>(key: string): TData {
        if (this.__storage[key] === undefined) {
            throw new W3oError(W3oError.KEY_NOT_FOUND, {key, authenticator: this});
        }
        return this.__storage[key] as TData;
    }

    // Método para eliminar un valor de la sesión
    remove(key: string): void {
        delete this.__storage[key];
    }

    // Metodo para obtener las claves almacenadas en la sesión
    keys(): string[] {
        return Object.keys(this.__storage);
    }

    // Method to clear the storage
    clearStorage(): void {
        this.__storage = {};
    }

    // Method to take a snapshot of the authenticator's state
    snapshot(): any {
        return {
            account: this.__account ? this.__account.snapshot() : null,
            support: this.support.snapshot(),
            __storage: { ...this.__storage }
        };
    }


}

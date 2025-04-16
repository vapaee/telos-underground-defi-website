import {
    Logger,
    LoggerContext,
    W3oAccount,
    W3oAddress,
    W3oAuthenticator,
    W3oAuthSupport,
    W3oAuthSupportName,
    W3oNetworkName,
    W3oNetworkType,
    W3oTransaction,
    W3oTransactionResponse,
} from "@vapaee/w3o-core";

import { Observable } from "rxjs";

const logger = new Logger('AntelopeAuthSupport');

export abstract class AntelopeAuthSupport extends W3oAuthSupport {
    constructor(name: W3oAuthSupportName, parent: LoggerContext) {
        const context = logger.method('constructor', undefined, parent);
        super(name, 'antelope' as W3oNetworkType, context);
    }
    // Abstract methods from W3oAuthSupport
    override createAuthenticator(parent?: LoggerContext): W3oAuthenticator {
        const context = logger.method('createAuthenticator', undefined, parent);
        context.error('NOT IMPLEMENTED');
        return new W3oAuthenticator(this, context);
    }

    // Method to check if the authenticator is read-only
    override isReadOnly(): boolean {
        const context = logger.method('isReadOnly', undefined);
        context.error('isReadOnly() NOT IMPLEMENTED');
        return false;
    }
    // Method to sign a transaction
    override signTransaction(trx: W3oTransaction, parent: LoggerContext): Observable<W3oTransactionResponse> {
        const context = logger.method('signTransaction', { trx, parent });
        context.error('signTransaction() NOT IMPLEMENTED');
        return new Observable<W3oTransactionResponse>();
    }
    // Method to log in to a specific network
    override login(network: W3oNetworkName, parent: LoggerContext): Observable<W3oAccount> {
        const context = logger.method('login', { network, parent });
        context.error('login() NOT IMPLEMENTED');
        return new Observable<W3oAccount>();
    }
    // Method to automatically log in to a specific network
    override autoLogin(network: W3oNetworkName, address: W3oAddress, parent?: LoggerContext): Observable<W3oAccount> {
        const context = logger.method('autoLogin', { network, address, parent });
        context.error('autoLogin() NOT IMPLEMENTED');
        return new Observable<W3oAccount>();
    }
    // Method to log out
    override logout(parent?: LoggerContext): void {
        const context = logger.method('logout', { parent });
        context.error('logout() NOT IMPLEMENTED');
    }

}

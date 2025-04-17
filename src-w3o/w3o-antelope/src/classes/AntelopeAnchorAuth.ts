import {
    Logger,
    LoggerContext,
    W3oIServices,
    Web3Octopus,                       // Templated class for the main octopus class
    W3oAuthSupportName,
    W3oInstance,
    W3oTransaction,
    W3oTransactionResponse,
    W3oAccount,
    W3oNetworkName,
    W3oAddress,
} from '@vapaee/w3o-core';

import { AntelopeAuthSupport } from './AntelopeAuthSupport';
import { Observable } from 'rxjs';

const logger = new Logger('AntelopeAnchorAuth');

export class AntelopeAnchorAuth extends AntelopeAuthSupport {
    constructor(
        parent: LoggerContext,
    ) {
        const context = logger.method('constructor', undefined, parent);
        super('anchor' as W3oAuthSupportName, context);
    }

    // Module id ------
    override get w3oVersion(): string {
        return '0.1.0';
    }
    override get w3oName(): string {
        return 'antelope.auth.anchor';
    }
    override get w3oRequire(): string[] {
        return [
            'antelope.network.telos@0.1.0'
        ];
    }

    // Module init ------
    override init(octopus: W3oInstance, parent: LoggerContext): void {
        const context = logger.method('init', { octopus }, parent);
        context.info('AntelopeAnchorAuth OK!', super.w3oId);
        super.init(octopus, context);
    }

    // Module methods ------
    override snapshot(): any {
        return {
            ... super.snapshot(),
            _class: 'AntelopeAnchorAuth',
        };
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

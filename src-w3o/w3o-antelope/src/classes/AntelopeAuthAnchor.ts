// w3o-antelope/src/classes/AntelopeAuthAnchor.ts

import {
    W3oContext,
    W3oContextFactory,
    W3oAuthSupportName,
    W3oInstance,
    W3oTransaction,
    W3oTransactionResponse,
    W3oAccount,
    W3oNetworkName,
    W3oAuthenticator,
    W3oError,
    W3oModule,
} from '@vapaee/w3o-core';

import { AntelopeAuthSupport } from './AntelopeAuthSupport';
import { Observable } from 'rxjs';
import { WharfkitInstance } from './AntelopeWharfkit';
import { AntelopeAccount } from './AntelopeAccount';
import { Session } from '@wharfkit/session';
import { AntelopeTransaction } from '../types';
import { AntelopeNetwork } from './AntelopeNetwork';

const logger = new W3oContextFactory('AntelopeAuthAnchor');

export class AntelopeTransactionResponse extends W3oTransactionResponse {
    constructor(hash: string) {
        super(hash);
    }
    wait(): Observable<any> {
        return new Observable<any>((observer) => {
            observer.next({ status: 'success' });
            observer.complete();
        });
    }
}

export class AntelopeAuthAnchor extends AntelopeAuthSupport {

    constructor(
        parent: W3oContext,
    ) {
        const context = logger.method('constructor', parent);
        super('anchor' as W3oAuthSupportName, context);
    }

    // Module id ------
    override get w3oVersion(): string {
        return '1.0.0';
    }
    override get w3oName(): string {
        return 'antelope.auth.anchor';
    }
    override get w3oRequire(): string[] {
        return [
            'antelope.auth.support@1.0.0',
        ];
    }

    // Method to check if the authenticator is read-only
    override isReadOnly(): boolean {
        return false;
    }


    // Module init ------
    override init(octopus: W3oInstance, requirements: W3oModule[], parent: W3oContext): void {
        const context = logger.method('init', { octopus, requirements }, parent);
        super.init(octopus, requirements, context);
        logger.info('AntelopeAuthAnchor OK!', { w3oId: super.w3oId, octopus, requirements });
    }

    // Module methods ------
    override snapshot(): any {
        return {
            ... super.snapshot(),
            _class: 'AntelopeAuthAnchor',
        };
    }

    // Wharfkit support methods ------

    // Method to get the wharfkit instance from the authenticator
    getWharfkitFrom(auth: W3oAuthenticator, parent: W3oContext): WharfkitInstance {
        const context = logger.method('getWharfkitFrom', { auth }, parent);
        if (auth) {
            let wharfkit!: WharfkitInstance;
            if (auth.network instanceof AntelopeNetwork) {
                wharfkit = (auth.network as AntelopeNetwork).wharfkit;
                logger.info('Wharfkit found in network', wharfkit);
            } else {
                context.error('No wharfkit found in network', { network: auth.network, auth });
                throw new W3oError(W3oError.SESSION_NOT_FOUND, { auth });
            }
            return wharfkit;
        }
        context.error('No wharfkit found in auth', { auth });
        throw new W3oError(W3oError.SESSION_NOT_FOUND, { auth });
    }

    // Metod to get the wharfkit instance from the networkName
    getWharfkitFromNetworkName(networkName: W3oNetworkName, parent: W3oContext): WharfkitInstance {
        const context = logger.method('getWharfkitFromNetworkName', { networkName }, parent);
        const network = this.octopus.networks.getNetwork(networkName, context);
        if (network instanceof AntelopeNetwork) {
            return network.wharfkit;
        }
        context.error('No wharfkit found in network', { network });
        throw new W3oError(W3oError.SESSION_NOT_FOUND, { network });
    }

    private setWharfkitSession(authenticator: W3oAuthenticator, session: Session, parent: W3oContext): string {
        const context = logger.method('setWharfkitSession', { session, authenticator, parent });
        const accountname = session.actor.toString();
        authenticator.onSessionChange$.subscribe(() => {
            if (!!authenticator.session) {
                authenticator.session.storage.set<Session>('wharfkit.session', session);
                logger.info(`✅Logged in as ${accountname}`);
            }
        });
        return accountname;
    }

    public getWharfkitSession(authenticator: W3oAuthenticator, parent: W3oContext): Session {
        const context = logger.method('getWharfkitSession', { authenticator, parent });
        const session = authenticator.session.storage.get<Session>('wharfkit.session') as Session;
        if (!session) {
            context.error('No wharfkit session found in auth');
            throw new W3oError(W3oError.SESSION_MISSING_KEY, { 'key': 'wharfkit.session', authenticator });
        }
        logger.info('Wharfkit session found', session);
        return session;
    }

    // Authentication methods ------

    /**
     * Private helper that centralises the common login flow.
     *
     * @param auth           the authenticator
     * @param networkName    the target network
     * @param contextArgs    extra args to show in the initial log (e.g. { address })
     * @param parent         parent execution context
     * @param action         fn that invokes wharfkit.login/restoredSession
     * @param initialLabel   label for logger.method()
     * @param failMessage    used in error() when no session or promise rejects
     */
    private authenticate(
        auth: W3oAuthenticator,
        networkName: W3oNetworkName,
        parent: W3oContext,
        action: (wharfkit: WharfkitInstance, ctx: W3oContext) => Promise<Session | undefined>,
        initialLabel: string,
        failMessage: string
    ): Observable<W3oAccount> {
        return new Observable<W3oAccount>(observer => {
            const context = logger.method(
                initialLabel,
                { auth, networkName },
                parent
            );

            try {
                const wharfkit = this.getWharfkitFrom(auth, context);
                const network = this.octopus.networks.getNetwork(networkName, context);
                logger.log(`${initialLabel}():`, { wharfkit, network });

                action(wharfkit, context)
                    .then(session => {
                        logger.info(`${initialLabel}() ->`, { session });
                        if (session) {
                            const address = this.setWharfkitSession(auth, session, context);
                            const account = new AntelopeAccount(address, session, auth, context);
                            observer.next(account as W3oAccount);
                            observer.complete();
                        } else {
                            if (initialLabel === 'login') {
                                context.error(failMessage, { session });
                                throw new W3oError(W3oError.SESSION_NOT_FOUND, { session });
                            }
                        }
                    })
                    .catch(error => {
                        context.error(failMessage, error);
                        observer.error(error);
                    });
            } catch (error) {
                context.error('ERROR:', error);
                observer.error(error);
            }
        });
    }

    // Method to log in to a specific network.
    override login(
        auth: W3oAuthenticator,
        networkName: W3oNetworkName,
        parent: W3oContext
    ): Observable<W3oAccount> {
        return this.authenticate(
            auth,
            networkName,
            parent,
            (wharfkit, ctx) => wharfkit.login(ctx),
            'login',
            'Login failed'
        );
    }

    // Method to automatically restore a session for a specific network.
    override autoLogin(
        auth: W3oAuthenticator,
        networkName: W3oNetworkName,
        parent: W3oContext
    ): Observable<W3oAccount> {
        return this.authenticate(
            auth,
            networkName,
            parent,
            (wharfkit, ctx) => wharfkit.restoreSession(),
            'autoLogin',
            'Auto login failed'
        );
    }

    // Method to log out
    override logout(auth: W3oAuthenticator, parent: W3oContext): void {
        const context = logger.method('logout', { auth }, parent);
        try {
            const wharfkit = this.getWharfkitFrom(auth, context);
            wharfkit.logout().then(() => {
                logger.info('Logout successful', auth);
            }).catch((error) => {
                context.error('Logout failed', error);
            });
        } catch (error) {
            context.error('ERROR:', error);
            throw new W3oError(W3oError.SESSION_NOT_FOUND, { auth });
        }

    }

    // Method to sign a transaction
    override signTransaction(auth: W3oAuthenticator, trx: W3oTransaction, parent: W3oContext): Observable<AntelopeTransactionResponse> {
        const context = logger.method('signTransaction', { auth, trx, parent });
        const session = this.getWharfkitSession(auth, context);
        const wharfkit = this.getWharfkitFrom(auth, context);
        const transaction = trx as AntelopeTransaction;
        return new Observable<AntelopeTransactionResponse>((observer) => {
            session.transact(transaction).then((response) => {
                logger.info('Transaction signed successfully', response);
                const txId = response.response?.['transaction_id'] as string || 'Unknown TX';
                const transactionResponse = new AntelopeTransactionResponse(txId);
                transactionResponse.wait().subscribe((receipt) => {
                    logger.info('Transaction receipt', receipt);
                    observer.next(transactionResponse);
                    observer.complete();
                });
            }).catch((error) => {
                context.error('Transaction signing failed', error);
                observer.error(error);
            });
        });
    }


}

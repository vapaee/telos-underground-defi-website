import {
    Logger,
    LoggerContext,
    W3oAuthSupportName,
    W3oInstance,
    W3oTransaction,
    W3oTransactionResponse,
    W3oAccount,
    W3oNetworkName,
    W3oAddress,
    W3oNetwork,
    W3oAuthenticator,
    W3oGlobalSettings,
    W3oError,
    W3oService,
    W3oSession,
    W3oModule,
} from '@vapaee/w3o-core';

import { AntelopeAuthSupport } from './AntelopeAuthSupport';
import { Observable } from 'rxjs';
import { AntelopeWharfkit, WharfkitInstance } from './AntelopeWharfkit';
import { W3oAntelopeNetworkSettings } from '../types';
import { AntelopeAccount } from './AntelopeAccount';
import { Session } from '@wharfkit/session';

const logger = new Logger('AntelopeAuthAnchor');



export class AntelopeAuthAnchor extends AntelopeAuthSupport {

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
            'antelope.auth.support@1.0.0',
        ];
    }

    // Module init ------
    override init(octopus: W3oInstance, requirements: W3oModule[], parent: LoggerContext): void {
        const context = logger.method('init', { octopus, requirements }, parent);
        super.init(octopus, requirements, context);
        context.info('AntelopeAuthAnchor OK!', { w3oId: super.w3oId, octopus, requirements });
    }


    // Module methods ------
    override snapshot(): any {
        return {
            ... super.snapshot(),
            _class: 'AntelopeAuthAnchor',
        };
    }

    getWharfkitFrom(auth: W3oAuthenticator, parent: LoggerContext): WharfkitInstance {
        const context = logger.method('getWharfkitFrom', { auth }, parent);
        if (auth) {
            const wharfkit = auth.get<WharfkitInstance>('wharfkit');
            if (!wharfkit) {
                context.error('No wharfkit found in auth');
                throw new W3oError(W3oError.SESSION_MISSING_KEY, {'key': 'wharfkit', auth});
            }
            context.info('Wharfkit found', wharfkit);
            return wharfkit;
        }
        context.error('No session found');
        throw new W3oError(W3oError.SESSION_NOT_FOUND, { auth });
    }

    // Method to check if the authenticator is read-only
    override isReadOnly(): boolean {
        return false;
    }
    // Method to sign a transaction
    override signTransaction(auth: W3oAuthenticator, trx: W3oTransaction, parent: LoggerContext): Observable<W3oTransactionResponse> {
        const context = logger.method('signTransaction', { auth, trx, parent });
        context.error('signTransaction() NOT IMPLEMENTED');
        return new Observable<W3oTransactionResponse>();
    }
    // Abstract methods from W3oAuthSupport
    override createAuthenticator(network: W3oNetwork, parent: LoggerContext): W3oAuthenticator {
        const context = logger.method('createAuthenticator', undefined, parent);
        const autenticator: W3oAuthenticator = super.createAuthenticator(network, context);
        const wharfkit: WharfkitInstance = AntelopeWharfkit.wharfkit(
            this.octopus.settings.appName,
            network.settings as W3oAntelopeNetworkSettings,
        )
        console.log({
            chainId: network.settings.chainId,
            displayName: network.settings.displayName,
            rpcUrl: network.settings.rpcUrl,
        });

        if (wharfkit) {
            autenticator.set<WharfkitInstance>('wharfkit', wharfkit);
            context.info('Authenticator created', { autenticator, wharfkit });
        } else {
            context.warn('Authenticator created but no wharfkit found', { autenticator });
        }

        return autenticator;
    }

    private setWharfkitSession(authenticator: W3oAuthenticator, session: Session, network: W3oNetwork, parent: LoggerContext): string {
        const context = logger.method('setWharfkitSession', { session, authenticator, network, parent });
        const accountname = session.actor.toString();
        context.info('accountname:', accountname);
        // this.octopus.sessions.createCurrentSession(accountname, authenticator, network, context);
        authenticator.set<Session>('wharfkit.session', session);
        authenticator.set<string>('wharfkit.session.actor', accountname);
        // green check icon followed by `Logged in as ${address}`
        context.info(`✅Logged in as ${accountname}`);
        return accountname;
    }

    // Method to log in to a specific network
    override login(auth: W3oAuthenticator, networkName: W3oNetworkName, parent: LoggerContext): Observable<W3oAccount> {
        const context = logger.method('login', { auth, networkName, parent });
        return new Observable<W3oAccount>((observer) => {
            try {
                // First use wharfkit to login
                const network = this.octopus.networks.getNetwork(networkName, context);
                console.assert(!!network, 'Network not found', { networkName });
                const wharfkit = this.getWharfkitFrom(auth, context);
                context.log('wharfkit.login()', { wharfkit, network });
                wharfkit.login(context).then((session) => {
                    context.info('wharfkit.login() -> ', { session });
                    if (!!session) {
                        const address = this.setWharfkitSession(auth, session, network, context);
                        const account = new AntelopeAccount(address, session, auth, context);
                        context.info('wharfkit.login() -> account ', { account });
                        observer.next(account as W3oAccount);
                        observer.complete();
                    } else {
                        context.error('Login failed: no session found', { session });
                        throw new W3oError(W3oError.SESSION_NOT_FOUND, { session });
                    }
                }).catch((error) => {
                    context.error('Login failed', error);
                });
            } catch (error) {
                context.error('ERROR:', error);
                observer.error(error);
            }
        });
    }
    // Method to automatically log in to a specific network
    override autoLogin(auth: W3oAuthenticator, networkName: W3oNetworkName, address: W3oAddress, parent: LoggerContext): Observable<W3oAccount> {
        const context = logger.method('autoLogin', { auth, networkName, address, parent });
        return new Observable<W3oAccount>((observer) => {
            try {
                const wharfkit = this.getWharfkitFrom(auth, context);
                const network = this.octopus.networks.getNetwork(networkName, context);
                wharfkit.restoreSession().then((session) => {
                    context.info('Login successful', session);
                    if (!!session) {
                        const address = this.setWharfkitSession(auth, session, network, context);
                        const account = new AntelopeAccount(address, session, auth, context);
                        observer.next(account as W3oAccount);
                        observer.complete();
                    } else {
                        context.info('AutoLogin false');
                    }
                }).catch((error) => {
                    context.error('Auto login failed', error);
                });
            } catch (error) {
                context.error('ERROR:', error);
                observer.error(error);
            }
        });
    }
    // Method to log out
    override logout(auth: W3oAuthenticator, parent: LoggerContext): void {
        const context = logger.method('logout', { auth }, parent);
        try {
            const wharfkit = this.getWharfkitFrom(auth, context);
            wharfkit.logout().then(() => {
                context.info('Logout successful', auth);
            }).catch((error) => {
                context.error('Logout failed', error);
            });
        } catch (error) {
            context.error('ERROR:', error);
            throw new W3oError(W3oError.SESSION_NOT_FOUND, { auth });
        }

    }

}

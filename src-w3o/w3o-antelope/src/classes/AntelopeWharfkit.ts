// src-w3o/w3o-antelope/src/classes/AntelopeWharfkit.ts

import { APIClient } from '@wharfkit/antelope';
import { AccountKit } from '@wharfkit/account';
import { SessionKit, Session } from '@wharfkit/session';
import { WebRenderer } from '@wharfkit/web-renderer';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import { WalletPluginCleos } from '@wharfkit/wallet-plugin-cleos';
import { W3oAntelopeNetworkSettings } from '../types';
import { Logger, LoggerContext } from '@vapaee/w3o-core';

const logger = new Logger('AntelopeAuthAnchor');

export class WharfkitInstance {
    constructor(
        public readonly sessionKit: SessionKit,
        public readonly accountKit: AccountKit,
    ) {}

    private _currentSession?: Session;

    /**
     * Validates if the given EOSIO account exists.
     */
    public async validateAccount(username: string): Promise<boolean> {
        try {
            await this.accountKit.load(username);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Initiates login flow and stores the session.
     */
    public async login(parent: LoggerContext): Promise<Session> {
        const context = logger.method('login', {}, parent);
        context.info('Logging in...');
        const { session } = await this.sessionKit.login();
        this._currentSession = session;
        context.info('Login successful', { session });
        return session;
    }

    /**
     * Logs out the current session.
     */
    public async logout(): Promise<void> {
        if (this._currentSession) {
            await this.sessionKit.logout(this._currentSession);
            this._currentSession = undefined;
        }
    }

    /**
     * Attempts to restore a previously active session.
     */
    public async restoreSession(): Promise<Session | undefined> {
        const session = await this.sessionKit.restore();
        this._currentSession = session;
        return session;
    }

    /**
     * Returns the current active session.
     */
    public get currentSession(): Session | undefined {
        return this._currentSession;
    }

    /**
     * Convenience accessor for the underlying API client.
     */
    public get client() {
        return this._currentSession?.client;
    }
}


export class AntelopeWharfkit {

    public static createSessionKit(appName: string, network: W3oAntelopeNetworkSettings) {
        const sessionKit = new SessionKit({
            appName: appName,
            chains: [
                {
                    id: network.chainId,
                    url: network.rpcUrl
                }
            ],
            ui: new WebRenderer(),
            walletPlugins: [
                new WalletPluginAnchor(),
                new WalletPluginCleos()
            ]
        });
        return sessionKit;
    }

    public static createAccountKit(network: W3oAntelopeNetworkSettings) {
        const client = new APIClient({ url: network.rpcUrl });
        const accountKit = new AccountKit(network.chain, { client });
        return accountKit;
    }

    public static wharfkit(appName: string, network: W3oAntelopeNetworkSettings): WharfkitInstance {
        const sessionKit = AntelopeWharfkit.createSessionKit(appName, network);
        const accountKit = AntelopeWharfkit.createAccountKit(network);
        return new WharfkitInstance(sessionKit, accountKit);
    }


}

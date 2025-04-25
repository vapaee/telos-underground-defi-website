import {
    Logger,
    LoggerContext,
    W3oContractManager,
    W3oNetwork,
    W3oNetworkSettings,
    W3oToken,
    W3oInstance,
    W3oModule,
} from "@vapaee/w3o-core";

import { Observable } from "rxjs";
import { AntelopeContractManager } from "./AntelopeContractManager";
import { W3oAntelopeNetworkSettings } from "../types";
import { AntelopeWharfkit, WharfkitInstance } from "./AntelopeWharfkit";
import { Name } from "@wharfkit/antelope";

const logger = new Logger('AntelopeNetwork');
export class AntelopeNetwork extends W3oNetwork {

    private _settings!: W3oAntelopeNetworkSettings;
    private _wharfkit!: WharfkitInstance;
    constructor(
        settings: W3oAntelopeNetworkSettings,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', {chain: settings.displayName, settings}, parent);
        super(settings, context);
        this._settings = settings;
        this._wharfkit = AntelopeWharfkit.wharfkit('antelope-network', settings);
        W3oModule.registerModule(this, context);
    }

    get antelopeSettings(): W3oAntelopeNetworkSettings {
        return this._settings;
    }

    get wharfkit(): WharfkitInstance {
        return this._wharfkit;
    }

    // Module id ------
    override get w3oVersion(): string {
        return this.antelopeSettings?.w3oVersion ?? '';
    }
    override get w3oName(): string {
        return this.antelopeSettings?.w3oName ?? '';
    }
    override get w3oRequire(): string[] {
        return this.antelopeSettings?.w3oRequire ?? [];
    }

    override snapshot(): any {
        return {
            ... super.snapshot(),
            _class: 'AntelopeNetwork',
            settings: this.settings,
        };
    }

    override createContractManager(network: W3oNetwork, parent: LoggerContext): W3oContractManager {
        const context = logger.method('createContractManager', {chain: network.name, network}, parent);
        if (network instanceof AntelopeNetwork) {
            context.info('AntelopeNetwork contract manager created', parent);
            const manager = new AntelopeContractManager(this.settings, network, context);
            return manager;
        } else {
            context.error(`Invalid network type: Expected AntelopeNetwork, got ${network.constructor.name}`, parent);
            throw new Error(`Invalid network type: ${network.constructor.name}`);
        }
    }
    override getSystemToken(): W3oToken {
        const context = logger.method('getSystemToken', undefined);
        context.error('getSystemToken not implemented');
        return {} as W3oToken;
    }
    override updateState(): Observable<void> {
        const context = logger.method('updateState', undefined);
        context.error('updateState not implemented');
        return new Observable<void>();
    }

    /*
    // Example of how to use the queryContract method to query the EOSIO token balance:
    const params = {
        json: true,
        code: token.account, // Token contract
        scope: session.address.toString(), // Account name
        table: 'accounts', // EOSIO token table
        limit: 100, // Fetch up to 100 token entries
    };
    queryContract(params).subscribe(...)
    */
    override queryContract(params: { [key: string]: any }): Observable<any> {
        const context = logger.method('queryContract', {params});
        return new Observable<any>((observer) => {
            this.wharfkit.accountKit.client.v1.chain.get_table_rows(params as any).then((result: any) => {
                context.info('Query result:', {result});
                observer.next(result);
                observer.complete();
            }).catch((error: any) => {
                context.error('Query error:', {error});
                observer.error(error);
            });
        });
    }

    override validateAccount(username: string, parent: LoggerContext): Observable<boolean> {
        const context = logger.method('validateAccount', {username}, parent);
        return new Observable<boolean>(subscriber => {
            this.wharfkit.accountKit.client.v1.chain.get_account(Name.from(username)).then((result: any) => {
                context.info('Account data:', {result});
                subscriber.next(true);
                subscriber.complete();
            }).catch((error) => {
                context.error('Account failed:', {username, error});
                subscriber.next(false);
                subscriber.complete();
            });
        });
    }

}

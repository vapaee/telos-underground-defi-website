import {
    Logger,
    LoggerContext,
    W3oContractManager,
    W3oNetwork,
    W3oNetworkSettings,
    W3oToken,
    W3oInstance,
} from "@vapaee/w3o-core";

import { Observable } from "rxjs";
import { AntelopeContractManager } from "./AntelopeContractManager";

const logger = new Logger('AntelopeNetwork');
export class AntelopeNetwork extends W3oNetwork {

    octopus!: W3oInstance;

    constructor(
        settings: W3oNetworkSettings,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', {chain: settings.displayName, settings}, parent);
        super(settings, context);
    }

    // Module id ------
    override get w3oVersion(): string {
        return '0.1.0';
    }
    override get w3oName(): string {
        return typeof this.settings?.name == 'string' ? `antelope.network.${this.settings?.name}` : '';
    }
    override get w3oRequire(): string[] {
        return [];
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
    override getTokensList(): W3oToken[] {
        const context = logger.method('getTokensList', undefined);
        context.error('getTokensList not implemented');
        return [];
    }
    override updateState(): Observable<void> {
        const context = logger.method('updateState', undefined);
        context.error('updateState not implemented');
        return new Observable<void>();
    }

}

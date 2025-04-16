import {
    Logger,
    LoggerContext,
    W3oContractManager,
    W3oNetwork,
    W3oNetworkSettings,
    W3oToken,  
} from "@vapaee/w3o-core";

import { Observable } from "rxjs";
import { AntelopeContractManager } from "./AntelopeContractManager";

const logger = new Logger('AntelopeNetwork');
export class AntelopeNetwork extends W3oNetwork {
    constructor(
        settings: W3oNetworkSettings,
        parent?: LoggerContext
    ) {
        const context = logger.method('constructor', {settings}, parent);
        super(settings, context);
    }

    // Module id ------
    override get w3oVersion(): string {
        return '0.1.0';
    }
    override get w3oName(): string {
        return 'antelope-network';
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
        const context = logger.method('createContractManager', {network}, parent);
        const manager = new AntelopeContractManager(this.settings, context);
        return manager;
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

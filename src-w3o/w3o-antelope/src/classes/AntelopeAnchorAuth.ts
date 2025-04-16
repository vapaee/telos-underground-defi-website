import {
    Logger,
    LoggerContext,
    W3oIServices,
    Web3Octopus,                       // Templated class for the main octopus class
    W3oAuthSupportName,
} from '@vapaee/w3o-core';

import { AntelopeAuthSupport } from './AntelopeAuthSupport';

const logger = new Logger('AntelopeAnchorAuth');

export class AntelopeAnchorAuth<T extends W3oIServices> extends AntelopeAuthSupport {
    constructor(
        public octopus: Web3Octopus<T>,
        parent?: LoggerContext,
    ) {
        const context = logger.method('constructor', {octopus}, parent);
        console.log(context);
        super('anchor' as W3oAuthSupportName, context);
    }
    
    // Module id ------
    override get w3oVersion(): string {
        return '0.1.0';
    }
    override get w3oName(): string {
        return 'antelope.anchor.auth';
    }
    override get w3oRequire(): string[] {
        return [];
    }

    // Module init ------
    override init(parent: LoggerContext): void {
        const context = logger.method('init', undefined, parent);
        context.info('AntelopeAnchorAuth custom initialization here');
        super.init(context);
    }

    // Module methods ------
    override snapshot(): any {
        return {
            ... super.snapshot(),
            _class: 'AntelopeAnchorAuth',
        };        
    }
    
}
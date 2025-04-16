import {
    Logger,
    LoggerContext,
    W3oIServices,
    W3oService,
    Web3Octopus,
} from "@vapaee/w3o-core";

const logger = new Logger('AntelopeBalancesService');
export class AntelopeBalancesService<T extends W3oIServices> extends W3oService {
    constructor(
        public path: string,
        octopus: Web3Octopus<T>,
        parent?: LoggerContext
    ) {
        const context = logger.method('constructor', {path, octopus}, parent);
        super(path, context);
    }

    // Module id ------
    override get w3oVersion(): string {
        return '0.0.1';
    }
    override get w3oName(): string {
        return 'antelope.service.balances';
    }
    override get w3oRequire(): string[] {
        return [];
    }

    // Module init ------
    override init(parent: LoggerContext): void {
        const context = logger.method('init', undefined, parent);
        context.info('AntelopeBalancesService custom initialization here');
        super.init(context);
    }

    // Module methods ------
    override snapshot(): any {
        return {
            ... super.snapshot(),
            _class: 'AntelopeBalancesService',
        };        
    }
}
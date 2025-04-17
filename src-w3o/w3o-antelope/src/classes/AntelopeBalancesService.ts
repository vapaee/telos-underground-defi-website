import {
    Logger,
    LoggerContext,
    W3oInstance,
    W3oService,
} from "@vapaee/w3o-core";

const logger = new Logger('AntelopeBalancesService');
export class AntelopeBalancesService extends W3oService {
    constructor(
        path: string,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', {path}, parent);
        super(path, context);
    }

    // Module id ------
    override get w3oVersion(): string {
        return '0.1.0';
    }
    override get w3oName(): string {
        return 'antelope.service.balances';
    }
    override get w3oRequire(): string[] {
        return [
            'antelope.service.tokens@0.1.0'
        ];
    }

    // Module init ------
    override init(octopus: W3oInstance, parent: LoggerContext): void {
        const context = logger.method('init', { octopus }, parent);
        context.info('AntelopeBalancesService OK!', super.w3oId);
        super.init(octopus, context);
    }

    // Module methods ------
    override snapshot(): any {
        return {
            ... super.snapshot(),
            _class: 'AntelopeBalancesService',
        };
    }
}

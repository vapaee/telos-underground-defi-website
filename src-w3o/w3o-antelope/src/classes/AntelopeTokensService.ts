import {
    Logger,
    LoggerContext,
    W3oInstance,
    W3oService,
    W3oModule,
    W3oBalance,
} from "@vapaee/w3o-core";
import { BehaviorSubject, Observable } from "rxjs";

const logger = new Logger('AntelopeTokensService');
export class AntelopeTokensService extends W3oService {

    private __balances$ = new BehaviorSubject<W3oBalance[]>([]);

    constructor(
        path: string,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', {path}, parent);
        super(path, context);
    }

    get balances$(): Observable<W3oBalance[]> {
        return this.__balances$.asObservable();
    }

    // Module id ------
    get w3oVersion(): string {
        return '0.1.0';
    }
    get w3oName(): string {
        return 'antelope.service.tokens';
    }
    get w3oRequire(): string[] {
        return [
            'antelope.network.support@1.0.0',
        ];
    }

    // Module init ------
    override init(octopus: W3oInstance, requirements: W3oModule[], parent: LoggerContext): void {
        const context = logger.method('init', { octopus, requirements }, parent);
        context.info('AntelopeTokensService OK!', super.w3oId);
        super.init(octopus, requirements, context);
    }

    // Balance API ------
    

    // Module methods ------
    override snapshot(): any {
        return {
            ... super.snapshot(),
            _class: 'AntelopeTokensService',
            path: this.path,
        };
    }
}

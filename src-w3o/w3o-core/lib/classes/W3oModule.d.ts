import { BehaviorSubject } from 'rxjs';
import { LoggerContext } from './Logger';
export declare abstract class W3oModule {
    initialized$: BehaviorSubject<boolean>;
    constructor(parent: LoggerContext);
    init(parent: LoggerContext): void;
    abstract get w3oVersion(): string;
    abstract get w3oName(): string;
    abstract get w3oRequire(): string[];
    get w3oId(): string;
    snapshot(): {
        w3oId: string;
        w3oName: string;
        w3oVersion: string;
        w3oRequire: string[];
    };
}

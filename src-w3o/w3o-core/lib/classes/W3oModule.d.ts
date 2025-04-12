import { BehaviorSubject } from 'rxjs';
export declare abstract class W3oModule {
    initialized$: BehaviorSubject<boolean>;
    constructor();
    init(): void;
    abstract get w3oVersion(): string;
    abstract get w3oName(): string;
    abstract get w3oRequire(): string[];
    get w3oId(): string;
    abstract snapshot(): any;
}

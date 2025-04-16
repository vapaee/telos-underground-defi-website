import { LoggerContext, W3oIServices, W3oService, Web3Octopus } from "@vapaee/w3o-core";
export declare class AntelopeTokensService<T extends W3oIServices> extends W3oService {
    path: string;
    constructor(path: string, octopus: Web3Octopus<T>, parent?: LoggerContext);
    get w3oVersion(): string;
    get w3oName(): string;
    get w3oRequire(): string[];
    init(parent: LoggerContext): void;
    snapshot(): any;
}

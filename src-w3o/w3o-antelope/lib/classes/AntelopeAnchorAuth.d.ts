import { LoggerContext, W3oIServices, Web3Octopus } from '@vapaee/w3o-core';
import { AntelopeAuthSupport } from './AntelopeAuthSupport';
export declare class AntelopeAnchorAuth<T extends W3oIServices> extends AntelopeAuthSupport {
    octopus: Web3Octopus<T>;
    constructor(octopus: Web3Octopus<T>, parent?: LoggerContext);
    get w3oVersion(): string;
    get w3oName(): string;
    get w3oRequire(): string[];
    init(parent: LoggerContext): void;
    snapshot(): any;
}

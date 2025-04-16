import { W3oGlobalSettings, W3oModuleInstance } from '../types';
import { LoggerContext } from './Logger';
import { W3oModule } from './W3oModule';
export declare class W3oModuleManager implements W3oModuleInstance {
    private __initialized;
    private __modules;
    constructor(settings: W3oGlobalSettings, parent: LoggerContext);
    registerModule(module: W3oModule, parent: LoggerContext): void;
    init(parent: LoggerContext): void;
}

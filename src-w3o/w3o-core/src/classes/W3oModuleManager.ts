// w3o-core/src/classes/W3oModuleManager.ts

import { combineLatest, tap, filter, take } from 'rxjs';
import {
    W3oGlobalSettings,
    W3oModuleInstance,
    W3oInstance
} from '../types';
import { W3oContextFactory, W3oContext } from './W3oContext';
import { W3oModule } from './W3oModule';
import { W3oError } from './W3oError';
import { W3oManager } from './W3oManager';

const logger = new W3oContextFactory('W3oModuleManager');

/**
 * Class that implements a module manager
 */
export class W3oModuleManager extends W3oManager implements W3oModuleInstance {

    constructor(
        settings: W3oGlobalSettings,
        parent: W3oContext
    ) {
        logger.method('constructor', {settings }, parent);
        super('W3oModuleManager');
    }

    init(octopus: W3oInstance, parent: W3oContext): void {
        const context = logger.method('init', { octopus, modules: Object.keys(W3oModule.modules).toString() }, parent);
        if (this.__initCalled) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { name: 'W3oModuleManager', message: 'Module manager already initialized' });
        }
        this.__initCalled = true;
        const registeredModules = W3oModule.modules;
        const list = Object.values(registeredModules);
        for (const w3oId in registeredModules) {
            const module = W3oModule.getModule(w3oId, context);
            if (!module) {
                context.error('Module not found', { w3oId });
                continue;
            }
            logger.debug('processing module', module.w3oId, 'with requirements', module.w3oRequire, { module });

            if (module.w3oRequire.length === 0) {
                module.init(octopus, [], context);
                continue;
            }

            const resolvedModules = module.w3oRequire.map((req) => {
                const [reqName, reqRange] = req.split('@');
                logger.debug('resolving requirement', { reqName, reqRange });
                const candidates = list.filter((m) => m.w3oId.startsWith(reqName));
                logger.debug('candidates', { candidates });
                const requirementsMet = candidates.find((m) => {
                    const actualVersion = m.w3oId.replace(`${reqName}@`, '');
                    const range = reqRange || actualVersion;
                    return this.versionSatisfies(actualVersion, range, context);
                });
                if (requirementsMet) {
                    return requirementsMet;
                } else {
                    context.error(
                        W3oError.MODULE_REQUIREMENTS_NOT_MET,
                        {
                            module: module.w3oId,
                            requirement: req,
                            message: `Module ${module.w3oId} requires module ${req} to be registered and initialized`
                        }
                    );
                    return null;
                }
            });

            const requirementsSubjects = (resolvedModules as W3oModule[]).map((m) => m.initialized$);

            combineLatest(requirementsSubjects).pipe(
                filter((value) => value.every((v) => !!v)),
                take(1)
            ).subscribe((requirements) => {
                const missingInit = (resolvedModules as W3oModule[])
                    .filter((m) => !m.initialized)
                    .map((m) => m.w3oId);
                if (missingInit.length) {
                    context.error(
                        W3oError.MODULE_REQUIREMENTS_NOT_MET,
                        {
                            module: module.w3oId,
                            not_initialized: missingInit,
                            message: `Module ${module.w3oId} requires modules ${missingInit.join(', ')} to be initialized`
                        }
                    );
                } else {
                    module.init(octopus, requirements, context);
                }
            });
        }

        combineLatest(list.map((m) => m.initialized$)).pipe(
            filter((value) => value.every((v) => !!v)),
            take(1),
            tap(() => {
                this.__initialized$.next(true);
                logger.log('ModuleManager initialized', { modules: Object.keys(W3oModule.modules).toString() });
            })
        ).subscribe();
    }

    /**
     * Parse a version string 'x.y.z' into [x, y, z]
     */
    private parseVersion(version: string): number[] {
        return version.split('.').map((num) => parseInt(num, 10));
    }

    /**
     * Check if actualVersion satisfies the semver range expression
     */
    private versionSatisfies(actualVersion: string, range: string, parent: W3oContext): boolean {
        const context = logger.method('versionSatisfies', { actualVersion, range }, parent);
        const actual = this.parseVersion(actualVersion);
        if (range.startsWith('^')) {
            const base = this.parseVersion(range.slice(1));
            return actual[0] === base[0] &&
                (actual[1] > base[1] || (actual[1] === base[1] && actual[2] >= base[2]));
        }
        if (range.startsWith('~')) {
            const base = this.parseVersion(range.slice(1));
            return actual[0] === base[0] &&
                actual[1] === base[1] &&
                actual[2] >= base[2];
        }
        const expected = this.parseVersion(range);
        const satisfies = actual[0] === expected[0] && actual[1] === expected[1] && actual[2] === expected[2];
        logger.debug('version satisfies', { satisfies, actual, expected });
        return satisfies;
    }

    /**
     * Register a new module using the static W3oModule method
     */
    registerModule(module: W3oModule, parent: W3oContext): void {
        const context = logger.method('registerModule', { w3oId: module.w3oId, module }, parent);
        W3oModule.registerModule(module, context);
    }

    /**
     * Get a registered module by its ID
     */
    getModule<T extends W3oModule = W3oModule>(w3oId: string, parent: W3oContext): T | undefined {
        const context = logger.method('getModule', { w3oId }, parent);
        return W3oModule.getModule(w3oId, context) as T;
    }

    /**
     * Get all registered modules
     */
    getModules(parent: W3oContext): W3oModule[] {
        const context = logger.method('getModules', {}, parent);
        return W3oModule.getModules(context);
    }
}

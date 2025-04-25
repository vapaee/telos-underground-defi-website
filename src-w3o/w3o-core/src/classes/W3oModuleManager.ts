import { combineLatest, BehaviorSubject, tap, filter, take } from 'rxjs';
import {
    W3oGlobalSettings,
    W3oModuleInstance,
    W3oInstance
} from '../types';
import { Logger, LoggerContext } from './Logger';
import { W3oModule } from './W3oModule';
import { W3oError } from './W3oError';

const logger = new Logger('W3oModuleManager');

// Clase que implementa un administrador de módulos
export class W3oModuleManager implements W3oModuleInstance {
    private __initialized = false;

    // private octopus!: W3oInstance;
    constructor(
        settings: W3oGlobalSettings,
        parent: LoggerContext
    ) {
        logger.method('constructor', {settings }, parent);
    }

    init(octopus: W3oInstance, parent: LoggerContext): void {
        const context = logger.method('init', { octopus, modules: Object.keys(W3oModule.modules).toString() }, parent);
        // this.octopus = octopus;
        if (this.__initialized) {
            throw new W3oError(W3oError.ALREADY_INITIALIZED, { name: 'W3oModuleManager', message: 'Module manager already initialized' });
        }
        this.__initialized = true;
        const registeredModules = W3oModule.modules;
        const list = Object.values(registeredModules);
        for (const w3oId in registeredModules) {
            // vamos a checkear que para cada módulo, se cumple que todos los módulos requeridos están registrados
            const module = W3oModule.getModule(w3oId, context);
            if (!module) {
                context.error('Module not found', { w3oId });
                continue;
            }
            context.debug('processing module', module.w3oId, 'with requirements', module.w3oRequire, { module });

            if (module.w3oRequire.length === 0) {
                module.init(octopus, [], context);
                continue;
            }

            // resolve requirements by semver ranges
            const resolvedModules = module.w3oRequire.map((req) => {
                const [reqName, reqRange] = req.split('@');
                const candidates = list.filter((m) => m.w3oId.startsWith(reqName));
                // find a module whose version satisfies the range (default to exact if no '@' present)
                const requirementsMet = candidates.find((m) => {
                    const actualVersion = m.w3oId.replace(`${reqName}@`, '');
                    const range = reqRange || actualVersion;
                    return this.versionSatisfies(actualVersion, range, context);
                });
                if (requirementsMet) {
                    return requirementsMet;
                } else {
                    return null;
                }
            });

            // wait for all requirements to be initialized
            const requirementsSubjects = (resolvedModules as W3oModule[]).map((m) => m.initialized$);

            // wait for all requirements to be initialized filtering by true values
            combineLatest(requirementsSubjects).pipe(
                filter((value) => value.every((v) => !!v)),
                take(1)
            ).subscribe((requirements) => {
                // re-check initialization state
                const missingInit = (resolvedModules as W3oModule[])
                    .filter((m) => !m.initialized$.value)
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
    }

    // Parse a version string 'x.y.z' into [x, y, z]
    private parseVersion(version: string): number[] {
        return version.split('.').map((num) => parseInt(num, 10));
    }

    // Check if actualVersion satisfies the semver range expression
    private versionSatisfies(actualVersion: string, range: string, parent: LoggerContext): boolean {
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
        // exact match
        const expected = this.parseVersion(range);
        const satisfies = actual[0] === expected[0] && actual[1] === expected[1] && actual[2] === expected[2];
        context.debug('version satisfies', { satisfies, actual, expected });
        return satisfies;
    }


    // redirect to static W3oModule methods
    registerModule(module: W3oModule, parent: LoggerContext): void {
        const context = logger.method('registerModule', { w3oId: module.w3oId, module }, parent);
        W3oModule.registerModule(module, context);
    }

    getModule<T extends W3oModule = W3oModule>(w3oId: string, parent: LoggerContext): T | undefined {
        const context = logger.method('getModule', { w3oId }, parent);
        return W3oModule.getModule(w3oId, context) as T;
    }

    getModules(parent: LoggerContext): W3oModule[] {
        const context = logger.method('getModules', {}, parent);
        return W3oModule.getModules(context);
    }

}

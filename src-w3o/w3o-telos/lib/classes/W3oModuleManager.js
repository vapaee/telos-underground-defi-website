"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oModuleManager = void 0;
const _1 = require(".");
const rxjs_1 = require("rxjs");
const logger = new _1.Logger('W3oModuleManager');
// Clase que implementa un administrador de módulos
class W3oModuleManager {
    constructor(settings, parent) {
        this.__initialized = false;
        this.__modules = {};
        logger.method('constructor', { settings }, parent);
    }
    registerModule(module, parent) {
        logger.method('registerModule', { module }, parent);
        if (this.__initialized) {
            throw new _1.W3oError(_1.W3oError.ALREADY_INITIALIZED, { name: 'W3oModuleManager', message: 'modules cannot be registered after initialization' });
        }
        this.__modules[module.w3oId] = module;
    }
    init(parent) {
        logger.method('init', undefined, parent);
        if (this.__initialized) {
            throw new _1.W3oError(_1.W3oError.ALREADY_INITIALIZED, { name: 'W3oModuleManager', message: 'Module manager already initialized' });
        }
        this.__initialized = true;
        for (const w3oId in this.__modules) {
            // vamos a checkear que para cada módulo, se cumple que todos los módulos requeridos están registrados
            const module = this.__modules[w3oId];
            const missing = module.w3oRequire.filter((w3oId) => !this.__modules[w3oId]);
            if (missing.length) {
                throw new _1.W3oError(_1.W3oError.MODULE_REQUIREMENTS_NOT_MET, {
                    module: module.w3oId,
                    missing,
                    message: `Module ${module.w3oId} requires modules ${missing.join(', ')} to be registered`
                });
            }
            if (module.w3oRequire.length === 0) {
                // Si no tiene requerimientos lo iniciamos inmediatamente
                module.init();
            }
            else {
                // si tiene requerimientos, esperamos a que todos los requerimientos estén inicializados
                const requirements = module.w3oRequire.map((w3oId) => this.__modules[w3oId].initialized$);
                // usamos rxjs para esperar a que todos los requerimientos estén inicializados y luego iniciamos el módulo
                (0, rxjs_1.combineLatest)(requirements).subscribe(() => {
                    // hacemos un checkeo adicional para asegurarnos de que todos los requerimientos están inicializados
                    const missing_init = module.w3oRequire.filter((w3oId) => !this.__modules[w3oId].initialized$.value);
                    if (missing_init.length) {
                        throw new _1.W3oError(_1.W3oError.MODULE_REQUIREMENTS_NOT_MET, {
                            module: module.w3oId,
                            not_initialized: missing_init.map((w3oId) => this.__modules[w3oId].w3oId),
                            message: `Module ${module.w3oId} requires modules ${missing_init.join(', ')} to be initialized`
                        });
                    }
                    module.init();
                });
            }
        }
    }
}
exports.W3oModuleManager = W3oModuleManager;
//# sourceMappingURL=W3oModuleManager.js.map
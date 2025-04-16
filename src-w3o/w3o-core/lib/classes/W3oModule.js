"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oModule = void 0;
const rxjs_1 = require("rxjs");
const Logger_1 = require("./Logger");
const logger = new Logger_1.Logger('W3oModule');
// Clase abstracta que representa un módulo (authenticador, network o servicio), su ID ()
class W3oModule {
    constructor(parent) {
        this.initialized$ = new rxjs_1.BehaviorSubject(false);
        logger.method('constructor', { w3oId: this.w3oId }, parent);
    }
    // Método abstracto que deberá ser implementado por los móidulos que lo necesiten
    // esta función será llamada cuando todos los módulos requeridos estén inicializados
    init(parent) {
        logger.method('init', { w3oId: this.w3oId }, parent);
        this.initialized$.next(true);
    }
    // Devuelve el ID del módulo
    get w3oId() {
        return this.w3oName + '@' + this.w3oVersion;
    }
    // Method to take a snapshot of the module identifier
    snapshot() {
        return {
            w3oId: this.w3oId,
            w3oName: this.w3oName,
            w3oVersion: this.w3oVersion,
            w3oRequire: this.w3oRequire,
        };
    }
}
exports.W3oModule = W3oModule;
//# sourceMappingURL=W3oModule.js.map
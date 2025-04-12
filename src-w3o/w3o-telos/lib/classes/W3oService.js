"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oService = void 0;
exports.getOctopus = getOctopus;
const _1 = require(".");
// Clase abstracta que representa un módulo, incluyendo un método para inicializar el módulo y obtener un snapshot del estado interno
class W3oService extends _1.W3oModule {
    constructor(path) {
        super();
        this.path = path;
    }
}
exports.W3oService = W3oService;
// -- ejemplo de uso --
class MyServiceClass extends W3oService {
    constructor(path) {
        super(path);
        this.path = path;
        this.w3oName = 'my-service';
        this.w3oVersion = '1.0.0';
        this.w3oRequire = [];
    }
    init() {
        console.log('init');
        this.initialized$.next(true);
    }
    snapshot() {
        return {};
    }
    hello() {
        console.log('hello');
    }
}
const octopus = new _1.Web3Octopus();
const myService = new MyServiceClass('foo');
function getOctopus() {
    return octopus;
}
// --
const oct = getOctopus();
oct.services.foo.hello();
myService.hello();
//# sourceMappingURL=W3oService.js.map
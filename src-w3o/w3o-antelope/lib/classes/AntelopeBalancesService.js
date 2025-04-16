"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntelopeBalancesService = void 0;
const w3o_core_1 = require("@vapaee/w3o-core");
const logger = new w3o_core_1.Logger('AntelopeBalancesService');
class AntelopeBalancesService extends w3o_core_1.W3oService {
    constructor(path, octopus, parent) {
        const context = logger.method('constructor', { path, octopus }, parent);
        super(path, context);
        this.path = path;
    }
    // Module id ------
    get w3oVersion() {
        return '0.0.1';
    }
    get w3oName() {
        return 'antelope.service.balances';
    }
    get w3oRequire() {
        return [];
    }
    // Module init ------
    init(parent) {
        const context = logger.method('init', undefined, parent);
        context.info('AntelopeBalancesService custom initialization here');
        super.init(context);
    }
    // Module methods ------
    snapshot() {
        return Object.assign(Object.assign({}, super.snapshot()), { _class: 'AntelopeBalancesService' });
    }
}
exports.AntelopeBalancesService = AntelopeBalancesService;
//# sourceMappingURL=AntelopeBalancesService.js.map
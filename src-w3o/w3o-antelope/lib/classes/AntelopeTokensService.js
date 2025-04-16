"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntelopeTokensService = void 0;
const w3o_core_1 = require("@vapaee/w3o-core");
const logger = new w3o_core_1.Logger('AntelopeTokensService');
class AntelopeTokensService extends w3o_core_1.W3oService {
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
        return 'antelope.service.tokens';
    }
    get w3oRequire() {
        return [];
    }
    // Module init ------
    init(parent) {
        const context = logger.method('init', undefined, parent);
        context.info('AntelopeTokensService custom initialization here');
        super.init(context);
    }
    // Module methods ------
    snapshot() {
        return Object.assign(Object.assign({}, super.snapshot()), { _class: 'AntelopeTokensService', path: this.path });
    }
}
exports.AntelopeTokensService = AntelopeTokensService;
//# sourceMappingURL=AntelopeTokensService.js.map
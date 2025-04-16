"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntelopeAnchorAuth = void 0;
const w3o_core_1 = require("@vapaee/w3o-core");
const AntelopeAuthSupport_1 = require("./AntelopeAuthSupport");
const logger = new w3o_core_1.Logger('AntelopeAnchorAuth');
class AntelopeAnchorAuth extends AntelopeAuthSupport_1.AntelopeAuthSupport {
    constructor(octopus, parent) {
        const context = logger.method('constructor', { octopus }, parent);
        console.log(context);
        super('anchor', context);
        this.octopus = octopus;
    }
    // Module id ------
    get w3oVersion() {
        return '0.1.0';
    }
    get w3oName() {
        return 'antelope.anchor.auth';
    }
    get w3oRequire() {
        return [];
    }
    // Module init ------
    init(parent) {
        const context = logger.method('init', undefined, parent);
        context.info('AntelopeAnchorAuth custom initialization here');
        super.init(context);
    }
    // Module methods ------
    snapshot() {
        return Object.assign(Object.assign({}, super.snapshot()), { _class: 'AntelopeAnchorAuth' });
    }
}
exports.AntelopeAnchorAuth = AntelopeAnchorAuth;
//# sourceMappingURL=AntelopeAnchorAuth.js.map
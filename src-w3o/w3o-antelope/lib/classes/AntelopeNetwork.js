"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntelopeNetwork = void 0;
const w3o_core_1 = require("@vapaee/w3o-core");
const rxjs_1 = require("rxjs");
const logger = new w3o_core_1.Logger('AntelopeNetwork');
class AntelopeNetwork extends w3o_core_1.W3oNetwork {
    constructor(settings, parent) {
        const context = logger.method('constructor', { settings }, parent);
        super(settings, context);
    }
    // Module id ------
    get w3oVersion() {
        return '0.1.0';
    }
    get w3oName() {
        return 'antelope-network';
    }
    get w3oRequire() {
        return [];
    }
    snapshot() {
        return Object.assign(Object.assign({}, super.snapshot()), { _class: 'AntelopeNetwork', settings: this.settings });
    }
    createContractManager(network, parent) {
        const context = logger.method('createContractManager', { network }, parent);
        context.error('createContractManager not implemented');
        return {};
    }
    getSystemToken() {
        const context = logger.method('getSystemToken', undefined);
        context.error('getSystemToken not implemented');
        return {};
    }
    getTokensList() {
        const context = logger.method('getTokensList', undefined);
        context.error('getTokensList not implemented');
        return [];
    }
    updateState() {
        const context = logger.method('updateState', undefined);
        context.error('updateState not implemented');
        return new rxjs_1.Observable();
    }
}
exports.AntelopeNetwork = AntelopeNetwork;
//# sourceMappingURL=AntelopeNetwork.js.map
import {
    Logger,
    LoggerContext,
    W3oAddress,
    W3oContract,
    W3oContractManager,
    W3oInstance,
    W3oNetwork,
    W3oNetworkSettings,
} from "@vapaee/w3o-core";

import { Observable } from "rxjs";
import { AntelopeNetwork } from "./AntelopeNetwork";

const logger = new Logger('AntelopeContractManager');
export class AntelopeContractManager extends W3oContractManager {

    constructor(
        settings: W3oNetworkSettings,
        network: AntelopeNetwork,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', {settings}, parent);
        super(settings, network as W3oNetwork, context);
    }

    fetchContract(address: W3oAddress, parent: LoggerContext): Observable<W3oContract | null> {
        const context = logger.method('fetchContract', {address}, parent);
        context.error('fetchContract not implemented');
        return new Observable<W3oContract | null>();
    }

}

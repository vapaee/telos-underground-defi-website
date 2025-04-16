import {
    Logger,
    LoggerContext,
    W3oAddress,
    W3oContract,
    W3oContractManager,
    W3oNetworkSettings,
} from "@vapaee/w3o-core";

import { Observable } from "rxjs";
import { AntelopeNetwork } from "./AntelopeNetwork";

const logger = new Logger('AntelopeNetwork');
export class AntelopeContractManager extends W3oContractManager {

    public network: AntelopeNetwork;
    
    constructor(
        settings: W3oNetworkSettings,
        parent?: LoggerContext
    ) {
        const context = logger.method('constructor', {settings}, parent);
        const network = new AntelopeNetwork(settings, context);
        super(network, context);
        this.network = network;
    }

    fetchContract(address: W3oAddress, parent: LoggerContext): Observable<W3oContract | null> {
        const context = logger.method('fetchContract', {address}, parent);
        context.error('fetchContract not implemented');
        return new Observable<W3oContract | null>();
    }

}

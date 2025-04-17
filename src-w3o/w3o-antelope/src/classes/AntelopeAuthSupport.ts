import {
    Logger,
    LoggerContext,
    W3oAccount,
    W3oAddress,
    W3oAuthenticator,
    W3oAuthSupport,
    W3oAuthSupportName,
    W3oNetworkName,
    W3oNetworkType,
    W3oTransaction,
    W3oTransactionResponse,
} from "@vapaee/w3o-core";

import { Observable } from "rxjs";

const logger = new Logger('AntelopeAuthSupport');

export abstract class AntelopeAuthSupport extends W3oAuthSupport {
    constructor(
        name: W3oAuthSupportName,
        parent: LoggerContext
    ) {
        const context = logger.method('constructor', undefined, parent);
        super(name, 'antelope' as W3oNetworkType, context);
    }
    // Abstract methods from W3oAuthSupport
    override createAuthenticator(parent?: LoggerContext): W3oAuthenticator {
        const context = logger.method('createAuthenticator', undefined, parent);
        return new W3oAuthenticator(this, context);
    }

}

import { LoggerContext, W3oAccount, W3oAddress, W3oAuthenticator, W3oAuthSupport, W3oAuthSupportName, W3oNetworkName, W3oTransaction, W3oTransactionResponse } from "@vapaee/w3o-core";
import { Observable } from "rxjs";
export declare abstract class AntelopeAuthSupport extends W3oAuthSupport {
    constructor(name: W3oAuthSupportName, parent: LoggerContext);
    createAuthenticator(parent?: LoggerContext): W3oAuthenticator;
    isReadOnly(): boolean;
    signTransaction(trx: W3oTransaction, parent: LoggerContext): Observable<W3oTransactionResponse>;
    login(network: W3oNetworkName, parent: LoggerContext): Observable<W3oAccount>;
    autoLogin(network: W3oNetworkName, address: W3oAddress, parent?: LoggerContext): Observable<W3oAccount>;
    logout(parent?: LoggerContext): void;
}

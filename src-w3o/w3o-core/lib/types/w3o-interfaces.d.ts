import { BehaviorSubject } from "rxjs";
import { LoggerContext, W3oAuthenticator, W3oNetwork, W3oSession } from "../classes";
import { W3oAuthSupport } from "../classes/W3oAuthSupport";
import { W3oAddress, W3oAuthSupportName, W3oNetworkName, W3oNetworkType } from "./w3o-types";
export interface W3oTransaction {
}
export interface W3oTransactionReceipt {
}
export interface W3oNetworkLinks {
    explorer: string;
    bridge: string;
    ecosystem: string;
    website: string;
    wallet: string;
}
export interface W3oNetworkSettings {
    type: W3oNetworkType;
    name: W3oNetworkName;
    chainId: string;
    displayName: string;
    links: W3oNetworkLinks;
}
export interface W3oGlobalSettings {
    multiSession: boolean;
    autoLogin: boolean;
}
export interface W3oContractABI {
}
export interface W3oNetworkSupportSettings {
    type: W3oNetworkType;
    auth: W3oAuthSupport[];
    networks: W3oNetwork[];
}
export interface W3oIServices {
    snapshot(): any;
}
export interface W3oInstance {
    sessions: W3oSessionInstance;
    networks: W3oNetworkInstance;
    auth: W3oAuthInstance;
    modules: W3oModuleInstance;
}
export interface W3oSessionInstance {
    createCurrentSession(address: W3oAddress, authenticator: W3oAuthenticator, network: W3oNetwork, parent: LoggerContext): W3oSession;
    deleteSession(id: string, parent: LoggerContext): void;
}
export interface W3oNetworkInstance {
    getNetwork(name: W3oNetworkName, parent: LoggerContext): W3oNetwork;
    onNetworkChange$: BehaviorSubject<W3oNetworkName | null>;
}
export interface W3oAuthInstance {
    createAuthenticator(name: W3oAuthSupportName, parent: LoggerContext): W3oAuthenticator;
}
export interface W3oModuleInstance {
}

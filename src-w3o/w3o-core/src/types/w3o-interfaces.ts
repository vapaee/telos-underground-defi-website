import { BehaviorSubject, Observable } from "rxjs";
import {
    LoggerContext,
    W3oAuthenticator,
    W3oAuthSupport,
    W3oModule,
    W3oNetwork,
    W3oSession,
    W3oToken
} from "../classes";


import {
    W3oAddress,
    W3oAuthSupportName,
    W3oNetworkName,
    W3oNetworkType
} from "./w3o-types";
import { ChainDefinition } from "@wharfkit/common";

// Representa una interface para poder hacer http requests
export interface W3oHttpClient {
    get<T>(url: string): Observable<T>;
}

// Representa una transacción genérica en Web3 Octopus, debe ser especificada por cada implementación
export interface W3oTransaction {}

// Representa el recibo de una transacción, debe ser especificado por cada implementación
export interface W3oTransactionReceipt {}

// Representa los enlaces útiles para una red específica
export interface W3oNetworkLinks {
    explorer: string;
    bridge: string;
    ecosystem: string;
    website: string;
    wallet: string;
}

// Representa la configuración de una red específica
export interface W3oNetworkSettings {
    type: W3oNetworkType;
    name: W3oNetworkName;
    chainId: string;
    displayName: string;
    links: W3oNetworkLinks;
    rpcUrl: string;
    tokensUrl: string;
}

//
export interface W3oGlobalSettings {
    // if multiSession is false, W3oSessionManager we maintain always one open session and logout the user if the network changes
    // if multiSession is true, W3oSessionManager will maintain multiple open sessions
    // if the user changes the network, the current session will be set to null until a specific session is set as current
    multiSession: boolean;

    // if autoLogin is true, Octopus will try to login the user automatically if a session is found on the local storage as current
    autoLogin: boolean;

    // The appName is used to identify the application in the local storage and in the session manager
    appName: string;
}

// Representa el ABI de un contrato, debe ser especificado por cada implementación
export interface W3oContractABI {}

// Representa la configuración de soporte para múltiples redes y autenticadores
export interface W3oNetworkSupportSettings {
    type: W3oNetworkType;
    auth: W3oAuthSupport[];
    networks: W3oNetwork[];
}

export interface W3oIServices {
    snapshot(): any;
}

// --------------------------------------------------------------------------------------------
// Representa la estructura básica abstracta de la instancia principal de Web3 Octopus
export interface W3oInstance {
    settings: W3oGlobalSettings;
    sessions: W3oSessionInstance;
    networks: W3oNetworkInstance;
    auth: W3oAuthInstance;
    modules: W3oModuleInstance;
    getSupportFor(type: string): W3oNetworkSupportSettings;
}

export interface W3oSessionInstance {
    snapshot(): unknown;
    loadSessions(context: LoggerContext): Observable<void>;
    current: W3oSession | null;
    createCurrentSession(address: W3oAddress, authenticator: W3oAuthenticator, network: W3oNetwork, parent: LoggerContext): W3oSession;
    deleteSession(id: string, parent: LoggerContext): void;
    createSession(address: W3oAddress, authenticator: W3oAuthenticator, network: W3oNetwork, parent: LoggerContext): W3oSession
}

export interface W3oNetworkInstance {
    getNetwork(name: W3oNetworkName, parent: LoggerContext): W3oNetwork
    onNetworkChange$: BehaviorSubject<W3oNetworkName | null>
}

export interface W3oAuthInstance {
    createAuthenticator(name: W3oAuthSupportName, network: W3oNetwork, parent: LoggerContext): W3oAuthenticator;
}

export interface W3oModuleInstance {
    registerModule(module: W3oModule, parent: LoggerContext): void;
    getModule<T extends W3oModule = W3oModule>(w3oId: string, parent: LoggerContext): T | undefined;
    getModules(parent: LoggerContext): W3oModule[];
}

// Transfer status ---------------------------------------------------------------------------------------

export type W3oTransferStatus = {
    state: 'none' | 'success' | 'failure';
    message?: string; // Failure or success message
    summary?: W3oTransferSummary; // Null when state is 'failure' or 'none'
};

export interface W3oTransferSummary {
    from: string;
    to: string;
    amount: string;
    transaction: string; // Transaction ID
};

export interface W3oBalance {
    amount: {
        raw: string;
        formatted: string;
    };
    token: W3oToken;
}

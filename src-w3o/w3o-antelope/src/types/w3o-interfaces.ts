// w3o-antelope/src/types/w3o-interfaces.ts

import {
    W3oNetworkSettings,
    W3oTransaction,
    W3oTransferStatus,
    W3oTransferSummary,
} from "@vapaee/w3o-core";
import { ActionType, AnyAction, AnyTransaction } from "@wharfkit/antelope";
import { ChainDefinition } from "@wharfkit/common";
import { SigningRequest } from "@wharfkit/session";

export interface W3oAntelopeNetworkSettings extends W3oNetworkSettings {
    chain: ChainDefinition;
    w3oVersion: string;
    w3oName: string;
    w3oRequire: string[];
}

export interface AntelopeTransferStatus extends W3oTransferStatus {
    summary?: AntelopeTransferSummary;
}

export interface AntelopeTransferSummary extends W3oTransferSummary {
    memo: string; // Memo field for the transfer
}

export interface AntelopeTransaction extends W3oTransaction {
    // Full transaction to sign.
    transaction?: AnyTransaction;
    // Action to sign.
    action?: AnyAction;
    // Actions to sign.
    actions?: AnyAction[];
    // An ESR payload
    request?: SigningRequest | string;
    // Context free actions to include in the transaction
    context_free_actions?: ActionType[];
    // Context free data to include in the transaction
    context_free_data?: string[];
}

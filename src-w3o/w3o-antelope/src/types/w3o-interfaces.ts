import {
    W3oNetworkSettings,
    W3oTransferStatus,
    W3oTransferSummary,
} from "@vapaee/w3o-core";
import { ChainDefinition } from "@wharfkit/common";

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

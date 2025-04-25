// w3o-antelope/src/classes/AntelopeChains.ts

import { AntelopeNetwork, W3oAntelopeNetworkSettings } from '@vapaee/w3o-antelope';
import { W3oContextFactory, W3oContext, W3oNetworkSettings, W3oNetworkLinks, W3oNetworkName, W3oNetworkType } from '@vapaee/w3o-core';
import { Chains } from '@wharfkit/common';

const type = 'antelope' as W3oNetworkType;

// Configuration for Telos mainnet
const TelosZeroConfigJSON: W3oAntelopeNetworkSettings = {
    // Module identifiers
    w3oVersion: '1.0.0',
    w3oName: 'antelope.network.telos',
    w3oRequire: ['antelope.network.support@1.0.0'],
    // Chain settings
    type,
    name: 'telos' as W3oNetworkName,
    chain: Chains.Telos,
    chainId: Chains.Telos.id.toString(),
    displayName: 'Telos Zero',
    rpcUrl: 'https://mainnet.telos.net',
    tokensUrl: 'assets/tokens_mainnet.json',
    links: {
        explorer: '',
        bridge: '',
        ecosystem: '',
        website: 'https://telos.net',
        wallet: 'https://wallet.telos.net'
    } as W3oNetworkLinks
};

// Configuration for Telos testnet
const TelosZeroTestnetConfigJSON: W3oAntelopeNetworkSettings = {
    // Module identifiers
    w3oVersion: '1.0.0',
    w3oName: 'antelope.network.telos-testnet',
    w3oRequire: ['antelope.network.support@1.0.0'],
    // Chain settings
    type,
    name: 'telos-testnet' as W3oNetworkName,
    chain: Chains.TelosTestnet,
    chainId: Chains.TelosTestnet.id.toString(),
    displayName: 'Telos Zero Testnet',
    rpcUrl: 'https://testnet.telos.net',
    tokensUrl: 'assets/tokens_testnet.json',
    links: {
        explorer: '',
        bridge: '',
        ecosystem: '',
        website: 'https://telos.net',
        wallet: 'https://wallet.telos.net'
    } as W3oNetworkLinks
};

// Exported classes for Telos networks
export class TelosZeroNetwork extends AntelopeNetwork {
    constructor(
        settings: Partial<W3oNetworkSettings>,
        parent: W3oContext
    ) {
        const finalSettings = {
            ...TelosZeroConfigJSON,
            ...settings,
        } as W3oAntelopeNetworkSettings;
        const context = (new W3oContextFactory('TelosZeroNetwork'))
            .method('constructor', { chain: finalSettings.displayName, settings }, parent);
        super(finalSettings, context);
    }
}

export class TelosZeroTestnetNetwork extends AntelopeNetwork {
    constructor(
        settings: Partial<W3oNetworkSettings>,
        parent: W3oContext
    ) {
        const finalSettings = {
            ...TelosZeroTestnetConfigJSON,
            chain: Chains.TelosTestnet
        } as W3oAntelopeNetworkSettings;
        const context = (new W3oContextFactory('TelosZeroTestnetNetwork'))
            .method('constructor', { chain: finalSettings.displayName, settings }, parent);
        super(finalSettings, context);
    }
}

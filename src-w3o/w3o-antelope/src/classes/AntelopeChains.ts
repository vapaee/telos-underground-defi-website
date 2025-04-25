import { AntelopeNetwork, W3oAntelopeNetworkSettings } from '@vapaee/w3o-antelope';
import { Logger, LoggerContext, W3oNetworkSettings, W3oNetworkLinks, W3oNetworkName, W3oNetworkType } from '@vapaee/w3o-core';
import { Chains } from '@wharfkit/common';

const type = 'antelope' as W3oNetworkType;

// Configuration for Telos mainnet
const TelosZeroConfigJSON: W3oAntelopeNetworkSettings = {
    // Module identifiers
    w3oVersion: '1.0.0',
    w3oName: 'antelope.network.telos',
    w3oRequire: ['antelope.network.support'],
    // Chain settings
    type,
    name: 'telos' as W3oNetworkName,
    chain: Chains.Telos,
    chainId: Chains.Telos.id.toString(),
    // chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
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
    w3oRequire: ['antelope.network.support'],
    // Chain settings
    type,
    name: 'telos-testnet' as W3oNetworkName,
    chain: Chains.TelosTestnet,
    chainId: Chains.TelosTestnet.id.toString(),
    // chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
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
        parent: LoggerContext
    ) {
        const finalSettings = {
            ...TelosZeroConfigJSON,
            ...settings,
        } as W3oAntelopeNetworkSettings;
        const context = (new Logger('TelosZeroNetwork'))
            .method('constructor', { chain: finalSettings.displayName, settings }, parent);
        super(finalSettings, context);
    }
}

export class TelosZeroTestnetNetwork extends AntelopeNetwork {
    constructor(
        settings: Partial<W3oNetworkSettings>,
        parent: LoggerContext
    ) {
        const finalSettings = {
            ...TelosZeroTestnetConfigJSON,
            chain: Chains.TelosTestnet
        } as W3oAntelopeNetworkSettings;
        const context = (new Logger('TelosZeroTestnetNetwork'))
            .method('constructor', { chain: finalSettings.displayName, settings }, parent);
        super(finalSettings, context);
    }
}

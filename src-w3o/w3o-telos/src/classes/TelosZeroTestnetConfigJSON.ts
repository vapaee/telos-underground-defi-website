import {
    W3oNetworkLinks,
    W3oNetworkName,
    W3oNetworkSettings,
    W3oNetworkType,
} from "@vapaee/w3o-core";

export const TelosZeroTestnetConfigJSON: W3oNetworkSettings = {
    type: 'antelope' as W3oNetworkType,
    name: 'telos-testnet' as W3oNetworkName,
    chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
    displayName: 'Telos Zero Testnet',
    links: {
        explorer: '',
        bridge: '',
        ecosystem: '',
        website: 'https://telos.net',
        wallet: 'https://wallet.telos.net',
    } as W3oNetworkLinks,
} as W3oNetworkSettings;

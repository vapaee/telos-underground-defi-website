import {
    W3oNetworkLinks,
    W3oNetworkName,
    W3oNetworkSettings,
    W3oNetworkType,
} from "@vapaee/w3o-core";

export const TelosZeroConfigJSON: W3oNetworkSettings = {
    type: 'antelope' as W3oNetworkType,
    name: 'telos' as W3oNetworkName,
    chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
    displayName: 'Telos Zero',
    links: {
        explorer: '',
        bridge: '',
        ecosystem: '',
        website: 'https://telos.net',
        wallet: 'https://wallet.telos.net',
    } as W3oNetworkLinks,
} as W3oNetworkSettings;

import {
    Logger,
    LoggerContext,
    W3oNetworkSettings,
} from "@vapaee/w3o-core";
import { AntelopeNetwork } from "@vapaee/w3o-antelope";

import { TelosZeroConfigJSON } from "./TelosZeroConfigJSON";

const logger = new Logger('TelosZeroTestnetNetwork');
export class TelosZeroTestnetNetwork extends AntelopeNetwork {

    constructor(
        settings: W3oNetworkSettings | Object,
        parent: LoggerContext
    ) {
        const finalSettings = { ...TelosZeroConfigJSON, ...settings } as W3oNetworkSettings;
        const context = logger.method('constructor', {chain: finalSettings.displayName, settings}, parent);
        super(finalSettings, context);
    }

    // Module id ------
    override get w3oVersion(): string {
        return '0.1.0';
    }
    override get w3oName(): string {
        return 'antelope.network.telos-testnet';
    }
    override get w3oRequire(): string[] {
        return [];
    }
}

import { W3oContractABI } from '../types';
import { LoggerContext } from './Logger';
export declare abstract class W3oContract {
    readonly address: string;
    readonly name: string;
    readonly abi: W3oContractABI;
    constructor(address: string, name: string, abi: W3oContractABI, parent: LoggerContext);
    snapshot(): any;
}

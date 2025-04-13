import { Observable } from 'rxjs';
import { W3oTransactionReceipt } from '../types';
export declare abstract class W3oTransactionResponse {
    hash: string;
    constructor(hash: string);
    abstract wait(): Observable<W3oTransactionReceipt>;
}

// w3o-core/src/classes/W3oTokenList.ts

import { BehaviorSubject, Observable } from "rxjs";
import { W3oToken } from "./W3oToken";
import { W3oHttpClient } from "../types";

// Representa una lista de tokens, incluyendo métodos para obtener información de los tokens
export abstract class W3oTokenList {

    constructor(
        private http: W3oHttpClient,
        private url: string,
    ) {

    }

    public readonly tokens$ = new BehaviorSubject<W3oToken[]>([]);

    public load(): Observable<W3oToken[]> {
        this.http.get<W3oToken[]>(this.url).subscribe({
            next: tokens => {
                this.tokens$.next(tokens);
            },
            error: err => console.error('Error loading token list:', err),
        });
        return this.tokens$.asObservable();
    }

    getTokens(): W3oToken[] {
        return this.tokens$.getValue(); // Get latest value without subscribing
    }

    // Método para obtener un token por su símbolo
    getTokensBySymbol(symbol: string): W3oToken[] {
        return this.tokens$.getValue().filter(token => token.symbol === symbol);
    }

    // Método para obtener un token por su dirección
    getTokensByAddress(address: string): W3oToken[] {
        return this.tokens$.getValue().filter(token => token.address === address);
    }

    // Metodo para obtener un token por su símbolo o dirección using getTokensBySymbol y getTokensByAddress
    getToken(symbolOrAddress: string): W3oToken | null {
        const tokenBySymbol = this.getTokensBySymbol(symbolOrAddress);
        if (tokenBySymbol.length > 0) {
            return tokenBySymbol[0];
        }
        const tokenByAddress = this.getTokensByAddress(symbolOrAddress);
        if (tokenByAddress.length > 0) {
            return tokenByAddress[0];
        }
        return null;
    }

    // Método abstracto para tomar una instantánea del estado de la lista de tokens
    abstract snapshot(): any;
}

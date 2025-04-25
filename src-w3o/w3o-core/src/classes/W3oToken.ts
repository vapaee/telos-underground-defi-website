import { W3oContract } from "./W3oContract";

// Representa un token, incluyendo métodos para obtener información del token y su contrato asociado
export abstract class W3oToken {

    get name(): string {
        return this.getDisplayName();
    }

    get symbol(): string {
        return this.getSymbol();
    }

    get account(): string {
        return this.getContract().address;
    }

    get address(): string {
        return this.getContract().address;
    }

    get precision(): number {
        return this.getDecimals();
    }

    get logo(): string {
        return this.getIconUrl();
    }

    get chain(): string {
        return 'chain?';
    }

    // Método abstracto para verificar si es el token del sistema
    abstract isSystemToken(): boolean;

    // Método abstracto para obtener la URL del icono del token
    abstract getIconUrl(): string;

    // Método abstracto para obtener el nombre para mostrar del token
    abstract getDisplayName(): string;

    // Método abstracto para obtener el símbolo del token
    abstract getSymbol(): string;

    // Método abstracto para obtener los decimales del token
    abstract getDecimals(): number;

    // Método abstracto para obtener el precio en USD del token
    abstract getUSDPrice(): number;

    // Método abstracto para obtener el contrato del token
    abstract getContract(): W3oContract;

    // Método abstracto para tomar una instantánea del estado del token
    abstract snapshot(): any;
}

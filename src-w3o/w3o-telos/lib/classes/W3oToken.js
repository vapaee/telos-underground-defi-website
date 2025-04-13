"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.W3oToken = void 0;
// Representa un token, incluyendo métodos para obtener información del token y su contrato asociado
class W3oToken {
    // Getter para obtener el símbolo del token
    get symbol() {
        return this.getSymbol();
    }
    // Getter para obtener al dirección del contrato del token
    get address() {
        return this.getContract().address;
    }
}
exports.W3oToken = W3oToken;
//# sourceMappingURL=W3oToken.js.map
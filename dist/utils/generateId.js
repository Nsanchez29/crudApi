"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const generateUniqueId = () => {
    const timestamp = Date.now().toString(36); // Representación base 36 del timestamp
    const randomSuffix = Math.random().toString(36).substring(2, 8); // Cadena aleatoria de 6 caracteres
    return `${timestamp}-${randomSuffix}`;
};
exports.generateUniqueId = generateUniqueId;

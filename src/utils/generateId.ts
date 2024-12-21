export const generateUniqueId = (): string => {
    const timestamp = Date.now().toString(36); // Representación base 36 del timestamp
    const randomSuffix = Math.random().toString(36).substring(2, 8); // Cadena aleatoria de 6 caracteres
    return `${timestamp}-${randomSuffix}`;
};

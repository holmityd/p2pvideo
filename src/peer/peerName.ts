
const prefixes = ["Astro", "Neo", "Hyper", "Ultra", "Xeno", "Omnis", "Proto", "Meta"]
const roots = ["Chron", "Lith", "Techno", "Naut", "Pulse", "Byte", "Flux", "Nova"]
const suffixes = ["ex", "ius", "ior", "onix", "ion", "igen", "ation", "otron"]
export const secret = 'DtzPyGGEC2P8DJGkgKynFYyqLFrudMzt';

function getRandomArrValue(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateName(): string {
    let prefix = getRandomArrValue(prefixes);
    let root = getRandomArrValue(roots);
    let suffix = getRandomArrValue(suffixes);
    return secret + prefix + root + suffix;
}

export function getName(str: string): string {
    return str.substring(secret.length);
}

// function generatePrefix(): string {
//     const array = new Uint8Array(16);
//     window.crypto.getRandomValues(array);
//     const secretHex = Array.from(array).map(byte => byte.toString(16).padStart(2, '0')).join('');
//     return secretHex;
// }
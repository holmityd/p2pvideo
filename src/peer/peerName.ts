
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
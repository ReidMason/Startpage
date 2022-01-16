import { v4 as uuidv4 } from 'uuid';

export function getUnixTime(): number {
    // Gets unix time in seconds
    return Math.floor(Date.now() / 1000)
}

export function generateUuid(): string {
    return uuidv4();
}

export function isNumeric(text: string) {
    // Tests if a string is numeric
    return /^\d+$/.test(text);
}

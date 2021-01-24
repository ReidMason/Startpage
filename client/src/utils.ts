import { v4 as uuidv4 } from 'uuid';

export function joinUrl(...paths: Array<string>): string {
    // Remove trailing and leading slashes
    paths = paths.map((path) => path.replace(/^\/*|\/*$/gm, ""))

    return paths.join("/")
}

export function createRequestUrl(endpoint: string): string {
    const baseUrl: string = process.env.REACT_APP_BASE_URL!;

    return joinUrl(baseUrl, endpoint)
}

export function generateUuid(): string {
    return uuidv4();
}
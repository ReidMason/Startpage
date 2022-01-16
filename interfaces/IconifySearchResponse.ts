export interface Request {
    query: string;
    limit: string;
}

export interface IconifySearchResponse {
    icons: Array<string>;
    total: number;
    limit: number;
    start: number;
    request: Request;
}

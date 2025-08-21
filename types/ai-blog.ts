export interface AIBlogResponse {
    content: string;
    generated: boolean;
    fallback: boolean;
    timestamp: string;
    error?: string;
}

export interface AIBlogErrorResponse {
    error: string;
}

export interface AIBlogRequest {
    title: string;
    context?: string;
}

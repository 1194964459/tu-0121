declare module 'lodash-es' {
    export function throttle<T extends (...args: any[]) => any>(func: T, wait?: number, options?: any): T & { cancel(): void; flush(): void };
    export function debounce<T extends (...args: any[]) => any>(func: T, wait?: number, options?: any): T & { cancel(): void; flush(): void };
}

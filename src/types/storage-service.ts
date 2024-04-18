export interface IStorageService {
    setItem<T>(key: string, value: T): void;
    getItem<T>(key: string): T;
    clearItem(key: string): void;
}
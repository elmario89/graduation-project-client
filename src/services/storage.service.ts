import {IStorageService} from "../types/storage-service";

export class StorageService implements IStorageService {
    setItem<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getItem<T>(key: string): T {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    }

    clearItem(key: string): void {
        localStorage.removeItem(key);
    }
}
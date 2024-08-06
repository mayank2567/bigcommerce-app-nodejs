import { SessionProps } from './index';

export interface StoreData {
    accessToken?: string;
    scope?: string;
    storeHash: string;
}

export interface UserData {
    email: string;
    username?: string;
    charCount?: number;
    id?: number;
}

export interface Db {
    hasStoreUser(storeHash: string, userId: string): Promise<boolean> | boolean;
    getUser(email: string, id: number): Promise<UserData>;
    setUser(session: SessionProps): Promise<void>;
    setStore(session: SessionProps): Promise<void>;
    setStoreUser(session: SessionProps): Promise<void>;
    getStoreToken(storeId: string): Promise<string> | null;
    deleteStore(session: SessionProps): Promise<void>;
    deleteUser(session: SessionProps): Promise<void>;
}

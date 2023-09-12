export interface IHash {
    hash(plain: string): Promise<string>;
    verify(hashed: string, plain: string): Promise<boolean>;
}
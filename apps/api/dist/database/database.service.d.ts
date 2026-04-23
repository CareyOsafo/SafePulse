import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
export declare class DatabaseService {
    private readonly pool;
    constructor(pool: Pool);
    query<T extends QueryResultRow = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
    getClient(): Promise<PoolClient>;
    transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
    queryOne<T extends QueryResultRow = any>(sql: string, params?: any[]): Promise<T | null>;
    queryMany<T extends QueryResultRow = any>(sql: string, params?: any[]): Promise<T[]>;
    mutateOne<T extends QueryResultRow = any>(sql: string, params?: any[]): Promise<T | null>;
}

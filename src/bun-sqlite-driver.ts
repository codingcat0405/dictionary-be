import { Database } from "bun:sqlite"

class BunSqliteStatement {
    constructor(private stmt: ReturnType<Database["prepare"]>) { }

    get reader() {
        return this.stmt.columnNames.length > 0
    }

    run(...params: any[]) {
        return this.stmt.run(...params)
    }

    get(...params: any[]) {
        return this.stmt.get(...params)
    }

    all(...params: any[]) {
        return this.stmt.all(...params)
    }
}

export class BunSqliteDriver {
    private db: Database

    constructor(filename: string, options?: { readonly?: boolean }) {
        this.db = options?.readonly
            ? new Database(filename, { readonly: true })
            : new Database(filename)
    }

    prepare(sql: string) {
        return new BunSqliteStatement(this.db.prepare(sql))
    }

    pragma(pragma: string) {
        return this.db.prepare(`PRAGMA ${pragma}`).all()
    }

    close() {
        this.db.close()
    }
}

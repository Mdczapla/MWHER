import BaseTask from './BaseTask.js';

export class SqlTask extends BaseTask {
    constructor(id, name, config) {
        super(id, name, config);
        this.targetQuery = config.query || "SELECT key FROM system WHERE id=6";
        this.difficulty = config.difficulty || "medium";
        this.db = this._buildDatabase(config.table);
    }

    _buildDatabase(rawTableData) {
        const db = {};
        if (rawTableData.type === 'table') {
            // Easy & Medium
            db[rawTableData.name] = rawTableData.content;
        } else if (rawTableData.type === 'dbase' && rawTableData.children) {
            // Hard
            for (const key in rawTableData.children) {
                const tbl = rawTableData.children[key];
                db[tbl.name] = tbl.content;
            }
        }
        return db;
    }

    _prefixRow(row, tableName) {
        const newRow = {};
        for (const key in row) {
            newRow[`${tableName}.${key}`] = row[key];   // with prefix (sys.id)
            //newRow[key] = row[key];                     // without prefix (id)
        }
        return newRow;
    }

    init() {
        super.init();

        let instruction = [
            "[BAZA DANYCH: SYSTEM]\n",
            "Twoim zadaniem jest wykonanie komendy SQL, aby uzyskać potrzebne informacje.\n",
        ];

        const tables = Object.keys(this.db).join(', ');
        instruction.push(`Dostępne tabele: [ ${tables} ]\n`);

        // todo: zmienić instrukcje na mniej bezposrednie
        if (this.difficulty === 'easy') {
            instruction.push("Musisz wydobyć nazwy użytkowników, które są przechowywane w tabeli 'system'.\n");
        } else if (this.difficulty === 'medium') {
            instruction.push("Musisz znaleźć odpowiedni klucz systemu, który jest przechowywany w tabeli 'system'.\n");
        } else if (this.difficulty === 'hard') {
            instruction.push("Podczas uszkodzenia systemu tabele zostały rozdzielone, musisz je połączyć, a następnie wydobyć klucz.\n");
        }
        
        return instruction
    }

    validate(input) {
        const cleanInput = input.trim().replace(/;$/, '');
        const userResult = this.handleQuery(cleanInput);

        if (userResult.startsWith("BŁĄD")) {
            return [false, userResult];
        }

        const targetResult = this.handleQuery(this.targetQuery);

        if (userResult === targetResult) {
            this.complete();
            if (this.difficulty === 'easy') {
                return [true, `Wykonano pomyślnie.\nNazwa użytkownika: ${userResult.split('\n')[2].trim()}`];
            }else if (this.difficulty === 'medium') {
                return [true, `Wykonano pomyślnie.\nKlucz systemu: ${userResult.split('\n')[2].trim()}`];
            }else {
                return [true, `Wykonano pomyślnie.\nKlucz rozbitego systemu: ${userResult.split('\n')[2].trim()}`];
            }
            
        } else {
            return [false, `[SQL FAILURE] Wynik niepoprawny lub pusty.\nTwój wynik:\n${userResult}`];
        }
    }

    applyWhere(data, whereClause) {
        const whereRegex = /([a-zA-Z0-9_.]+)\s*(=|!=|>=|<=|>|<)\s*(?:(['"])(.*?)\3|(\S+))/;
        const match = whereClause.match(whereRegex);

        if (!match) return data;

        const [, column, operator, quote, quotedVal, unquotedVal] = match;
        
        let targetVal = quotedVal !== undefined ? quotedVal : unquotedVal;
        if (!quote && !isNaN(targetVal)) targetVal = Number(targetVal);

        return data.filter(row => {
            let rowVal = row[column];
            if (rowVal === undefined && !column.includes('.')) {
                const key = Object.keys(row).find(k => k.endsWith('.' + column));
                if (key) rowVal = row[key];
            }

            switch (operator) {
                case '=': return rowVal == targetVal;
                case '!=': return rowVal != targetVal;
                case '>': return rowVal > targetVal;
                case '<': return rowVal < targetVal;
                case '>=': return rowVal >= targetVal;
                case '<=': return rowVal <= targetVal;
                default: return false;
            }
        });
    }

    handleQuery(query) {
        const sqlRegex = /SELECT\s+(.+?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+INNER JOIN\s+([a-zA-Z0-9_]+)\s+ON\s+(.+?))?(?:\s+WHERE\s+(.+))?$/i;
        
        const normalizedQuery = query.replace(/\s+/g, ' ').trim();
        const match = normalizedQuery.match(sqlRegex);

        if (!match) {
            return `BŁĄD: Niepoprawna składnia SQL. Oczekiwano formatu: SELECT ... FROM ... [WHERE ...]`;
        }

        const [, selectPart, fromTable, joinTable, joinCondition, wherePart] = match;

        if (!this.db[fromTable]) {
            return `BŁĄD: Tabela '${fromTable}' nie istnieje.`;
        }
        
        let workingData = this.db[fromTable].map(row => this._prefixRow(row, fromTable));
        // JOIN 
        if (joinTable && joinCondition) {
            if (!this.db[joinTable]) return `BŁĄD: Tabela '${joinTable}' nie istnieje.`;
            
            const rightData = this.db[joinTable].map(row => this._prefixRow(row, joinTable));
            
            const onMatch = joinCondition.match(/([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/);
            if (!onMatch) return "BŁĄD: Niepoprawny warunek ON.";
            
            const [ , keyLeft, keyRight ] = onMatch;

            const joinedData = [];
            
            workingData.forEach(leftRow => {
                rightData.forEach(rightRow => {
                    const valA = leftRow[keyLeft] !== undefined ? leftRow[keyLeft] : rightRow[keyLeft];
                    const valB = rightRow[keyRight] !== undefined ? rightRow[keyRight] : leftRow[keyRight];
                    if (valA == valB) { 
                        joinedData.push({ ...leftRow, ...rightRow });
                    }
                });
            });
            workingData = joinedData;
        }

        // WHERE
        if (wherePart) {
            workingData = this.applyWhere(workingData, wherePart);
        }

        if (workingData.length === 0) return "(brak wyników)";

        // SELECT
        const columns = selectPart.trim() === '*' 
            ? Object.keys(workingData[0] || {}) 
            : selectPart.split(',').map(c => c.trim());

        let output = columns.join(' | ') + '\n';
        output += '-'.repeat(output.length) + '\n';

        output += workingData.map(row => {
            return columns.map(col => {
                if (row[col] !== undefined) return row[col];
                
                const matchKey = Object.keys(row).find(k => k.endsWith('.' + col) || k === col);
                return matchKey ? row[matchKey] : 'NULL';
            }).join(' | ');
        }).join('\n');

        return output;
    }
}



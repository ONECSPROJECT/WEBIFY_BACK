const db = require('../config/db');

class BaseModel {
    constructor(table) {
        this.table = table;
    }

    async create(data) {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map(() => '?').join(', ');

        return db.query(
            `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${placeholders})`,
            values
        );
    }
 
    

    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
    
        if (keys.length === 0) {
            throw new Error("No fields provided for update.");
        }
    
        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const idField = this.getPrimaryKey(); // Dynamically get primary key
        const query = `UPDATE ${this.table} SET ${setClause} WHERE ${idField} = ?`;
    
        values.push(id); // Add id to values array
    
        return db.query(query, values);
    }
    
    

    async delete(id, idField = 'id') {
        return db.query(`DELETE FROM ${this.table} WHERE ${idField} = ?`, [id]);
    }

    async getById(id) {
        const idField = this.getPrimaryKey();
        return db.query(`SELECT * FROM ${this.table} WHERE ${idField} = ?`, [id]);
    }
    
    getPrimaryKey() {
        const primaryKeys = {
            'User': 'user_id',
            'Account': 'account_id',
            'SessionType': 'session_type_id',
            'Schedule': 'session_id',
            'ProfRank': 'rank_id',
            'Period': 'period_id',
            'Payment': 'payment_id',
            'AbsenceRecord': 'record_id',
            'PasswordReset': 'reset_id'
        };
        return primaryKeys[this.table] || 'id'; // Default to 'id' if not found
    }
    

    async getAll() {
        return db.query(`SELECT * FROM ${this.table}`);
    }
}

module.exports = BaseModel;

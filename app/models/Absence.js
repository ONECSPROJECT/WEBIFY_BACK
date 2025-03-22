const db = require('../config/db');

class Absence {
    // single day track
    static async createSingleDayAbsence(professor_id, period_id, date, missed_hours) {
        return db.query(
            `INSERT INTO AbsenceRecord (professor_id, period_id, date, missed_hours) VALUES (?, ?, ?, ?)`,
            [professor_id, period_id, date, missed_hours]
        );
    }

    // long-term absence
    static async createLongTermAbsence(professor_id, period_id, start_date, end_date, missed_hours_per_day) {
        const queries = [];
        for (let d = new Date(start_date); d <= new Date(end_date); d.setDate(d.getDate() + 1)) {
            const formattedDate = parseInt(
                d.toISOString().split('T')[0].replace(/-/g, ""), 10
            ); 
    
            queries.push(db.query(
                `INSERT INTO AbsenceRecord (professor_id, period_id, date, missed_hours) VALUES (?, ?, ?, ?)`,
                [professor_id, period_id, formattedDate, missed_hours_per_day]
            ));
        }
        return Promise.all(queries);
    }


    static async getAbsencesByProfessor(professor_id) {
        return db.query(
            `SELECT * FROM AbsenceRecord WHERE professor_id = ?`,
            [professor_id]
        );
    }

 
    static async deleteAbsenceById(record_id) {
        return db.query(`DELETE FROM AbsenceRecord WHERE record_id = ?`, [record_id]);
    }


    static async deleteLongTermAbsences(professor_id, start_date, end_date) {
        return db.query(
            `DELETE FROM AbsenceRecord WHERE professor_id = ? AND date BETWEEN ? AND ?`,
            [professor_id, start_date, end_date]
        );
    }
}

module.exports = Absence;
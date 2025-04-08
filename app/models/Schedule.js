const pool = require('../config/db');

class Schedule {
    static async createSession({ professor_id, promo_id, speciality_id = null, session_type, info }) {
        const { start_time, duration_minutes, day_of_week, is_extra } = info;

        const result = await pool.query(
            'INSERT INTO Schedule (professor_id, promo_id, speciality_id, session_type, day_of_week, start_time, duration_minutes, is_extra) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [professor_id, promo_id, speciality_id, session_type, day_of_week, start_time, duration_minutes, is_extra]
        );
        return result.insertId; // check [https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#json-result-sets]
    }

    static async getProfessorIdByLastName(lastName) {
        return pool.query(
            'SELECT user_id FROM User WHERE last_name = ?',
            [lastName]
        );
    }

    static async getPromoIdByName(name) {
        return pool.query(
            'SELECT promo_id FROM Promo WHERE name = ?',
            [name]
        );
    }

    static async getSpecialityIdByName(name) {
        return pool.query(
            'SELECT speciality_id FROM Speciality WHERE name = ?',
            [name]
        );
    }

    static async getSessionTypeIdByName(name) {
        return pool.query(
            'SELECT session_type_id FROM SessionType WHERE name = ?',
            [name]
        );
    }
}

module.exports = Schedule;



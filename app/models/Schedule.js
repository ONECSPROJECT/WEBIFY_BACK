const pool = require('../config/db');

class Schedule {
    static async createSession({ professor_id, promo_id, speciality_id = null, session_type, info }) {
        const { start_time, duration_minutes, day_of_week, is_extra } = info;
        return;

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


    // this is just to populate (half-hearted solution for now... 'i know im getting myself technical debt xD')
    static async createProfessor(lastName) {
        const result = await pool.query(
            'INSERT INTO User (last_name) VALUES (?)',
            [lastName]
        );
        return result.insertId;
    }

    static async createPromo(name) {
        const result = await pool.query(
            'INSERT INTO Promo (name) VALUES (?)',
            [name]
        );
        return result.insertId;
    }

    static async createSpeciality(name) {
        const result = await pool.query(
            'INSERT INTO Speciality (name) VALUES (?)',
            [name]
        );
        return result.insertId;
    }

    static async createSessionType(name) {
        const result = await pool.query(
            'INSERT INTO SessionType (name, conversion_factor, hierarchy_level) VALUES (?, ?, ?)',
            [name, 1, 1] // default values for conversion_factor and hierarchy_level
        );
        return result.insertId;
    }
}

module.exports = Schedule;

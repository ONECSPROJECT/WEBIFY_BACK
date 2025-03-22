const Absence = require('../models/Absence');
const db = require('../config/db');

class AbsenceController {
    static async createSingleDayAbsence(req, res) {
        let conn;
        try {
              conn = await db.getConnection();
            console.log(req.body);

            const { professor_id, period_id, date, missed_hours } = req.body;
            if (!professor_id || !period_id || !date || !missed_hours) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const [rows] = await conn.query("SELECT * FROM Period WHERE period_id = ?", [period_id]);

            if (!rows || rows.length === 0) {
                return res.status(400).json({ error: "Period not found" });
            }
            console.log("Professor ID:", req.body.professor_id);
            console.log("Period ID:", req.body.period_id);


            await Absence.createSingleDayAbsence(professor_id, period_id, date, missed_hours);
            res.status(201).json({ message: "Single-day absence recorded successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createLongTermAbsence(req, res) {
        try {
            const { professor_id, period_id, start_date, end_date, missed_hours_per_day } = req.body;
            if (!professor_id || !period_id || !start_date || !end_date || !missed_hours_per_day) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            await Absence.createLongTermAbsence(professor_id, period_id, start_date, end_date, missed_hours_per_day);
            res.status(201).json({ message: "Long-term absence recorded successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProfessorAbsences(req, res) {
        try {
            const { professor_id } = req.params;
            if (!professor_id) {
                return res.status(400).json({ message: "Missing professor_id" });
            }

            const absences = await Absence.getAbsencesByProfessor(professor_id);
            res.status(200).json({ absences });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteSingleDayAbsence(req, res) {
        try {
            const { record_id } = req.params;
            if (!record_id) {
                return res.status(400).json({ message: "Missing record_id" });
            }

            await Absence.deleteAbsenceById(record_id);
            res.status(200).json({ message: "Single-day absence deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteLongTermAbsence(req, res) {
        try {
            const { professor_id, start_date, end_date } = req.body;
            if (!professor_id || !start_date || !end_date) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            await Absence.deleteLongTermAbsences(professor_id, start_date, end_date);
            res.status(200).json({ message: "Long-term absences deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AbsenceController;
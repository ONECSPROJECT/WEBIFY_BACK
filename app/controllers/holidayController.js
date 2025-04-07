const BaseModel = require('../models/BaseModel');
const Holiday = new BaseModel('Holidays');

class HolidayController {
    static async createHoliday(req, res) {
        try {
            const { startDate, endDate } = req.body;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            await Holiday.create({ startDate, endDate });
            res.status(201).json({ message: "Holiday created successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateHoliday(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Holiday ID is required" });
            }
            await Holiday.update(id, req.body);
            res.status(200).json({ message: "Holiday updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteHoliday(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Holiday ID is required" });
            }
            await Holiday.delete(id, "holiday_id"); 
            res.status(200).json({ message: "Holiday deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllHolidays(req, res) {
        try {
            const holidays = await Holiday.getAll();
            res.status(200).json(holidays);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getHolidayById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "holiday ID is required" });
            }
            const holiday = await Holiday.getById(id);
            res.status(200).json(holiday);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = HolidayController;

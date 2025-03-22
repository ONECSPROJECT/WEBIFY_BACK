// const BaseModel = require('../models/BaseModel');
// const Period = new BaseModel('Period');

// class PeriodController {
//     static async createPeriod(req, res) {
//         try {
//             const newPeriod = await Period.create(req.body);
//             res.status(201).json({ message: 'Period created successfully', period: newPeriod });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async updatePeriod(req, res) {
//         try {
//             const { period_id } = req.params;
//             const updatedPeriod = await Period.update(period_id, req.body);
//             res.status(200).json({ message: 'Period updated successfully', period: updatedPeriod });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async deletePeriod(req, res) {
//         try {
//             const { period_id } = req.params;
//             await Period.delete(period_id);
//             res.status(200).json({ message: 'Period deleted successfully' });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async getAllPeriods(req, res) {
//         try {
//             const periods = await Period.getAll();
//             res.status(200).json(periods);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     static async getPeriodById(req, res) {
//         try {
//             const { period_id } = req.params;
//             const period = await Period.getOne(period_id);
//             res.status(200).json(period);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// }

// module.exports = PeriodController;
const BaseModel = require('../models/BaseModel');
const Period = new BaseModel('Period');

class PeriodController {
    static async createPeriod(req, res) {
        try {
            const { professor_id, start_date, end_date, rank_id } = req.body;
            if (!professor_id || !start_date || !end_date) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            await Period.create({ professor_id, start_date, end_date, rank_id });
            res.status(201).json({ message: "Period created successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updatePeriod(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Period ID is required" });
            }
            await Period.update(id, req.body);
            res.status(200).json({ message: "Period updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deletePeriod(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Period ID is required" });
            }
            await Period.delete(id, "period_id"); // Specify primary key name
            res.status(200).json({ message: "Period deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
}

module.exports = PeriodController;

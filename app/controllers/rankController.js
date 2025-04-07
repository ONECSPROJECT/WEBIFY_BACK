const BaseModel = require('../models/BaseModel');
const Rank = new BaseModel('Rank');

class RankController {
    static async getAllRanks(req, res) {
        try {
            const ranks = await Rank.getAll();
            res.status(200).json(ranks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRankById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Rank ID is required" });
            }
            const rank = await Rank.getById(id);
            res.status(200).json(rank);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createRank(req, res) {
        try {
            const { name, pay_rate_course, pay_rate_lab, pay_rate_tutorial } = req.body;
            if (!name || !pay_rate_course || !pay_rate_lab || !pay_rate_tutorial) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            await Rank.create({ name, pay_rate_course, pay_rate_lab, pay_rate_tutorial });
            res.status(201).json({ message: "Rank created successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRank(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Rank ID is required" });
            }
            await Rank.update(id, req.body);
            res.status(200).json({ message: "Rank updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteRank(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Rank ID is required" });
            }
            await Rank.delete(id, "rank_id");
            res.status(200).json({ message: "Rank deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RankController;

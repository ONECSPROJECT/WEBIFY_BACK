const assert = require('node:assert/strict');
const Schedule = require('../models/Schedule');
const { getSessionsForAllTeachers, initialParsing } = require('../utils/excelParser');


exports.uploadSchedule = async (req, res) => {
    // req.files returns this:
    // [
    //   {
    //     fieldname: 'file',
    //     originalname: 'file.txt',
    //     encoding: '7bit',
    //     mimetype: 'text/plain',
    //     destination: '../uploads/',
    //     filename: '55e59603019370616f626091429f6b6e',
    //     path: '../uploads/55e59603019370616f626091429f6b6e',
    //     size: 12
    //   }
    // ]

    const file = req.files[0]; // in the future i will only accept files by certain names?
    const originalName = file['originalname'];
    assert.match(
        originalName.toLowerCase(),
        /\.(xlsx|xls)$/i,
        "Invalid file format. Only .xlsx or .xls files are allowed."
    );
    const path = file['path'];

    const [weekDays, teachersName] = initialParsing(path);
    console.log(getSessionsForAllTeachers(weekDays, teachersName));
}

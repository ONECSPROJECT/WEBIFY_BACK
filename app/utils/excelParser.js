#!/usr/bin/env node

var XLSX = require('xlsx');
var rawData = null;

function initialParsing(filename) {
    var workbook = XLSX.readFile(filename);

    // playing around with the tool to figure it out...
    const sheetNames = workbook.SheetNames;
    // console.log(sheetNames); // [ 'Affectation' ]

    const firstSheet = workbook.Sheets[sheetNames[0]];
    // console.log(firstSheet); // The Sheets property of the workbook object5 is an object whose keys are sheet names and whose values are sheet objects

    rawData = XLSX.utils.sheet_to_json(firstSheet, { 'header': 1 });
    // console.log(rawData); // will generate an array of arrays

    // dumping teachers' names
    const teachersName = [...new Set(rawData.slice(1).map(row => row[0]))];
    const weekDays = rawData[0].slice(1).filter(_ => _);

    return [weekDays, teachersName];
}

function getDurationMinutes(taw9eet) {
    const splitTaw9eet = taw9eet.split('-');

    const convertToMinutes = (time) => {
        // Check if the time contains a ':' (hour:minute format)
        if (time.includes(':')) {
            const [hours, minutes] = time.slice(0, -1).split(':').map(Number); // Remove 'h' and split
            return hours * 60 + minutes;
        } else if (time.includes('h')) {
            const [hours, minutes] = time.split('h').map(Number);
            return hours * 60 + minutes;
        } else {
            // If no ':' in the time, it's in 'hh' format
            return Number(time.slice(0, -1)) * 60; // Remove 'h' and convert to minutes
        }
    };

    const startTime = convertToMinutes(splitTaw9eet[0]);
    const endTime = convertToMinutes(splitTaw9eet[1]);

    return endTime - startTime;
}

function getSessionForDay(weekDay, teacherName) {
    // Structure of sessions
    // let session = {
    //      'last_name': ...,
    //      'name': ...,
    //      'promo': ...,
    //      'speciality': ...,
    //      'start_time': ...,
    //      'duration_minutes': ...,
    // }
    let sessions = [];

    // fetch all sessions in a given day for a given teacher name
    const teacherSessions = rawData.filter(row => row[0] === teacherName);
    teacherSessions.forEach(s => {
        const sWithoutNulls = s.filter(e => e);
        // everything is hardcoded (allah yjib el khir)
        let session = {
            'type': sWithoutNulls[1], // sessionType name (did it this way to just use it in db)
            'promo': sWithoutNulls[2].split('-')[0],
            'speciality': sWithoutNulls[2].split('-')[1],
            'start_time': sWithoutNulls[3].split('h')[0],
            'duration_minutes': getDurationMinutes(sWithoutNulls[3]),
        }
        sessions.push(session);
    });

    return {
        [weekDay]: sessions,
    }
}

// getting a week's worth of timetable means getting the WHOLE timetable for a given teacher
function getSessionsForWeek(weekDays, teacherName) {
    let result = [];
    weekDays.forEach(weekDay => {
        result.push(getSessionForDay(weekDay, teacherName));
    });
    return {
        'last_name': teacherName,
        'sessions': result,
    };
}

function getSessionsForAllTeachers(weekDays, teachersName) {
    let fullTimeTable = [];
    teachersName.forEach(teacherName => {
       fullTimeTable.push(getSessionsForWeek(weekDays, teacherName));
    })
    return fullTimeTable;
}


/**
 * Example structure:
 * [
 *   {
 *     last_name: "Mr. Smith",            // Teacher's name
 *     sessions: [                        // Array of sessions for each weekday
 *       {
 *         Monday: [                      // Each key is a weekday with an array of session objects
 *           {
 *             type: "TD",               // Session type (e.g., TD, TP, C)
 *             promo: "1CS",             // Class/promotion
 *             speciality: "SIW",        // Speciality or field
 *             start_time: "08",         // Start time in hours (string, e.g., "08" for 08h00)
 *             duration_minutes: 120     // Duration of the session in minutes
 *           },
 *           ...
 *         ]
 *       },
 *       {
 *         Tuesday: [ ... ]
 *       },
 *       ...
 *     ]
 *   },
 *   ...
 * ]
 */
// const [weekdays, teachersName] = initialParsing('input.xlsx');
// console.dir(getSessionsForAllTeachers(weekdays, teachersName), { depth: 5 });
module.exports = { getSessionsForAllTeachers, initialParsing };

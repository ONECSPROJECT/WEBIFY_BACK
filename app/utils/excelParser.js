#!/usr/bin/env node

var XLSX = require('xlsx');

filename = './input.xlsx';

var workbook = XLSX.readFile(filename);

// playing around with the tool to figure it out...
const sheetNames = workbook.SheetNames;
// console.log(sheetNames); // [ 'Affectation' ]

const firstSheet = workbook.Sheets[sheetNames[0]];
// console.log(firstSheet); // The Sheets property of the workbook object5 is an object whose keys are sheet names and whose values are sheet objects

const rawData = XLSX.utils.sheet_to_json(firstSheet, { 'header': 1 });
// console.log(rawData); // will generate an array of arrays

// dumping teachers' names
const teachersName = [...new Set(rawData.slice(1).map(row => row[0]))];
const weekDays = rawData[0].slice(1).filter(_ => _);

function getDurationMinutes(taw9eet) {
    const splitTaw9eet = taw9eet.split('-');
    const startTime = Number(splitTaw9eet[0].slice(0,-1));
    const endTime = Number(splitTaw9eet[1].slice(0,-1));

    return (endTime - startTime) * 60; // because times are in hours
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
console.dir(getSessionsForAllTeachers(weekDays, teachersName), { depth: 3 });
const assert = require('node:assert/strict');
const Schedule = require('../models/Schedule');
const { getSessionsForAllTeachers, initialParsing } = require('../utils/excelParser');

async function insertScheduleData(schedule) {
    try {
        for (let professor of schedule) {
            const { last_name, sessions } = professor;

            // Get the professor's ID using their last name, or create if not exists
            let professorData = await Schedule.getProfessorIdByLastName(last_name);
            if (!professorData || professorData.length === 0) {
                // console.log(`Professor with last name ${last_name} not found. Creating new professor...`);
                const professor_id = await Schedule.createProfessor(last_name);
                professorData = [{ user_id: professor_id }];
            }
            const professor_id = professorData[0].user_id;

            // Iterate over the days of the week
            for (let dayObject of sessions) {
                const [day, daySessions] = Object.entries(dayObject)[0];

                // Iterate over each session for the day
                for (let session of daySessions) {
                    const { type, promo, speciality, start_time, duration_minutes } = session;

                    // Get the promo ID, or create if not exists
                    let promoData = await Schedule.getPromoIdByName(promo);
                    if (!promoData || promoData.length === 0) {
                        console.log(`Promo ${promo} not found. Creating new promo...`);
                        const promo_id = await Schedule.createPromo(promo);
                        promoData = [{ promo_id }];
                    }
                    const promo_id = promoData[0].promo_id;

                    // Get the speciality ID, or create if not exists
                    let speciality_id = null;
                    if (speciality) {
                        let specialityData = await Schedule.getSpecialityIdByName(speciality);
                        if (!specialityData || specialityData.length === 0) {
                            console.log(`Speciality ${speciality} not found. Creating new speciality...`);
                            speciality_id = await Schedule.createSpeciality(speciality);
                        } else {
                            speciality_id = specialityData[0].speciality_id;
                        }
                    }

                    // Get the session type ID, or create if not exists
                    let sessionTypeData = await Schedule.getSessionTypeIdByName(type);
                    if (!sessionTypeData || sessionTypeData.length === 0) {
                        console.log(`Session type ${type} not found. Creating new session type...`);
                        const session_type = await Schedule.createSessionType(type);
                        sessionTypeData = [{ session_type_id: session_type }];
                    }
                    const session_type = sessionTypeData[0].session_type_id;

                    // Prepare the session info to be inserted
                    const info = {
                        start_time,
                        duration_minutes,
                        day_of_week: day,
                        is_extra: false // You can adjust this based on the session's nature if required
                    };

                    // Insert the session data into the database
                    await Schedule.createSession({ professor_id, promo_id, speciality_id, session_type, info });
                }
            }
        }
        console.log('Schedule data inserted successfully.');
    } catch (error) {
        console.error('Error inserting schedule data:', error);
    }
}

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
    const scheduleData = getSessionsForAllTeachers(weekDays, teachersName);

    insertScheduleData(scheduleData);
}

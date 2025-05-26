CREATE TABLE promotion (
    promoid INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255) NOT NULL
);

CREATE TABLE ranks (
    rankid INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    course_payment INT,
    tut_payment INT,
    lab_payment INT,
    payment INT
);

CREATE TABLE semesters (
    semesterid INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    startdate DATE,
    enddate DATE
);

CREATE TABLE periods (
    periodid INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    startdate DATE,
    enddate DATE,
    semesterid INT,
    FOREIGN KEY (semesterid) REFERENCES semesters(semesterid)
);

CREATE TABLE speciality (
    specialityid INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    promoid INT,
    FOREIGN KEY (promoid) REFERENCES promotion(promoid)
);

CREATE TABLE teacherrankhistory (
    historyid INT PRIMARY KEY AUTO_INCREMENT,
    teacherID INT,
    rankid INT,
    startdate DATE,
    enddate DATE,
    periodid INT,
    FOREIGN KEY (teacherID) REFERENCES user(user_id),
    FOREIGN KEY (rankid) REFERENCES ranks(rankid),
    FOREIGN KEY (periodid) REFERENCES periods(periodid)
);

CREATE TABLE vacation (
    vacationid INT PRIMARY KEY AUTO_INCREMENT,
    teacherID INT,
    startdate DATE,
    enddate DATE,
    semesterid INT,
    FOREIGN KEY (teacherID) REFERENCES user(user_id),
    FOREIGN KEY (semesterid) REFERENCES semesters(semesterid)
);

CREATE TABLE globaltimetableplanb (
    globaltimetableID INT PRIMARY KEY AUTO_INCREMENT,
    promoID INT NOT NULL,
    specialityid INT,
    teacherID INT NOT NULL,
    dayID INT NOT NULL,
    startTime TIME NOT NULL,
    duration INT NOT NULL,
    sessiontypeid INT,
    isextra BOOLEAN,
    presence BOOLEAN,
    period INT,
    FOREIGN KEY (promoID) REFERENCES promotion(promoID),
    FOREIGN KEY (teacherID) REFERENCES user(user_id),
    FOREIGN KEY (dayID) REFERENCES DayOfWeek(dayID),
    FOREIGN KEY (specialityid) REFERENCES speciality(specialityid),
    FOREIGN KEY (sessiontypeid) REFERENCES sessionType(session_type_id)
);

CREATE TABLE payment (
    paymentid INT PRIMARY KEY AUTO_INCREMENT,
    teacherID INT,
    suphourcourse INT,
    suphourtut INT,
    suphourlab INT,
    totalpayment INT,
    status BOOLEAN,
    periodid INT,
    rankid INT,
    suphour INT,
    FOREIGN KEY (teacherID) REFERENCES user(user_id),
    FOREIGN KEY (periodid) REFERENCES periods(periodid),
    FOREIGN KEY (rankid) REFERENCES ranks(rankid)
);

-- Insert values
INSERT INTO ranks(name, course_payment, tut_payment, lab_payment, payment) VALUES ("MCA",500,400,300,500);
INSERT INTO ranks(name, course_payment, tut_payment, lab_payment, payment) VALUES ("MCB",700,500,400,700);
INSERT INTO ranks(name, course_payment, tut_payment, lab_payment, payment) VALUES ("PRF",900,800,600,900);

INSERT INTO promotion(name) VALUES ('1CPI');
INSERT INTO promotion(name) VALUES ('2CPI');
INSERT INTO promotion(name) VALUES ('1CS');
INSERT INTO promotion(name) VALUES ('2CS');
INSERT INTO promotion(name) VALUES ('3CS');

INSERT INTO sessionType(name, conversion_factor, hierarchy_level) VALUES ('Course',1.5,1);
INSERT INTO sessionType(name, conversion_factor, hierarchy_level) VALUES ('TD',1,2);
INSERT INTO sessionType(name, conversion_factor, hierarchy_level) VALUES ('TP',0.75,3);

INSERT INTO speciality(name, promoID) VALUES ('ISI',4);
INSERT INTO speciality(name, promoID) VALUES ('SIW',4);
INSERT INTO speciality(name, promoID) VALUES ('IASD',4);
INSERT INTO speciality(name, promoID) VALUES ('ISI',5);
INSERT INTO speciality(name, promoID) VALUES ('SIW',5);
INSERT INTO speciality(name, promoID) VALUES ('IASD',5);

UPDATE payment SET suphour=0 WHERE paymentid >= 1;


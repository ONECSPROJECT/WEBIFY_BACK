CREATE DATABASE IF NOT EXISTS suphours;
USE suphours;

-- USER TABLE
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    full_name CHAR(255),
    masked BOOLEAN,
    state CHAR(50),
    payment_information CHAR(255),
    faculty CHAR(255)
);

-- ACCOUNT TABLE
CREATE TABLE Account (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    email CHAR(255) UNIQUE NOT NULL,
    salt CHAR(255) NOT NULL,
    password_hash CHAR(255) NOT NULL,
    role CHAR(50) NOT NULL,
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- PASSWORD RESET
CREATE TABLE PasswordReset (
    reset_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    token CHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES Account(account_id) ON DELETE CASCADE
);

-- PROMOTIONS / PROGRAMS
CREATE TABLE Promotion (
    promo_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255) NOT NULL
);

-- SPECIALITIES
CREATE TABLE Speciality (
    speciality_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255) NOT NULL,
    promo_id INT,
    FOREIGN KEY (promo_id) REFERENCES Promotion(promo_id)
);

-- RANKS
CREATE TABLE Ranks (
    rank_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    payment INT,
    pay_rate_course INT,
    pay_rate_tut INT,
    pay_rate_lab INT
);

-- RANK HISTORY
CREATE TABLE TeacherRankHistory (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT,
    rank_id INT,
    start_date DATE,
    end_date DATE,
    period_id INT,
    FOREIGN KEY (teacher_id) REFERENCES User(user_id),
    FOREIGN KEY (rank_id) REFERENCES Ranks(rank_id),
    FOREIGN KEY (period_id) REFERENCES Periods(period_id)
);

-- DAY OF WEEK
CREATE TABLE DayOfWeek (
    day_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255)
);

-- HOLIDAYS
CREATE TABLE Holidays (
    holiday_id INT PRIMARY KEY AUTO_INCREMENT,
    start_date DATE,
    end_date DATE
);

-- SESSION TYPES
CREATE TABLE SessionType (
    session_type_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    conversion_factor DECIMAL(10,2),
    hierarchy_level INT
);

-- SEMESTERS
CREATE TABLE Semesters (
    semester_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    start_date DATE,
    end_date DATE
);

-- PERIODS
CREATE TABLE Periods (
    period_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    start_date DATE,
    end_date DATE,
    semester_id INT,
    FOREIGN KEY (semester_id) REFERENCES Semesters(semester_id)
);

-- ABSENCE RECORDS
CREATE TABLE AbsenceRecord (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT,
    week_number INT,
    month_number INT,
    day_number INT,
    rank_id INT,
    FOREIGN KEY (teacher_id) REFERENCES User(user_id),
    FOREIGN KEY (rank_id) REFERENCES Ranks(rank_id)
);

-- VACATION
CREATE TABLE Vacation (
    vacation_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT,
    start_date DATE,
    end_date DATE,
    semester_id INT,
    FOREIGN KEY (teacher_id) REFERENCES User(user_id),
    FOREIGN KEY (semester_id) REFERENCES Semesters(semester_id)
);

-- PAYMENT
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT,
    suphour INT DEFAULT 0,
    suphour_course INT,
    suphour_tut INT,
    suphour_lab INT,
    total_payment INT,
    status BOOLEAN,
    period_id INT,
    rank_id INT,
    FOREIGN KEY (teacher_id) REFERENCES User(user_id),
    FOREIGN KEY (period_id) REFERENCES Periods(period_id),
    FOREIGN KEY (rank_id) REFERENCES Ranks(rank_id)
);

-- GLOBAL TIME TABLE
CREATE TABLE Schedule (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT,
    promo_id INT,
    speciality_id INT,
    day_id INT,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    session_type_id INT,
    is_extra BOOLEAN,
    presence BOOLEAN,
    period_id INT,
    FOREIGN KEY (teacher_id) REFERENCES User(user_id),
    FOREIGN KEY (promo_id) REFERENCES Promotion(promo_id),
    FOREIGN KEY (speciality_id) REFERENCES Speciality(speciality_id),
    FOREIGN KEY (day_id) REFERENCES DayOfWeek(day_id),
    FOREIGN KEY (session_type_id) REFERENCES SessionType(session_type_id),
    FOREIGN KEY (period_id) REFERENCES Periods(period_id)
);

-- RANKS
INSERT INTO Ranks(name, pay_rate_course, pay_rate_tut, pay_rate_lab, payment)
VALUES
("MCA", 500, 400, 300, 500),
("MCB", 700, 500, 400, 700),
("PRF", 900, 800, 600, 900);

-- PROMOTIONS
INSERT INTO Promotion(name) VALUES
('1CPI'), ('2CPI'), ('1CS'), ('2CS'), ('3CS');

-- SPECIALITIES
INSERT INTO Speciality(name, promo_id) VALUES
('ISI', 4), ('SIW', 4), ('IASD', 4),
('ISI', 5), ('SIW', 5), ('IASD', 5);

-- SESSION TYPES
INSERT INTO SessionType(name, conversion_factor, hierarchy_level) VALUES
('Course', 1.5, 1),
('TD', 1.0, 2),
('TP', 0.75, 3);

-- DAY OF WEEK (sample)
INSERT INTO DayOfWeek(name) VALUES ('Friday');


CREATE DATABASE IF NOT EXISTS suphours;
USE suphours;

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    state CHAR(50),
    payment_information CHAR(255),
    faculty CHAR(255),
    full_name CHAR(255),
    masked BOOLEAN
);

CREATE TABLE Account (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    email CHAR(255) UNIQUE NOT NULL,
    salt CHAR(255) NOT NULL,
    password_hash CHAR(255) NOT NULL,
    role CHAR(50) NOT NULL,
    user_id INT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE DayOfWeek (
    dayid INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255)
);

CREATE TABLE Holidays (
    holidayid INT PRIMARY KEY AUTO_INCREMENT,
    startdate DATE,
    enddate DATE
);

CREATE TABLE Promo (
    promo_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255) NOT NULL
);

CREATE TABLE Speciality (
    speciality_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255) NOT NULL
);

CREATE TABLE SessionType (
    session_type_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255),
    conversion_factor DECIMAL(10,2),
    hierarchy_level INT
);

CREATE TABLE Schedule (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT,
    promo_id INT,
    speciality_id INT,
    day_of_week CHAR(50) NOT NULL,
    start_time CHAR(10) NOT NULL,
    duration_minutes INT NOT NULL,
    session_type INT,
    is_extra BOOLEAN NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (promo_id) REFERENCES Promo(promo_id) ON DELETE CASCADE,
    FOREIGN KEY (speciality_id) REFERENCES Speciality(speciality_id) ON DELETE CASCADE,
    FOREIGN KEY (session_type) REFERENCES SessionType(session_type_id) ON DELETE SET NULL
);

CREATE TABLE ProfRank (
    rank_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT,
    name CHAR(255) NOT NULL,
    pay_rate_course INT NOT NULL,
    pay_rate_lab INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES User(user_id) ON DELETE CASCADE
);

SOURCE neww.sql;

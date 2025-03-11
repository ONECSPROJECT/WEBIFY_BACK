CREATE DATABASE IF NOT EXISTS suphours;
USE suphours;

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    state CHAR(50),
    payment_information CHAR(255),
    faculty CHAR(255)
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

CREATE TABLE SessionType (
    session_type_id INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255) NOT NULL,
    conversion_factor INT NOT NULL,
    hierarchy_level INT NOT NULL
);

CREATE TABLE Schedule (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT,
    day_of_week INT NOT NULL,
    start_time INT NOT NULL,
    duration_minutes INT NOT NULL,
    session_type INT,
    is_extra BOOLEAN NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES User(user_id) ON DELETE CASCADE,
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

CREATE TABLE Period (
    period_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT,
    start_date INT NOT NULL,
    end_date INT NOT NULL,
    rank_id INT,
    FOREIGN KEY (professor_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (rank_id) REFERENCES ProfRank(rank_id)
);

CREATE TABLE Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT,
    from_date INT NOT NULL,
    to_date INT NOT NULL,
    total_hours INT NOT NULL,
    calculated_extra_hours INT NOT NULL,
    amount INT NOT NULL,
    processed_date INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE AbsenceRecord (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT,
    period_id INT,
    date INT NOT NULL,
    missed_hours INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (period_id) REFERENCES Period(period_id) ON DELETE CASCADE
);


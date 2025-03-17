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


SET @user_id = LAST_INSERT_ID();



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


-- below is added for password reset functionality. Should figure out a way to easily migrate
CREATE TABLE PasswordReset (
    reset_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    token CHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES Account(user_id) ON DELETE CASCADE
);













Create table Promotion (promoID int primary key auto_increment, name char(255) not null);
create table section (sectionID  int primary key auto_increment, promoID int not null, name char(255) not null, foreign key (promoID) references Promotion(promoID));
CREATE TABLE `Group` (
    groupID INT PRIMARY KEY AUTO_INCREMENT,
    sectionID INT NOT NULL,
    name CHAR(255) NOT NULL,
    FOREIGN KEY (sectionID) REFERENCES Section(sectionID)
);

CREATE TABLE DayOfWeek (
    dayID INT PRIMARY KEY AUTO_INCREMENT,
    name ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday') NOT NULL
);
CREATE TABLE Salle (
    salleID INT PRIMARY KEY AUTO_INCREMENT,
    name CHAR(255) NOT NULL
);
CREATE TABLE GlobalTimeTable (
    timetableID INT PRIMARY KEY AUTO_INCREMENT,
    promoID INT NOT NULL,
    sectionID INT NULL,
    groupID INT NULL,  
    teacherID INT NOT NULL,
    dayID INT NOT NULL,
    startTime TIME NOT NULL,
    duration INT NOT NULL, -- Duration in minutes
    sessionType ENUM('Course', 'Lab Work', 'Tutorial') NOT NULL,
    salleID INT NOT NULL,
    FOREIGN KEY (promoID) REFERENCES Promotion(promoID),
    FOREIGN KEY (sectionID) REFERENCES Section(sectionID),
    FOREIGN KEY (groupID) REFERENCES `Group`(groupID),
    FOREIGN KEY (teacherID) REFERENCES user(user_id),
    FOREIGN KEY (dayID) REFERENCES DayOfWeek(dayID),
    FOREIGN KEY (salleID) REFERENCES Salle(salleID)
);


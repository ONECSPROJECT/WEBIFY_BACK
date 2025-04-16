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


create table DayOfWeek (
    dayid int primary key auto_increment,
    name char(255)
);

create table holidays (
    holidayid int primary key auto_increment,
    startdate date,enddate date
);

create table promotion (
    promoid int primary key auto_increment,
    name char(255) not null
);

create table ranks (
    rankid int primary key auto_increment,
    name char(255),course_payment int,
    tut_payment int,
    lab_payment int
);

create table semesters (
    semesterid int primary key auto_increment,
    name char(255),
    startdate date,
    enddate date
);

create table periods (
    periodid int primary key auto_increment,
    name char(255),startdate date,
    enddate date,
    semesterid int,
    foreign key (semesterid) references semesters(semesterid)
);

create table sessionType (
    session_type_id int primary key auto_increment,
    name char(255),
    conversion_factor decimal(10,2),hierarchy_level int
);

create table speciality(
    specialityid int primary key auto_increment,
    name char(255),
    promoid int,
    FOREIGN key (promoid) references promotion(promoid)
);

create table teacherrankhistory(
    historyid int primary KEY auto_increment,
    teacherID int,
    rankid int,startdate date,
    enddate date,
    periodid int,
    foreign key (teacherID) references user(user_id),
    foreign key (rankid) references ranks(rankid),
    foreign key(periodid) references periods(periodid)
);

create table vacation(
    vacationid int primary key auto_increment,
    teacherID int,
    startdate date,
    enddate date,semesterid int,
    foreign key (teacherID) references user(user_id),
    foreign key (semesterid) references semesters(semesterid)
);

SET @user_id = LAST_INSERT_ID();

CREATE TABLE GlobalTimeTableplanb (
    globaltimetableID INT PRIMARY KEY AUTO_INCREMENT,
    promoID INT NOT NULL,
    specialityid int,
    teacherID INT NOT NULL,
    dayID INT NOT NULL,
    startTime TIME NOT NULL,
    duration INT NOT NULL,
    sessiontypeid int,
    isextra boolean,
    presence boolean,
    period int,
    FOREIGN KEY (promoID) REFERENCES Promotion(promoID),
    FOREIGN KEY (teacherID) REFERENCES user(user_id),
    FOREIGN KEY (dayID) REFERENCES DayOfWeek(dayID),
    foreign key (specialityid) references speciality(specialityid),
    foreign key (sessiontypeid) references sessionType(session_type_id)
);

create table payment (
    paymentid int primary key auto_increment,
	teacherID int,
	suphourcourse int,
	suphourtut int,
	suphourlab int,
	totalpayment int,
	status boolean,
	periodid int,
	rankid int,
	foreign key(teacherID) references user(user_id),
	foreign key(periodid) references periods(periodid),foreign key (rankid) references ranks (rankid)
);


insert into ranks(name, course_payment, tut_payment, lab_payment) values ("MCA",500,400,300);
insert into ranks(name, course_payment, tut_payment, lab_payment) values ("MCB",700,500,400);
insert into ranks(name, course_payment, tut_payment, lab_payment) values ("PRF",900,800,600);

insert into promotion(name) values ('1CPI');
insert into promotion(name) values ('2CPI');
insert into promotion(name) values ('1CS');
insert into promotion(name) values ('2CS');
insert into promotion(name) values ('3CS');

insert into sessionType(name,conversion_factor,hierarchy_level) values ('Course',1.5,1);
insert into sessionType(name,conversion_factor,hierarchy_level) values ('TD',1,2);
insert into sessionType(name,conversion_factor,hierarchy_level) values ('TP',0.75,3);

insert into speciality(name, promoID) values ('ISI',4);
insert into speciality(name, promoID) values ('SIW',4);
insert into speciality(name, promoID) values ('IASD',4);
insert into speciality(name, promoID) values ('ISI',5);
insert into speciality(name, promoID) values ('SIW',5);
insert into speciality(name, promoID) values ('IASD',5);

alter table user add column full_name char(255);
alter table user add column masked boolean;
alter table ranks add column payment int;
alter table payment add column suphour int;

update table ranks set payment=500 where rankid=1;
update  ranks set payment=700 where rankid=2;
update  ranks set payment=900 where rankid=3;
update payment set suphour=0 where paymentid>=1;

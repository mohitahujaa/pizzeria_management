create database temp;
use temp;
create table student(
Rollno char(9) not NULL primary key,
Name varchar(15) NOT NULL,
email varchar(50),
mobile char(10),
branch varchar(20),
aggregate_percentage int(1),
year char(4)
);

create table top_scorer(
Rollno char(9) not null primary key,
name varchar(15),
aggregate_percentage decimal(4,2)
);

alter table student
modify aggregate_percentage decimal(4,2);
alter table top_scorer
modify aggregate_percentage decimal (4,2);

set sql_safe_update = 0;

insert into student values(063177027, 'Mohit', 'mohitahuja720@gmail.com', '7290936560', 'CSE', 09.01, 2025);

DELIMITER //
create trigger agg_marks1
AFTER insert on Student
for each row
BEGIN
	if new.rollno is NOT NULL THEN
		if new.aggregate_percentage IS NOT NULL THEN
			if new.aggregate_percentage > 9.0 THEN
				insert into top_scorer VALUES(new.rollno, new.name, new.aggregate_percentage);
			end if;
		end if;
	end if;
END //	
DELIMITER ;

SELECT * FROM TOP_SCORER;
INSERT INTO STUDENT VALUES(088177027, 'hardik', 'hardik@gmail.com', '123456789', 'CSE', 09.02, 2025);
insert into student values(080177027, 'vansh', 'vansh@gmail.com', '234567891', 'CSE', 09.04, 2025);

DELIMITER //
create trigger aggregate_marks2
AFTER UPDATE on student
for each row
BEGIN
	IF old.rollno is not NULL THEN
		if new.aggregate_percentage > 09.00 then
			if old.rollno not in (select rollno from top_scorer) THEN
				insert into top_scorer values(old.rollno, old.name, new.aggregate_percentage);
			else
				update top_scorer set aggregate_percentage = new.aggregate_percentage where rollno = old.rollno;
			end if;
		else 
			if old.rollno in (select rollno from top_scorer) then
				delete from top_scorer where rollno = old.rollno;
			end if;
		end if;
	end if;
END //
DELIMITER ;

SET SQL_SAFE_UPDATES = 0;
UPDATE student
SET aggregate_percentage = 9.50
WHERE rollno = 63177027;

SELECT * FROM TOP_SCORER;
SELECT * FROM STUDENT;

DESC STUDENT;
SHOW COLUMNS FROM STUDENT;

show triggers like 'student';

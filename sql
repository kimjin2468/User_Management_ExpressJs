create table user (
id int auto_increment primary key,
first_name varchar(45) NOT NULL,
last_name varchar(45) NOT NULL,
email varchar(45) NOT NULL,
phone varchar(45) NOT NULL,
comments text,
status varchar(20) NOT NULL default 'active' 
);



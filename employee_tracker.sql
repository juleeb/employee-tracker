-- create database --

CREATE DATABASE employees_db;

USE employees_db;

-- create tables --

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INTEGER AUTO_INCREMENT,
	title VARCHAR(30), 
	salary DECIMAL NOT NULL,
	department_id INTEGER NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY (id),
FOREIGN KEY (id) REFERENCES role(id) ON DELETE CASCADE,
FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);

DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

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
	FOREIGN KEY (department_id) 
    REFERENCES department(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  INDEX role_index (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT,
  INDEX manager_index (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

--view all role--
SELECT role.id, role.title, role.salary, department.name
FROM role
LEFT JOIN department
ON role.department_id = department.id
ORDER BY role.id;

--view all employee--
SELECT  e.id,
            first_name,
            last_name,
            r.title,
            r.salary,
            (SELECT CONCAT(e2.first_name,' ',e2.last_name) FROM employee AS e2 WHERE e.manager_id = e2.id) AS 'manager',
            d.NAME
            FROM employee AS e
            LEFT JOIN ROLE AS r ON e.role_id = r.id
            LEFT JOIN department AS d ON r.department_id = d.id;

--view employee by role--
SELECT  e.id,
            first_name,
            last_name,
            r.title,
            r.salary
            FROM employee AS e
            LEFT JOIN ROLE AS r ON e.role_id = r.id
            WHERE r.title = "이름";
            
--veiw employee by department--
SELECT  e.id,
            first_name,
            last_name,
            r.title,
            d.name
            FROM employee AS e
            LEFT JOIN role AS r ON e.role_id = r.id
            LEFT JOIN department AS d on r.department_id = d.id
            WHERE d.name = "이름";
            
--add department--
INSERT INTO department (name) VALUES ("Customer Service");

--add role--
INSERT INTO role 
SET
title = "Concierge",
salary = 50000,
department_id = 5;

--add employee--
INSERT INTO employee 
SET
first_name =  "Jane",
last_name = "Spoon",
role_id = 5,
manager_id = 3;

--update employee role--
UPDATE employee 
SET role_id = 5
WHERE last_name = "Spoon";

SET SQL_SAFE_UPDATES = 0
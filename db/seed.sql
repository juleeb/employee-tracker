USE employees_db;

INSERT INTO department (name) 
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id) 
VALUES ("Sales Lead", 100000, 1), 
		("Lead Engineer", 150000, 2), 
		("Accountant", 125000, 3), 
        ("Legal Team Lead", 250000, 4), 
        ("Sales Person", 80000, 1), 
        ("Software Engineer", 120000, 2),
        ("Lawyer", 190000, 4)
;

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Doe", 1);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mike", "Chan", 5); 
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ashley", "Rodriguez", 2);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Kevin", "Tupik", 6);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Malia", "Brown", 3);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Sarah", "Lourd", 4);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Tom", "Allen", 7);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Christian", "Eckenrode", 2);

UPDATE employee SET manager_id = 3
WHERE id = 1;
UPDATE employee SET manager_id = 1
WHERE id = 2;
UPDATE employee SET manager_id = 3
WHERE id = 4;
UPDATE employee SET manager_id = 6
WHERE id = 7;
UPDATE employee SET manager_id = 3
WHERE id = 8;




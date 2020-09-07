const connection = require('./connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    viewAllEmployees() {
        return this.connection.query(
            `
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
            `
        );
    }

    viewEmployeesByRole() {
        return this.connection.query(
            `
            SELECT  e.id,
            first_name,
            last_name,
            r.title,
            r.salary
            FROM employee AS e
            LEFT JOIN ROLE AS r ON e.role_id = r.id
            WHERE r.title = "${role}";
            `
        );
    }

    viewEmployeesByDepartment(){
        return this.connection.query(
            `
            SELECT  e.id,
            first_name,
            last_name,
            r.title,
            d.name
            FROM employee AS e
            LEFT JOIN role AS r ON e.role_id = r.id
            LEFT JOIN department AS d on r.department_id = d.id
            WHERE d.name = "${ deparment }";
            `
        );
    }

    addDepartment() {
        return this.connection.query(
            `
            INSERT INTO department (name) VALUES ("이름");
            `
        )
    }

    viewAllRoles(){
        return this.connection.query(`SELECT * FROM role`)
    }

    addOne(table, obj) {
        return this.connection.query(`INSERT INTO ${table} SET ?`
        , obj);
    }

    // addEmployee() {
    //     return this.connection.query(
    //         `
    //         INSERT INTO employee 
    //         SET
    //         first_name =  "이름",
    //         last_name = "이름",
    //         role_id = 롤아이디매치,
    //         manager_id = 매니저아이디매치; 
    //         `
    //     );
    // }

    // updateEmployeeRole(a, b) {
    //     const update = {};
    //     return this.connection.query
    //     (`
    //     UPDATE employee SET role_id = ? WHERE id = ?;`, 
    //     [update., update.b]
    //     );
    // }

    firstLastName() {
        return this.connection.query(
            `
            SELECT CONCAT (first_name," ",last_name) AS full_name, (id) FROM employee;
            `
        )
    }
}//지우지말것

module.exports = new DB(connection);
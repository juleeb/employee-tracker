const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const connection = require("./db/connection");
const db = require("./db");


//require("console.table");

const prompts = {

  mainPrompt: [
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
       {
         name: "View All Employees",
         value: "view_employees"
       },
       {
        name: "View All Employees By Roles",
        value: "view_employees_role"
       },
       {
        name: "View All Employees By Department",
        value: "view_employees_department"
       },
      {
        name: "Add Employee",
        value: "add_employee"
      },
      {
        name: "Add Department",
        value: "add_department"
      },
      {
        name: "Add Role",
        value: "add_role"
      }, 
      {
        name: "Update Employee Role",
        value: "update_role"
      }, 
      {
        name: "View All Departments",
        value: "view_departments"
      },
      {
        name: "Exit",
        value: "exit"
      }
    ]
  }
],

departmentSearch: 
  [
    {
      type: "list",
      name: "department",
      message: "What department would you like to search?",
      choices: [
       {
         name: "Sales Department",
         value: "Sales"
       },
       {
        name: "Engineering Department",
        value: "Engineering"
       },
       {
        name: "Finance Department",
        value: "Finance"
       },
       {
         name: "Legal Department",
         value: "Legal"
       }
    ]

}],

roleAdd: [
{
  type: "input",
  name: "title",
  message: "Enter new role title."
},
{
  type: "input",
  name: "salary",
  message: "Enter new salary for the title."
}
],

departmentAdd: [
{
  type: "input",
  name: "newdepartment",
  message: "Enter new department name."
}
],

addEmployee: [
{
  type: "input",
  name: "first_name",
  message: "Enter new employee's first name."
},
{
  type: "input",
  name: "last_name",
  message: "Enter new employee's last name."
},
{
  type: "input",
  name: "manager_id",
  message: "Enter your manager's id."
}
]
}

async function runApp() {

    const titles = "DATABASE";

    console.log("\n");
    console.log(titles);
    console.log("\n");

    const { choice } = await inquirer.prompt(prompts.mainPrompt);

    switch(choice) {

    case "view_employees":
            const emp = await db.viewAllEmployees();
            console.table(emp);
            setTimeout(runApp, 2000)
            break;
              
    case "view_employees_role":
            viewEmployeesRoles();
            break;
      
    case "view_employees_department":
            viewEmployeesByDepartment();
            break;
      
    case "add_employee":
        const empRole = await viewAllRoles();
        console.log(empRole);
        addEmployee(empRole);
        break;
      
    case "add_department":
         addDepartment();
         break;
      
    case "add_role":
        const roleDep = await viewDepartments();
        addRole(roleDep);
        break;
    
    case "update_role":
        const empList = await db.firstLastName();
        console.log(empList);
        const roleList = await viewAllRoles();
        updateEmployeeRole(empList, roleList);
        break;
    
    case "view_departments":
        const departments = await viewDepartments();
        console.table(departments)
        break;
    
        case "exit":
        connection.end();
        break;
    }
}

async function viewEmployeesRoles() {
    const roles = await db.viewAllRoles();
    inquirer
    .prompt({
        type: "list",
        name: "role",
        message: "What role would you like to search?",
        choices: roles.map(a=> a.title)
      })
    .then(function (answer) {
      let query = 
      `
      SELECT  e.id,
      first_name,
      last_name,
      r.title,
      r.salary
      FROM employee AS e
      LEFT JOIN ROLE AS r ON e.role_id = r.id
      WHERE ?;
      `;
      connection.query(query, { title: answer.role }, function (err, res) {
      
          console.table(res);
         
        runApp();
      });
    });    
}

async function viewEmployeesByDepartment() {
    inquirer
    .prompt(prompts.departmentSearch)
    .then(function (answer) {
      let query = `SELECT  
      e.id,
      first_name,
      last_name,
      r.title,
      d.name
      FROM employee AS e
      LEFT JOIN role AS r ON e.role_id = r.id
      LEFT JOIN department AS d on r.department_id = d.id
      WHERE ?`;
     connection.query(query, { name: answer.department }, function (err, res) {
     console.table(res);
         
     runApp();
      });
    });    
}

async function addRole(roleDep) {
    const dataRole = await inquirer.prompt(prompts.roleAdd.concat([{
        message:"What is the department of this role?",
        name: "department_id",
        type: "list",
        choices: roleDep.map(a=> ({name: a.name, value:a.id}))
    }]));
    console.log(dataRole);
    db.addOne("role", dataRole);
    
    runApp();
 }

function viewDepartments(){
    return connection.query(`SELECT * FROM department`);
 }

 function viewAllRoles(){
    return connection.query(`SELECT * FROM role`);
}

async function addDepartment() {
    inquirer
    .prompt(prompts.departmentAdd)
    .then(function (answer) {
        let query = `INSERT INTO department (name) VALUES (?)`;
        connection.query(query, answer.newdepartment, function (err, res) {
        console.table(res);
        
        runApp();
        });
    });
}

async function addEmployee(empRole) {
    const dataEmp = await inquirer.prompt(prompts.addEmployee.concat([
        {
          type: "list",
          name: "role_id",
          message: "Enter your role name.",
          choices: empRole.map(b=> ({name: b.title, value: b.id}))
        }]));
        console.log(dataEmp);
        db.addOne("employee", dataEmp);
        
        runApp();
}

async function updateEmployeeRole(empList, empRole) {

    const updateData = await inquirer.prompt([
        {
            type: "list",
            name: "id",
            message: "Choose last name of employee to update role.",
            choices: empList.map(d=> ({name: d.full_name , value: d.id}))
        },
        {
            type: "list",
            name: "role_id",
            message: "Choose role to update employee.",
            choices: empRole.map(e=> ({name: e.title, value: e.id}))
        }
    ]);
    
    console.log(updateData);
    console.log(updateData.id);
    console.log(updateData.role_id);
    const result = connection.query
        (`
        UPDATE employee SET role_id = ${updateData.role_id} WHERE id = ${updateData.id};`,function (err, res) {
            if (err) throw err;
        }
        );
        const newemp = await db.viewAllEmployees();
        console.table(newemp);
}

runApp();
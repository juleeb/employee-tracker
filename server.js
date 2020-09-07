//dependencies
const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const connection = require("./db/connection");
const db = require("./db");
const { async } = require("rxjs");

require("console.table");

//inquirer propmts and promises
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
        name: "Delete Employee",
        value: "delete_employee"
      },
      {
        name: "Delete Role",
        value: "delete_role"
      },
      {
        name: "Delete Department",
        value: "delete_department"
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
  name: "name",
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

console.log("\n");
console.log(
  logo({
    name: "Employee Tracker Database",
    logoColor: 'bold-green'
    })
    .render()
    );
console.log("\n");

async function runApp() {
  const { choice } = await inquirer.prompt(prompts.mainPrompt);

//switch statements for user choice
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
        const roleList = await viewAllRoles();
        updateEmployeeRole(empList, roleList);
        break;
    
    case "view_departments":
        const departments = await viewDepartments();
        break;
    
    case "delete_employee":
        const deleteempl = await db.firstLastName();
        deletelistemp(deleteempl);
        break;
    
    case "delete_role":
        const deleterole = await viewAllRoles();
        deletelistrole(deleterole);
        break;
    
    case "delete_department":
        const deletedepart = await viewDepartments();
        deletelistdepart(deletedepart);
        break;

    case "exit":
        connection.end();
        break;
    }
}

function viewDepartments(){
  return connection.query(`SELECT * FROM department`);
}

function viewAllRoles(){
  return connection.query(`SELECT * FROM role`);
}

//functions associated with switch statement
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
    db.addOne("role", dataRole);
    console.log("Updated New Role");
    const updrole = await viewAllRoles();
    console.table(updrole);

    runApp();
 }

async function addDepartment() {
    const dataDepartAdd = await inquirer.prompt(prompts.departmentAdd)
    console.log(dataDepartAdd);
        db.addOne("department", dataDepartAdd);
        console.log("Updated New Department");
        const updepart = await viewDepartments();
        console.table(updepart);
        
        runApp();
}

async function addEmployee(empRole) {
    const dataEmp = await inquirer.prompt(prompts.addEmployee.concat([
        {
          type: "list",
          name: "role_id",
          message: "Enter your role name.",
          choices: empRole.map(b=> ({name: b.title, value: b.id}))
        }]));
        db.addOne("employee", dataEmp);
        const upemp = await db.viewAllEmployees();
        console.log("Updated New Employee");
        console.table(upemp)
        
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
    const result = connection.query
        (`
        UPDATE employee SET role_id = ${updateData.role_id} WHERE id = ${updateData.id};`,
          function (err, res) {
            if (err) throw err;
        });
        const newemp = await db.viewAllEmployees();
        console.log("Updated Employee Role");
        console.table(newemp);
        
        runApp();
}

async function deletelistemp(deleteempl) {
  const deleteEmpData = await inquirer.prompt([
    {
      type: "list",
      name: "id",
      message: "Which employee would you like to delete?",
      choices: deleteempl.map(f=> ({name: f.full_name , value: f.id}))
    }
  ]);
  const resultDelete = connection.query
    (`DELETE FROM employee WHERE id = ${deleteEmpData.id};`,
      function (err, res) {
        if (err) throw err;
      });
      const deleteempL = await db.viewAllEmployees();
      console.table(deleteempL);

      runApp();
}

async function deletelistrole(deleterole) {
  const deleteRoleData = await inquirer.prompt([
    {
      type: "list",
      name: "id",
      message: "Which role would to like to delete?",
      choices: deleterole.map(g=> ({name: g.title , value: g.id}))
    }
  ]);
  const resultDeleteRole = connection.query
    (`DELETE FROM role WHERE id = ${deleteRoleData.id};`,
    function (err, res) {
      if (err) throw err;
    });
    const deleteroleL = await viewAllRoles();
    console.table(deleteroleL);

    runApp();
}

async function deletelistdepart(deletedepart) {
  const deleteDepartData = await inquirer.prompt([
    {
      type: "list",
      name: "id",
      message: "Which department would to like to delete?",
      choices: deletedepart.map(h=> ({name: h.name , value: h.id}))
    }
  ]);
  const resultDeleteDepart = connection.query
    (`DELETE FROM department WHERE id = ${deleteDepartData.id};`,
    function (err, res) {
      if (err) throw err;
    });
    const deletedepartL = await viewDepartments();
    console.table(deletedepartL);

    runApp();
}

runApp();
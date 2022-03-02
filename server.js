// DEPENDENCIES
var mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require('fs');
require("dotenv").config();

// Import connection.js module for SQL server connection
const connection = require("./config/connection");
const { allowedNodeEnvironmentFlags } = require("process");
const { addAbortSignal } = require("stream");

// Connect to database
connection.connect(function (err) {
    if (err) throw err;
    init();
});

promptUser();

const promptUser = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choice:
                ['View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Employee Role',
                    'Update an Employee Manager',
                    'View Employees By Department',
                    'Delete a Department',
                    'Delete a Role',
                    'Delete an Employee',
                    'View Department Budget',
                    'Exit']

        }

    ]).then((answers) => {
        const{choice} = answers;

        if(choice === "View All epartments"){
            showDepartments();
        

        }
        if(choice === "View All Roles")
        {
            showRoles();
        }
        if(choice === "View All Employees")
        {
            showEmployees();
        }
        if(choice === "Add a Department")
        {
            addDepartment();
        }
        if(choice === "Add a Role")
        {
            addARole();
        }
        if(choice === "Add an employee")
        {
            addEmployee();
        }
        if(choice === "Update an Employee Role")
        {
            updateEmployeeRole();
        }
        if(choice === "Update an Employee Manager")
        {
            updateManager();
        }
        if(choice === "View Employee By Department")
        {
            viewEmpByDept();
        }
        if(choice === "Delete a Department")
        {
            deleteDept();
        }
        if(choice === "Delete a Role"){
            deleteRole();
        }
        if(choice === "elete an Employee")
        {
            deleteEmployee();
        }
        if(choice === "View department Budgets")
        {
            viewBudget();
        }
        if(choice === "Exit"){
            connection.end()
        };
    });
};

//show all Dept
showDepartments = () => {
    const sql = `SELECT department.id As id,department.name AS department FROM department`;
    connection.promise().query(sql,(err,rows) =>{
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};

//show all roles
showRoles = () => {
    const sql = `SELECET role.id,role.title,department.name AS department FROM role
    INNER JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql,(err,rows) =>{
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};
//show all employees

showEmployees = () =>{

    const sql = `SELECT employee.id, employee.first_name,employee.last_name,role.title,department.name AS department,role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.promise.query(sql, (err, rows) => {
        if (err) throw err; 
        console.table(rows);
        promptUser();
        });
        };

// function to add a department 
addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDept',
      message: "What department do you want to add?",
      validate: addDept => {
        if (addDept) {
            return true;
        } else {
            console.log('Please enter a department');
            return false;
        }
      }
    }
  ])
    .then(answer => {
      const sql = `INSERT INTO department (name) VALUES (?)`;

      connection.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log('Added ' + answer.addDept + " to departments!"); 

        showDepartments();
    });
  });
};

// add a role 
addARole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "What role do you want to add?",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('Please enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: addSalary => {
          if (isNAN(addSalary)) {
              return true;
          } else {
              console.log('Please enter a salary');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const params = [answer.role, answer.salary];
  
        // gets department from department table
        const Sql = `SELECT name, id FROM department`; 
  
        connection.promise().query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
  
              const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
  
              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.role + " to roles!"); 
  
                showRoles();
         });
       });
     });
   });
  };
  //add an employee 
  addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
        validate: addFirstName => {
          if (addFirstName) {
              return true;
          } else {
              console.log('Please enter a first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLastName => {
          if (addLastName) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.fistName, answer.lastName]
  
      // gets roles from role table
      const Sql = `SELECT role.id, role.title FROM role`;
    
      connection.promise().query(Sql, (err, data) => {
        if (err) throw err; 
        
        const role = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: role
              }
            ])
              .then(Choice => {
                const role = Choice.role;
                params.push(role);
  
                const Sql = `SELECT * FROM employee`;
  
                connection.promise().query(Sql, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id VALUES (?, ?, ?, ?)`;
  
                      connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added!")
  
                      showEmployees();
                });
              });
            });
          });
       });
    });
  };

  // update an employee Role

  updateEmployeeRole = () => {

    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    connection.promise().query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const Sql = `SELECT * FROM role`;
  
          connection.promise().query(Sql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                  console.log("Employee has been updated!");
                
                  showEmployees();
            });
          });
        });
      });
    });
  };

  // update an employee manager
  updateManager = () => {

  // get employees from employee table 
  const Sql = `SELECT * FROM employee`;

  connection.promise().query(Sql, (err, data) => {
    if (err) throw err; 

  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
      .then(empChoice => {
        const employee = empChoice.name;
        const params = []; 
        params.push(employee);

        const managerSql = `SELECT * FROM employee`;

          connection.promise().query(managerSql, (err, data) => {
            if (err) throw err; 

          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager); 
                    
                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee 

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                      if (err) throw err;
                    console.log("Employee has been updated!");
                  
                    showEmployees();
          });
        });
      });
    });
  });
};
//view employee by department
viewEmpByDept = () => {
  const sql = `SELECT employee.first_name,employee.last_name,department.name AS department FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    promptUser();
  });          
};

//delete department
deleteDept = () => {
  const Sql = `SELECT * FROM department`; 

  connection.promise().query(Sql, (err, data) => {
    if (err) throw err; 

    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

    inquirer.prompt([
      {
        type: 'list', 
        name: 'dept',
        message: "What department do you want to delete?",
        choices: dept
      }
    ])
      .then(deptChoice => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Successfully deleted!"); 

      showDepartments();
      });
    });
  });
};
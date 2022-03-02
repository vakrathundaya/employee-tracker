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
    connection.Promise().query(sql,(err,rows) =>{
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};

//show all roles
showRoles = () => {
    const sql = `SELECET role.id,role.title,department.name AS department FROM role
    INNER JOIN department ON role.department_id = department.id`;

    connection.Promise().query(sql,(err,rows) =>{
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

    connection.Promise.query(sql, (err, rows) => {
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

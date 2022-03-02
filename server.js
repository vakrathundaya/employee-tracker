// DEPENDENCIES
var mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require('fs');
require("dotenv").config();

// Import connection.js module for SQL server connection
const connection = require("./config/connection");

// Connect to database
connection.connect(function (err) {
    if (err) throw err;
    init();
});

const promtUser = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices:
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
        const{choices} = answers;
    })
}

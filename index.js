// Importing required modules
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const readline = require('readline');
const db = require('./develop/db/connections');

// Create an instance of Express
const app = express();

// Set the server port
const PORT = process.env.PORT || 3020;

// Create an interface for reading input from the command line
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Middleware to parse request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Handle 404 errors
app.use((req, res) => {
    res.status(404).end();
});

// Function to display the initial prompt and handle user choices
const navigateChoices = () => {
    inquirer.prompt({
        type: 'list',
        name: 'navigate',
        message: 'Select an option',
        choices: ['All Departments', 'All Roles', 'All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'],
    }).then(answer => {
        switch (answer.navigate) {
            case 'All Departments':
                viewAllDepartments();
                break;

            case 'All Roles':
                viewAllRoles();
                break;

            case 'All Employees':
                viewAllEmployees();
                break;

            case 'Add Department':
                addADepartment();
                break;

            case 'Add Role':
                addARole();
                break;

            case 'Add Employee':
                addAnEmployee();
                break;

            case 'Update Employee Role':
                updateAnEmployeeRole();
                break;
        }
    }).catch((error) => {
        console.error('Error occurred:', error);
        rl.close();
    });
};

// Function to view all departments
const viewAllDepartments = () => {
    db.query('SELECT * FROM department;', function (err, results) {
        console.table(results);
        navigateChoices();
    });
};

// Function to view all roles
const viewAllRoles = () => {
    db.query('SELECT * FROM role;', function (err, results) {
        console.table(results);
        navigateChoices();
    });
};

// Function to view all employees
const viewAllEmployees = () => {
    db.query('SELECT employee.id, first_name, last_name, role.title, department.name, role.salary, manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;', function (err, results) {
        console.table(results);
        navigateChoices();
    });
};

// Function to add a new department
const addADepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'newDepartment',
        message: 'What is the name of your new department?'
    }).then((answer) => {
        db.query("INSERT INTO department (name) VALUES (?)", [answer.newDepartment], (err, results) => {
            db.query("SELECT * FROM department", (err, results) => {
                console.table(results);
                navigateChoices();
            });
        });
    });
};

// Function to add a new role
const addARole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'jobTitle',
            message: 'What is your new job title?'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is the salary?'
        },
        {
            type: 'number',
            name: 'departmentID',
            message: 'Input an ID for this job:'
        }
    ]).then((answer) => {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.jobTitle, answer.salary, answer.departmentID], (err, results) => {
            db.query("SELECT * FROM role", (err, results) => {
                console.table(results);
                navigateChoices();
            });
        });
    });
};

// Function to add a new employee
const addAnEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Input first name:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Input last name:'
        },
        {
            type: 'number',
            name: 'roleID',
            message: 'Input role ID for new employee:'
        },
        {
            type: 'number',
            name: 'manager',
            message: 'Input manager ID:'
        },
    ]).then((answer) => {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.firstName, answer.lastName, answer.roleID, answer.manager], (err, results) => {
            db.query("SELECT employee.id, first_name, last_name, role.title, department.name, role.salary, manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;", (err, results) => {
                console.table(results);
                navigateChoices();
            });
        });
    });
};

// Function to update an employee's role
const updateAnEmployeeRole = () => {
    inquirer.prompt([
        {
            type: 'number',
            name: 'employeeID',
            message: 'What is the ID number of the employee you wish to update?'
        },
        {
            type: 'number',
            name: 'roleID',
            message: 'What is ID of the role you wish to update the employee to?'
        }
    ]).then((answer) => {
        db.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.roleID, answer.employeeID], (err, results) => {
            db.query("SELECT employee.id, first_name, last_name, role.title, department.name, role.salary, manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;", (err, results) => {
                console.table(results);
                navigateChoices();
            });
        });
    });
};

// Start the application by calling the initial prompt function
navigateChoices();

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

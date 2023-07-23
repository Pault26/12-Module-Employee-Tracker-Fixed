const express = require('express');
const inquirer = require("inquirer");
const db = require('./db/connection');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res) => {
    res.status(404).end();
});

//The function that will be in control of making the selections, will be called back to from every other function
const navigateChoices = () => {
    inquirer.prompt({
        type: 'list',
        name: 'navigate',
        message: 'What would you like to do?',
        choices: ['View All Departments',
            'View All Roles',
            'View All Employees',
            'Add A Department',
            'Add A Role',
            'Add An Employee',
            'Update An Employee Role'],
        // this will deploy a function based off of what choice you make, these are placeholder names as I havent written the functions yet
    }).then(answer => {
        switch (answer.navigate) {
            case 'View All Departments':
                viewAllDepartments();
                break;

            case 'View All Roles':
                viewAllRoles();
                break;

            case 'View All Employees':
                viewAllEmployees();
                break;

            case 'Add A Department':
                addADepartment();
                break;

            case 'Add A Role':
                addARole();
                break;

            case 'Add An Employee':
                addAnEmployee();
                break;

            case 'Update An Employee Role':
                updateAnEmployeeRole();
                break;
        }
    })
};

// Will show you a table of all the departments
const viewAllDepartments = () => {
    db.query('SELECT * FROM department;', function (err, results) {
        console.table(results);
        navigateChoices();
    });
}

// Will show you a table of all the roles
const viewAllRoles = () => {
    db.query('SELECT * FROM role;', function (err, results) {
        console.table(results);
        navigateChoices();
    });
}

// Will show you a table of all current employees
const viewAllEmployees = () => {
    db.query('SELECT employee.id, first_name, last_name, role.title, department.name, role.salary, manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;', function (err, results) {
        console.table(results);
        navigateChoices();
    });
}

// Will take you through a prompt to create a new department, it then will show you a table of all current departments
const addADepartment = () => {
    inquirer.prompt({
        type: "input",
        name: "newDepartment",
        message: "What would you like to name your new department?"

    }).then((answer) => {
        db.query("INSERT INTO department (name) VALUES (?)", [answer.newDepartment], (err, results) => {
            db.query("SELECT * FROM department", (err, results) => {
                console.table(results);
                navigateChoices();
            })
        })
    })
};

// Will take you through a prompt to create a new role, it then will show you a table of all current roles
const addARole = () => {
    inquirer.prompt([{
        type: "input",
        name: "jobTitle",
        message: "What would you like to name your new job title?"
    },
    {
        type: "number",
        name: "salary",
        message: "How much does this new position pay?"
    },
    {
        type: "number",
        name: "departmentID",
        message: "What is the Department ID associated with this new position?"
    }
    ]).then((answer) => {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.jobTitle, answer.salary, answer.departmentID], (err, results) => {
            db.query("SELECT * FROM role", (err, results) => {
                console.table(results);
                navigateChoices();
            })
        })
    })
};

// Will take you through a prompt to add a new employee to the database, it then will show you a table of all current employees
const addAnEmployee = () => {
    inquirer.prompt([{
        type: "input",
        name: "firstName",
        message: "What is the new employee's first name"
    },
    {
        type: "input",
        name: "lastName",
        message: "What is the new employee's last name?"
    },
    {
        type: "number",
        name: "roleID",
        message: "What is the Role ID associated with this new employee?"
    },
    {
        type: "number",
        name: "manager",
        message: "What is the Id of the manager the new employee reports to?"
    },
    ]).then((answer) => {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.firstName, answer.lastName, answer.roleID, answer.manager], (err, results) => {
            db.query("SELECT employee.id, first_name, last_name, role.title, department.name, role.salary, manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;", (err, results) => {
                console.table(results);
                navigateChoices();
            })
        })
    })
};

// Will take you through a prompt to update an existing employee, it then will show you a table of all current employees
const updateAnEmployeeRole = () => {
    inquirer.prompt([{
        type: "number",
        name: "employeeID",
        message: "What is the ID number of the employee you wish to update?"
    },
    {
        type: "number",
        name: "roleID",
        message: "What is ID of the role you wish to update the employee to?"
    }
    ]).then((answer) => {
        db.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.roleID, answer.employeeID], (err, results) => {
            db.query("SELECT employee.id, first_name, last_name, role.title, department.name, role.salary, manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;", (err, results) => {
                console.table(results);
                navigateChoices();
            })
        })
    })
};

// This calls the starting function as soon as you call node server.js
navigateChoices();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
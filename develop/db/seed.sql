-- Department table
INSERT INTO department (name)
VALUES ('Legal'), ('Sales'), ('Engineering');

-- Job title (roles) table
INSERT INTO role (title, salary, department_id)
VALUES
    ('Lead Attorney', 250000, 1),
    ('Corporate Lawyer', 170000, 1),
    ('Sales Manager', 100000, 2),
    ('Sales Representative', 70000, 2),
    ('Software Architect', 150000, 3),
    ('Software Engineer', 120000, 3);

-- Employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Alice', 'Johnson', 1, null),
    ('Bob', 'Smith', 2, 1),
    ('Charlie', 'Brown', 2, 1),
    ('David', 'Lee', 3, null),
    ('Eve', 'White', 4, 2),
    ('Frank', 'Miller', 4, 2),
    ('Grace', 'Taylor', 4, 2),
    ('Henry', 'Anderson', 5, null),
    ('Isabella', 'Martinez', 6, 3),
    ('Jack', 'Robinson', 6, 3);
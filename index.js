const express = require('express');

const app = express();

app.use(express.json());

const projects = [];

let count = 0;

app.use((req, res, next) => {
    count++;

    console.log(`A total of ${count} requests have been made.`);

    next();
});

// Middleware to check if projects exists, based on params id
function checkProject(req, res, next) {
    let check = req.params.id;

    // Check if project already exists
    projects.forEach(e => {
        if (e.id === check) {
            check = true;
        }
    });

    if (!(check === true)) {
        return res.status(400).json({ error: "Project does not exists." });
    }

    return next();
}

// Route to post a new project
app.post('/projects', (req, res) => {
    const { id, title } = req.body;

    let exist = false;

    // Check if project already exists
    projects.forEach(e => {
        if (e.id === id) {
            exist = true;
        }
    });

    // If it does not exist, post
    if (!exist) {
        const project = {
            id,
            title
        }

        projects.push(project);

        return res.json(project);
    }

    return res.send();
});

// Route to list all projects
app.get('/projects', (req, res) => {
    return res.json(projects);
});

// Route to update a project
app.put('/projects/:id', checkProject, (req, res) => {
    const change = req.params.id;

    let project = projects.find(e => e.id === change);

    let { id = project.id, title = project.title, tasks = project.tasks } = req.body;

    let projectIndex = projects.findIndex(e => e.id === change);

    project = {
        id,
        title,
        tasks
    }

    projects.splice(projectIndex, 1, project);

    return res.json(project);
});


// Route to delete a project
app.delete('/projects/:id', checkProject, (req, res) => {
    let projectIndex = projects.findIndex(e => e.id === req.params.id);

    projects.splice(projectIndex, 1);

    return res.send();
});

// Route to add a task
app.post('/projects/:id/tasks', checkProject, (req, res) => {
    const change = req.params.id;
    const { title } = req.body;

    let project = projects.find(e => e.id === change);
    let projectIndex = projects.findIndex(e => e.id === change);

    project = {
        id: project.id,
        title: project.title,
        tasks: [title]
    }

    projects.splice(projectIndex, 1, project);

    return res.json(project);
});

app.listen(3000);
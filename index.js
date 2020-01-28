const express = require('express');

const app = express();

app.use(express.json());

const projects = [];

app.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body;

    const project = {
        id,
        title,
        tasks
    }

    projects.push(project);

    return res.json(project);
});

app.get('/projects', (req, res) => {
    return res.json(projects);
});

app.put('/projects/:id', (req, res) => {
    const change = req.params.id;
    const { id, title, tasks } = req.body;

    let project = projects.find(e => e.id.toString() === change);
    let projectIndex = projects.findIndex(e => e.id.toString() === change);

    if(project) {
        project = {
            id,
            title,
            tasks
        }
    }

    projects.splice(projectIndex, 1, project);

    return res.json(project);
});

app.delete('/projects/:index', (req, res) => {
    const { index } = req.params;

    projects.splice(projects[index], 1);

    return res.json(projects);
});

app.listen(3000);
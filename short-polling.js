const express = require('express');
const app = express();
const jobs={}

app.post('/submit', (req, res) => {
    console.log('POST /submit received');
    const jobId = `job:${Date.now()}`;
    jobs[jobId] = 0;
    updateJob(jobId, 0);

    res.end("\n\n" + jobId + "\n\n");
});

app.get('/checkStatus', (req, res) => {
    console.log(jobs[req.query.jobId]);
    res.end("\n\n" + jobs[req.query.jobId] + "\n\n");
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});


function updateJob(jobId, newValue) {
    jobs[jobId] = newValue;
    if(newValue == 100) {
        console.log(jobId, newValue);
        return;
    }
    console.log(jobId, newValue);
    this.setTimeout(() => {
        updateJob(jobId, newValue + 5);
    }, 2000);
}
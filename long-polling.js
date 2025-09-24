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
    const jobId = req.query.jobId;
    console.log('Checking status for:', jobId, 'Current value:', jobs[jobId]);
    
    if (!jobId || !jobs[jobId]) {
        return res.status(404).end('Job not found');
    }
    
    // Long polling: wait until job is complete
    const checkComplete = () => {
        if (jobs[jobId] >= 100) {
            res.end("\n\n" + jobs[jobId] + "\n\n");
        } else {
            // Check again in 1 second
            setTimeout(checkComplete, 1000);
        }
    };
    
    checkComplete();
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
    setTimeout(() => {
        updateJob(jobId, newValue + 5);
    }, 2000);
}
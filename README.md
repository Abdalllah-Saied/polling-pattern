# Short Polling Demo

A simple Node.js/Express server that demonstrates **short polling** - a technique for checking server status by making periodic requests.

## What is Short Polling?

Short polling is a client-server communication pattern where:

1. **Client** makes a request to the server
2. **Server** immediately responds with current data
3. **Client** waits a short period, then repeats the request
4. This cycle continues until the desired condition is met

### Short Polling vs Long Polling vs WebSockets

| Method | How it works | Pros | Cons |
|--------|-------------|------|------|
| **Short Polling** | Client requests every few seconds | Simple to implement | High server load, delayed updates |
| **Long Polling** | Server holds request until data changes | Lower server load | More complex, connection timeouts |
| **WebSockets** | Persistent bidirectional connection | Real-time, efficient | Complex setup, connection management |

## How This Project Works

This demo simulates a **job processing system** where:

1. Client submits a job via POST request
2. Server starts processing the job (simulated with progress increments)
3. Client polls the server to check job status
4. Server returns current progress until job completes

### API Endpoints

#### 1. Submit a Job
```bash
POST /submit
```
- **Response**: Job ID (e.g., `job:1758373302100`)
- **Purpose**: Creates a new job and starts processing

#### 2. Check Job Status
```bash
GET /checkStatus?jobId=JOB_ID
```
- **Response**: Current progress (0-100)
- **Purpose**: Check how much of the job is complete

#### 3. Test Endpoint
```bash
GET /test
```
- **Response**: "Server is working!"
- **Purpose**: Verify server is running

## Usage Examples

### 1. Start the Server
```bash
node index.js
```
Server starts on port 8080.

### 2. Submit a Job
```bash
curl -X POST http://localhost:8080/submit
```
Response:
```
job:1758373302100
```

### 3. Check Job Progress
```bash
curl "http://localhost:8080/checkStatus?jobId=job:1758373302100"
```
Response (example):
```
45
```

### 4. Monitor Progress
Keep running the status check command to see progress:
- 0 → 5 → 10 → 15 → ... → 95 → 100

## Code Structure

### Server Logic
```javascript
// Job storage
const jobs = {}

// Submit job endpoint
app.post('/submit', (req, res) => {
    const jobId = `job:${Date.now()}`;
    jobs[jobId] = 0;
    updateJob(jobId, 0);  // Start processing
    res.end(jobId);
});

// Check status endpoint
app.get('/checkStatus', (req, res) => {
    res.end(jobs[req.query.jobId]);
});
```

### Job Processing Simulation
```javascript
function updateJob(jobId, newValue) {
    jobs[jobId] = newValue;
    if(newValue == 100) return;  // Job complete
    
    // Schedule next update in 2 seconds
    setTimeout(() => {
        updateJob(jobId, newValue + 5);
    }, 2000);
}
```

## Real-World Applications

Short polling is commonly used for:

- **File upload progress** - Check upload status
- **Data processing jobs** - Monitor batch operations
- **System status** - Health checks, monitoring
- **Simple notifications** - Basic alert systems

## When to Use Short Polling

### ✅ Good for:
- Simple implementations
- Low-frequency updates
- Small number of clients
- Prototyping and demos

### ❌ Avoid when:
- Real-time updates needed
- High client volume
- Frequent status changes
- Mobile applications (battery drain)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdalllah-Saied/short-polling.git
   cd short-polling
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the server**
   ```bash
   node index.js
   ```

4. **Test the endpoints**
   ```bash
   # Test server
   
   # Submit job
   curl -X POST http://localhost:8080/submit
   
   # Check status (replace JOB_ID)
   curl "http://localhost:8080/checkStatus?jobId=JOB_ID"
   ```

## Dependencies

- **Express.js** (^5.1.0) - Web framework
- **Node.js** (>= 18) - Runtime environment

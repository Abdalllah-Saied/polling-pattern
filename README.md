# Polling Demo

A Node.js/Express project that demonstrates different polling techniques - **short polling** and **long polling** - for checking server status and job progress.

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

## Project Structure

This project includes **three different implementations**:

- **`short-polling.js`** - Traditional short polling implementation
- **`long-polling.js`** - Long polling implementation  
- **`index.js`** - Original implementation (short polling)

## How This Project Works

This demo simulates a **job processing system** where:

1. Client submits a job via POST request
2. Server starts processing the job (simulated with progress increments)
3. Client polls the server to check job status
4. Server returns current progress until job completes

### Short Polling vs Long Polling Behavior

**Short Polling:**
- Client makes requests every few seconds
- Server responds immediately with current status
- Client needs to keep polling until job completes

**Long Polling:**
- Client makes one request
- Server holds the request until job completes
- Server responds with final result when done

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

## Development Scripts

### Available Scripts

```bash
# Development with auto-restart
npm run dev:short    # Run short-polling.js with nodemon
npm run dev:long     # Run long-polling.js with nodemon
npm run dev          # Run index.js with nodemon

# Production
npm start            # Run index.js without auto-restart
```
## Usage Examples

### 1. Start the Server

**For Development (with auto-restart):**
```bash
npm run dev:short    # Short polling
npm run dev:long     # Long polling
```

**For Production:**
```bash
node short-polling.js
node long-polling.js
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

**Short Polling (immediate response):**
```bash
curl "http://localhost:8080/checkStatus?jobId=job:1758373302100"
```
Response (example):
```
45
```

**Long Polling (waits until complete):**
```bash
curl "http://localhost:8080/checkStatus?jobId=job:1758373302100"
```
Response (waits until job reaches 100%):
```
100
```

### 4. Testing Different Implementations

**Test Short Polling:**
```bash
# Terminal 1: Start short polling server
npm run dev:short

# Terminal 2: Submit job
curl -X POST http://localhost:8080/submit
# Response: job:1758373302100

# Terminal 2: Check status multiple times (immediate responses)
curl "http://localhost:8080/checkStatus?jobId=job:1758373302100"
# Response: 0, then 5, then 10, etc.
```

**Test Long Polling:**
```bash
# Terminal 1: Start long polling server
npm run dev:long

# Terminal 2: Submit job
curl -X POST http://localhost:8080/submit
# Response: job:1758373302100

# Terminal 2: Check status (waits until complete)
curl "http://localhost:8080/checkStatus?jobId=job:1758373302100"
# Response: 100 (after ~40 seconds)
```

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

3. **Install nodemon globally (for development)**
   ```bash
   npm install -g nodemon
   ```

4. **Run the server**

   **Development (recommended):**
   ```bash
   npm run dev:short    # Short polling with auto-restart
   npm run dev:long     # Long polling with auto-restart
   ```

   **Production:**
   ```bash
   node short-polling.js
   node long-polling.js
   node index.js
   ```

5. **Test the endpoints**
   ```bash
   # Submit job
   curl -X POST http://localhost:8080/submit
   
   # Check status (replace JOB_ID)
   curl "http://localhost:8080/checkStatus?jobId=JOB_ID"
   ```

## Dependencies

- **Express.js** (^5.1.0) - Web framework
- **Node.js** (>= 18) - Runtime environment
- **Nodemon** (global) - Development auto-restart tool

## Configuration Files

- **`package.json`** - Project configuration and scripts
- **`nodemon.json`** - Nodemon configuration for development
- **`short-polling.js`** - Short polling implementation
- **`long-polling.js`** - Long polling implementation
- **`index.js`** - Original implementation

## Key Differences Between Implementations

| Feature | Short Polling | Long Polling |
|---------|---------------|--------------|
| **Client behavior** | Makes repeated requests | Makes one request |
| **Server response** | Immediate | Waits until complete |
| **Network traffic** | High (many requests) | Low (one request) |
| **Real-time feel** | Delayed updates | Immediate final result |
| **Server load** | Higher | Lower |
| **Implementation** | Simple | More complex |

## Troubleshooting

### Common Issues

1. **"Job not found" error:**
   - Make sure to use the full job ID: `job:1758373302100`
   - Use correct parameter name: `jobId=` not `job=`

2. **Server not restarting:**
   - Make sure nodemon is installed globally: `npm install -g nodemon`
   - Check if port 8080 is already in use

3. **Connection refused:**
   - Ensure server is running on port 8080
   - Check if another process is using the port

### Useful Commands

```bash
# Check what's running on port 8080
lsof -i :8080

# Kill process on port 8080
kill $(lsof -t -i:8080)

# Check server logs
npm run dev:short  # or dev:long
```

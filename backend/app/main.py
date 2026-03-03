from fastapi import FastAPI

app = FastAPI(title="CSC Cloud Backend")

@app.get("/health")
def health():
    return {"status": "Backend is healthy"}

@app.get("/api/message")
def message():
    return {"message": "Hello from Python Backend via REST over HTTP (TCP)"}

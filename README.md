To start  the app run "npm run dev" for both backend and front end.
Key Features of This POC:
1. Lightweight Design

In-memory event queue for POC (easily replaceable with Redis)
Minimal database schema with only essential fields
Asynchronous processing that doesn't block main operations

2. Cost-Effective

Automatic cleanup with TTL (30 days)
Prevents duplicate notifications within 24 hours
Efficient database indexing strategy

3. Non-Blocking

Fire-and-forget event emission
Separate notification processing loop
Independent database operations

4. Real-Time Capabilities

WebSocket integration for instant notifications
User connection management
Automatic cleanup on disconnect

To start  the app run "npm run dev" for both backend and front end.
Key Features of App:
# Lightweight Notification System Design

## Overview
A scalable, cost-effective notification system that operates independently from core blog operations while providing real-time updates for user interactions.

## Architecture Components

### 1. Event-Driven Architecture
```
Blog Operations → Event Queue → Notification Service → User Delivery
```

### 2. Core Components

#### A. Event Producer (Blog API)
- Emits events for user actions (like, share, comment)
- Uses fire-and-forget pattern to avoid blocking main operations
- Events are lightweight JSON payloads

#### B. Message Queue (Redis/In-Memory Queue)
- Buffers notification events
- Prevents notification processing from impacting core services
- Provides retry mechanism for failed deliveries

#### C. Notification Service
- Processes events asynchronously
- Batches notifications to reduce database writes
- Handles different notification types and delivery methods

#### D. Notification Storage
- Separate lightweight collection/table
- Stores only essential notification data
- Implements TTL for automatic cleanup

### 3. Data Models

#### Notification Schema
```javascript
{
  _id: ObjectId,
  recipientId: ObjectId,
  type: String, // 'like', 'share', 'comment'
  actorId: ObjectId,
  actorName: String,
  resourceId: ObjectId, // blog post ID
  resourceTitle: String,
  message: String,
  isRead: Boolean,
  createdAt: Date,
  expiresAt: Date // TTL for cleanup
}
```

#### Event Schema
```javascript
{
  type: String,
  actorId: ObjectId,
  actorName: String,
  recipientId: ObjectId,
  resourceId: ObjectId,
  resourceTitle: String,
  timestamp: Date
}
```

### 4. Event Flow

1. **User Action**: User likes/shares/comments on a blog post
2. **Event Emission**: Blog API emits event to queue (non-blocking)
3. **Event Processing**: Notification service picks up event
4. **Notification Creation**: Service creates notification record
5. **Real-time Delivery**: WebSocket/SSE pushes to connected users
6. **Persistence**: Notification stored for offline users

### 5. Key Design Principles

#### Lightweight
- Minimal data storage (only essential fields)
- Asynchronous processing prevents blocking
- In-memory queuing for speed
- Batch processing reduces I/O operations

#### Cost-Effective
- TTL-based automatic cleanup
- Single notification per action type per resource
- Efficient indexing strategy
- Optional aggregation for similar events

#### Non-Blocking
- Fire-and-forget event emission
- Separate database connection pool
- Independent service deployment
- Circuit breaker pattern for failures

### 6. Implementation Strategy

#### Phase 1: Basic Event System
- Simple in-memory queue
- Basic notification CRUD
- WebSocket for real-time delivery

#### Phase 2: Optimization
- Event batching and aggregation
- Database indexing optimization
- Notification preferences

#### Phase 3: Scale
- External message queue (Redis)
- Horizontal scaling
- Push notifications

### 7. API Endpoints

```
GET /api/notifications - Get user notifications
POST /api/notifications/mark-read - Mark as read
DELETE /api/notifications/:id - Delete notification
GET /api/notifications/unread-count - Get unread count
```

### 8. Performance Considerations

- **Database Indexes**: recipientId, createdAt, isRead
- **Connection Pooling**: Separate pool for notifications
- **Caching**: Unread counts in Redis
- **Cleanup**: Daily job to remove expired notifications

### 9. Monitoring & Analytics

- Event processing rate
- Notification delivery success rate
- Queue depth monitoring
- Database performance metrics

### 10. Scalability Plan

- **Horizontal Scaling**: Multiple notification service instances
- **Database Sharding**: By user ID for large user bases
- **CDN Integration**: For push notification assets
- **Load Balancing**: Distribute WebSocket connections

## Technical Stack Recommendation

- **Queue**: Redis (production) / In-Memory Array (POC)
- **Database**: MongoDB (separate collection)
- **Real-time**: WebSocket/Server-Sent Events
- **Caching**: Redis for unread counts
- **Deployment**: Docker containers for easy scaling

## Cost Analysis

- **Development**: 2-3 days for POC, 1-2 weeks for production
- **Infrastructure**: Minimal additional cost (shared Redis instance)
- **Maintenance**: Low (automated cleanup, simple architecture)
- **Scaling**: Linear cost increase with user growth

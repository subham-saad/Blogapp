// eventQueue.js - Simple in-memory queue for POC
class EventQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  emit(event) {
    this.queue.push({
      ...event,
      timestamp: new Date(),
      id: Math.random().toString(36).substr(2, 9)
    });
    
    // Process queue asynchronously (non-blocking)
    if (!this.processing) {
      setImmediate(() => this.processQueue());
    }
  }

  async processQueue() {
    if (this.processing) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      try {
        await this.processEvent(event);
      } catch (error) {
        console.error('Event processing failed:', error);
        // In production, implement retry logic here
      }
    }
    
    this.processing = false;
  }

  async processEvent(event) {
    const { type, actorId, actorName, recipientId, resourceId, resourceTitle } = event;
    
    // Check if notification already exists to prevent duplicates
    const existingNotification = await Notification.findOne({
      recipientId,
      type,
      actorId,
      resourceId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within 24 hours
    });

    if (existingNotification) {
      // Update existing notification timestamp
      existingNotification.createdAt = new Date();
      await existingNotification.save();
      return;
    }

    // Create new notification
    const message = this.generateMessage(type, actorName, resourceTitle);
    
    const notification = new Notification({
      recipientId,
      type,
      actorId,
      actorName,
      resourceId,
      resourceTitle,
      message
    });

    await notification.save();
    
    // Emit real-time notification
    notificationEmitter.emitToUser(recipientId.toString(), notification);
  }

  generateMessage(type, actorName, resourceTitle) {
    const messages = {
      share: `${actorName} shared your post "${resourceTitle}"`,
      like: `${actorName} liked your post "${resourceTitle}"`,
      comment: `${actorName} commented on your post "${resourceTitle}"`
    };
    return messages[type] || `${actorName} interacted with your post "${resourceTitle}"`;
  }
}

export const eventQueue = new EventQueue();
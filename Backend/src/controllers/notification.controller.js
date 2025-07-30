import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  const notifications = await Notification.find({ recipientId: userId })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const unreadCount = await Notification.countDocuments({
    recipientId: userId,
    isRead: false
  });

  return res.status(200).json(
    new ApiResponse(200, { notifications, unreadCount }, "Notifications fetched successfully")
  );
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res.status(200).json(
    new ApiResponse(200, notification, "Notification marked as read")
  );
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  await Notification.updateMany(
    { recipientId: userId, isRead: false },
    { isRead: true }
  );

  return res.status(200).json(
    new ApiResponse(200, {}, "All notifications marked as read")
  );
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const count = await Notification.countDocuments({
    recipientId: userId,
    isRead: false
  });

  return res.status(200).json(
    new ApiResponse(200, { count }, "Unread count fetched successfully")
  );
});
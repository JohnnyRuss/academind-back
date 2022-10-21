import express from 'express';
import {
  getAllNotifications,
  deleteUserNotification,
  deleteAllUserNotification,
  markAsRead,
  markAllUserNotificationAsRead,
} from '../controllers/notificationController.js';
import { checkAuth, restriction } from '../controllers/authenticationController.js';

const router = express.Router();

router
  .route('/notify/:notifyId')
  .delete(checkAuth, deleteUserNotification)
  .patch(checkAuth, markAsRead);

router.route('/:userId').get(checkAuth, getAllNotifications);

router
  .route('')
  .delete(checkAuth, deleteAllUserNotification)
  .patch(checkAuth, markAllUserNotificationAsRead);

export default router;
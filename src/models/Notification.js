import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
  {
    message: String,
    from: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    adressat: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    read: {
      type: Boolean,
      default: false,
    },
    location: String,
    target: {
      targetType: {
        enum: ['post', 'blogPost', 'user'],
        type: String,
      },
      options: {
        commentId: String,
        replyId: String,
      },
    },
  },
  { timestamps: true }
);

const Notification = model('Notification', NotificationSchema);

export default Notification;

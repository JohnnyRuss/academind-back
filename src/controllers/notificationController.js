import mongoose from "mongoose";

import AppError from "../lib/AppError.js";
import { asyncWrapper } from "../lib/asyncWrapper.js";

import Notification from "../models/Notification.js";

export const getAllNotifications = asyncWrapper(async function (
  req,
  res,
  next
) {
  const { userId } = req.params;
  const currUser = req.user;
  const { ObjectId } = mongoose.Types;

  if (userId !== currUser.id)
    return next(new AppError(403, "you are not authorized for this operation"));

  const notifies = await Notification.find({ adressat: ObjectId(userId) })
    .populate({
      path: "from adressat",
      select: "userName profileImg",
    })
    .sort("-createdAt");

  res.status(200).json(notifies);
});

export const markAsRead = asyncWrapper(async function (req, res, next) {
  const { notifyId } = req.params;
  const currUser = req.user;

  const notify = await Notification.findByIdAndUpdate(
    notifyId,
    { read: true },
    { new: true }
  ).populate({
    path: "from adressat",
    select: "userName profileImg",
  });

  if (currUser.id !== notify.adressat._id.toString())
    return next(new AppError(403, "you are not authorised for this operation"));

  if (!notify) return next(new AppError(404, "notification does not exists"));

  res.status(200).json(notify);
});

export const markAllUserNotificationAsRead = asyncWrapper(async function (
  req,
  res,
  next
) {
  const currUser = req.user;

  await Notification.updateMany(
    { adressat: currUser.id, read: false },
    { $set: { read: true } }
  );

  res.status(201).json({ updated: true });
});

export const deleteAllUserNotification = asyncWrapper(async function (
  req,
  res,
  next
) {
  const currUser = req.user;

  await Notification.deleteMany({ adressat: currUser.id });

  res.status(204).json({ deleted: true });
});

export const deleteUserNotification = asyncWrapper(async function (
  req,
  res,
  next
) {
  const { notifyId } = req.params;
  const currUser = req.user;

  const notify = await Notification.findById(notifyId);

  if (!notify) return next(new AppError(404, "notification does not exists"));
  else if (notify.adressat.toString() !== currUser.id)
    return next(new AppError(404, "you are not authorised for this operation"));

  await notify.delete();

  res.status(204).json({ deleted: true });
});

export const getUnseenNotificationsCount = asyncWrapper(async function (
  req,
  res,
  next
) {
  const currUser = req.user;
  const { userId } = req.params;

  if (currUser.id !== userId)
    return next(new AppError(403, "you are not authorized for this operation"));

  const unreadNotifications = await Notification.find({
    adressat: currUser.id,
    seen: false,
  }).select("_id read");

  res.status(200).json(unreadNotifications);
});

export const markNotificationAsSeen = asyncWrapper(async function (
  req,
  res,
  next
) {
  const currUser = req.user;
  const { userId } = req.params;

  if (currUser.id !== userId)
    return next(new AppError(403, "you are not authorized for this operation"));

  await Notification.updateMany(
    { adressat: currUser.id, seen: false },
    { seen: true }
  );

  res.status(200).json({ isMarked: true });
});

async function editor() {
  await Notification.deleteMany();
}
// editor();

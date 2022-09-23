import express from 'express';
import {
  uploadUserProfileFile,
  resizeAndOptimiseMedia,
  searchUsers,
  getUserProfile,
  getProfilePosts,
  getUserFeed,
  updateProfileImage,
  updateCoverImage,
  getBookmarks,
  isFriend,
} from '../controllers/userController.js';
import { checkAuth } from '../controllers/authenticationController.js';

const router = express.Router();

router.route('/search').get(checkAuth, searchUsers);

router.route('/:userId/profile/posts').get(checkAuth, getProfilePosts);

router.route('/:userId/profile/bookmarks').get(checkAuth, getBookmarks);

router
  .route('/:userId/profile/profileImg')
  .post(checkAuth, uploadUserProfileFile('profileImg'), resizeAndOptimiseMedia, updateProfileImage);

router
  .route('/:userId/profile/coverImg')
  .post(checkAuth, uploadUserProfileFile('coverImg'), resizeAndOptimiseMedia, updateCoverImage);

router.route('/:userId/profile').get(checkAuth, getUserProfile);

router.route('/:userId/feed').get(checkAuth, getUserFeed);

router.route('/:userId/isFriend').get(checkAuth, isFriend);

export default router;

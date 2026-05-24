import express from "express";

import {
  addReview,
  getCompanyReviews,
  likeReview,
} from "../controllers/reviewController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// GET reviews of company
router.get("/:companyId", getCompanyReviews);


// ADD review
router.post("/:companyId", protect, addReview);


// LIKE review
router.patch(
  "/like/:reviewId",
  protect,
  likeReview
);

export default router;
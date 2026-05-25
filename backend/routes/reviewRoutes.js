import express from "express";

import {
  addReview,
  getCompanyReviews,
  getSingleReview,
  likeReview,
} from "../controllers/reviewController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// GET reviews of company
router.get("/:companyId", getCompanyReviews);
router.get(
  "/single/:reviewId",
  getSingleReview
);

// ADD review
router.post("/:companyId", protect, addReview);


// LIKE review
router.patch(
  "/like/:reviewId",
  protect,
  likeReview
);

export default router;
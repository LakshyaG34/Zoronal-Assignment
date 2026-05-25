import express from "express";

import {
  addCompany,
  getCompanies,
  getSingleCompany,
} from "../controllers/companyController.js";

import upload from "../middleware/multer.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCompanies);

router.get("/:id", getSingleCompany);


router.post(
  "/add-company",
  protect,
  upload.single("logo"),
  addCompany
);

export default router;
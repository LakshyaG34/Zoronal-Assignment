import express from "express";

import {
  addCompany,
  getCompanies,
  getSingleCompany,
} from "../controllers/companyController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// PUBLIC
router.get("/", getCompanies);

router.get("/:id", getSingleCompany);


// PROTECTED
router.post("/", protect, addCompany);

export default router;
import Review from "../models/Review.js";
import Company from "../models/Company.js";
import calculateCompanyRating from "../helper/calculateCompanyRating.js";

// ADD REVIEW
export const addReview = async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  const companyId = req.params.companyId;

  console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Request received`);
  console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Company ID: ${companyId}`);
  console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - User ID: ${req.user?._id}`);

  try {
    const {
      fullName,
      subject,
      reviewText,
      rating,
    } = req.body;

    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Request body:`, {
      fullName,
      subject: subject ? `${subject.substring(0, 50)}...` : null,
      reviewText: reviewText ? `${reviewText.substring(0, 100)}...` : null,
      rating
    });

    // validation
    if (!fullName || !subject || !reviewText || !rating) {
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Validation failed: Missing required fields`);
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Field status - FullName: ${!!fullName}, Subject: ${!!subject}, ReviewText: ${!!reviewText}, Rating: ${!!rating}`);

      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Request failed - Missing fields (Duration: ${duration}ms)`);

      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Invalid rating value: ${rating} (must be between 1 and 5)`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Request failed - Invalid rating (Duration: ${duration}ms)`);

      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // check company exists
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Checking if company exists: ${companyId}`);
    const company = await Company.findById(companyId);

    if (!company) {
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Company not found with ID: ${companyId}`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Request failed - Company not found (Duration: ${duration}ms)`);

      return res.status(404).json({
        message: "Company not found",
      });
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Company found: ${company.name} (Current rating: ${company.averageRating || 0}, Total reviews: ${company.totalReviews || 0})`);

    // Check if user already reviewed
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Checking if user already reviewed this company`);
    const alreadyReviewed = await Review.findOne({
      company: companyId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - User already reviewed this company. Review ID: ${alreadyReviewed._id}`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Request failed - Already reviewed (Duration: ${duration}ms)`);

      return res.status(400).json({
        message: "You already reviewed this company",
      });
    }

    // create review
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Creating new review in database`);
    const review = await Review.create({
      company: companyId,
      user: req.user._id,
      fullName,
      subject,
      reviewText,
      rating,
    });

    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Review created successfully with ID: ${review._id}`);

    // RECALCULATE COMPANY RATING
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Recalculating company average rating`);
    await calculateCompanyRating(companyId);
    const reviews = await Review.find({
      company: companyId,
    });

    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Found ${reviews.length} total reviews for this company`);

    const totalRatings = reviews.reduce(
      (acc, item) => acc + item.rating,
      0
    );

    const averageRating = totalRatings / reviews.length;
    const roundedAverage = parseFloat(averageRating.toFixed(1));

    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Rating calculation: Total ratings sum = ${totalRatings}, Count = ${reviews.length}, Average = ${roundedAverage}`);

    company.averageRating = roundedAverage;
    company.totalReviews = reviews.length;

    await company.save();

    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Company updated: New average rating = ${company.averageRating}, Total reviews = ${company.totalReviews}`);

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Request completed successfully (Duration: ${duration}ms)`);

    res.status(201).json(review);

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Error occurred: ${error.message}`);
    console.error(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Stack trace:`, error.stack);
    console.error(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Error details:`, {
      name: error.name,
      code: error.code,
      companyId: req.params.companyId,
      userId: req.user?._id
    });

    console.log(`[${new Date().toISOString()}] [${requestId}] ADD REVIEW - Request failed with error (Duration: ${duration}ms)`);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET REVIEWS OF COMPANY
export const getCompanyReviews = async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  const companyId = req.params.companyId;

  console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Request received for company ID: ${companyId}`);

  try {
    const sort = req.query.sort || "latest";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Query parameters:`, {
      sort,
      page,
      limit
    });

    let sortOption = {};

    if (sort === "rating") {
      sortOption = { rating: -1 };
      console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Sorting by rating (descending)`);
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
      console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Sorting by oldest first`);
    } else {
      sortOption = { createdAt: -1 };
      console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Sorting by latest first`);
    }

    // First check if company exists
    console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Verifying company exists`);
    const company = await Company.findById(companyId);

    if (!company) {
      console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Company not found with ID: ${companyId}`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Request failed - Company not found (Duration: ${duration}ms)`);

      return res.status(404).json({
        message: "Company not found",
      });
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Company found: ${company.name}`);

    // Get reviews with pagination
    console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Fetching reviews from database`);

    const [reviews, totalReviews] = await Promise.all([
      Review.find({ company: companyId })
        .populate("user", "name email")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ company: companyId })
    ]);

    console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Found ${reviews.length} reviews (Total: ${totalReviews})`);

    if (reviews.length > 0) {
      const ratingDistribution = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {});

      console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Rating distribution:`, ratingDistribution);

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Average rating of fetched reviews: ${averageRating.toFixed(1)}`);
    }

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Request completed successfully (Duration: ${duration}ms)`);

    res.status(200).json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit)
      },
      companyInfo: {
        id: company._id,
        name: company.name,
        averageRating: company.averageRating,
        totalReviews: company.totalReviews
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Error occurred: ${error.message}`);
    console.error(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Stack trace:`, error.stack);

    // Handle CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - CastError: Invalid company ID format`);
      return res.status(400).json({
        message: "Invalid company ID format",
      });
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] GET REVIEWS - Request failed with error (Duration: ${duration}ms)`);

    res.status(500).json({
      message: error.message,
    });
  }
};

// LIKE REVIEW
export const likeReview = async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  const reviewId = req.params.reviewId;

  console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Request received`);
  console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Review ID: ${reviewId}`);
  console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - User ID: ${req.user?._id}`);

  try {
    // Validate review ID format
    if (!reviewId || reviewId.length !== 24) {
      console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Invalid review ID format: ${reviewId}`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Request failed - Invalid ID (Duration: ${duration}ms)`);

      return res.status(400).json({
        message: "Invalid review ID format",
      });
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Finding review: ${reviewId}`);
    const review = await Review.findById(reviewId);

    if (!review) {
      console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Review not found with ID: ${reviewId}`);
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Request failed - Review not found (Duration: ${duration}ms)`);

      return res.status(404).json({
        message: "Review not found",
      });
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Review found:`, {
      id: review._id,
      company: review.company,
      user: review.user,
      currentLikes: review.likes,
      rating: review.rating
    });

    const userId =
      req.user._id.toString();

    const alreadyLiked =
      review.likedBy.some(
        (id) =>
          id.toString() === userId
      );

    const previousLikes =
      review.likes;

    if (alreadyLiked) {

      console.log(
        `[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - User already liked review. Removing like...`
      );

      review.likedBy =
        review.likedBy.filter(
          (id) =>
            id.toString() !== userId
        );
      review.likes -= 1;

    } else {

      console.log(
        `[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Adding new like...`
      );

      review.likedBy.push(userId);
      review.likes += 1;
    }
    await review.save();
    console.log(
      `[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Likes updated from ${previousLikes} to ${review.likes}`
    );

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Request completed successfully (Duration: ${duration}ms)`);

    res.status(200).json({
      message: "Review liked",
      likes: review.likes,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Error occurred: ${error.message}`);
    console.error(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Stack trace:`, error.stack);
    console.error(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Error details:`, {
      name: error.name,
      reviewId: req.params.reviewId
    });

    // Handle CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - CastError: Invalid review ID format`);
      return res.status(400).json({
        message: "Invalid review ID format",
      });
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] LIKE REVIEW - Request failed with error (Duration: ${duration}ms)`);

    res.status(500).json({
      message: error.message,
    });
  }
};
import Review from "../models/Review.js";
import Company from "../models/Company.js";



const calculateCompanyRating =
  async (companyId) => {

    // get all reviews
    const reviews = await Review.find({
      company: companyId,
    });



    // no reviews
    if (reviews.length === 0) {

      await Company.findByIdAndUpdate(
        companyId,
        {
          averageRating: 0,
          totalReviews: 0,
        }
      );

      return;
    }



    // total reviews
    const totalReviews =
      reviews.length;



    // average rating
    const averageRating =
      reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      ) / totalReviews;



    // update company
    await Company.findByIdAndUpdate(
      companyId,
      {
        averageRating:
          Number(
            averageRating.toFixed(1)
          ),

        totalReviews,
      }
    );
  };



export default calculateCompanyRating;
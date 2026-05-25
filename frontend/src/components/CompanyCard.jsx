import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

const CompanyCard = ({ company }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        {/* LEFT SECTION */}
        <div className="flex gap-4 sm:gap-5">
          {/* LOGO */}
          <img
            src={company.logo}
            alt={company.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border"
            // onError={(e) => {
            //   e.target.src = "https://via.placeholder.com/100";
            // }}
          />

          {/* CONTENT */}
          <div className="flex flex-col justify-center">
            {/* NAME */}
            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
              {company.name}
            </h2>

            {/* LOCATION */}
            <p className="text-gray-500 text-sm sm:text-base mb-2 sm:mb-3">
              📍 {company.location}
            </p>

            {/* RATING */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* NUMBER */}
              <p className="font-semibold text-base sm:text-lg">
                {Number(company.averageRating || 0).toFixed(1)}
              </p>

              {/* STARS */}
              <Rating
                initialValue={Number(company.averageRating) || 0}
                readonly
                allowFraction
                size={20}
                fillColor="#f5b301"
                emptyColor="#d1d5db"
                SVGstyle={{ display: "inline-block" }}
              />

              {/* TOTAL */}
              <p className="text-gray-500 text-sm sm:text-base">
                {company.totalReviews} Reviews
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-row sm:flex-col items-center justify-between h-26 sm:items-end gap-3 sm:gap-4">
          {/* FOUNDED */}
          <p className="text-gray-400 text-xs sm:text-sm">
            Founded on {new Date(company.foundedOn).toLocaleDateString()}
          </p>

          {/* BUTTON */}
          <Link
            to={`/company/${company._id}`}
            className="bg-black text-white px-4 sm:px-4 py-2 sm:py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base text-center whitespace-nowrap"
          >
            Detail Review
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
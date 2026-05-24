import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";

const CompanyCard = ({ company }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* LEFT */}
        <div className="flex gap-5">

          {/* LOGO */}
          <img
            src={company.logo}
            alt={company.name}
            className="w-24 h-24 rounded-xl object-cover border"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/100";
            }}
          />



          {/* CONTENT */}
          <div className="flex flex-col justify-center">

            {/* NAME */}
            <h2 className="text-2xl font-bold mb-2">
              {company.name}
            </h2>



            {/* LOCATION */}
            <p className="text-gray-500 mb-3">
              📍 {company.location}
            </p>



            {/* RATING */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* NUMBER */}
              <p className="font-semibold text-lg">
                {Number(company.averageRating || 0).toFixed(1)}
              </p>



              {/* STARS */}
              <Rating
                initialValue={
                  Number(company.averageRating) || 0
                }
                readonly
                allowFraction
                size={24}
                fillColor="#f5b301"
                emptyColor="#d1d5db"
                SVGstyle={{ display: "inline-block" }}
              />



              {/* TOTAL */}
              <p className="text-gray-500">
                {company.totalReviews} Reviews
              </p>

            </div>

          </div>

        </div>



        {/* RIGHT */}
        <div className="flex flex-col items-end justify-between gap-4">

          {/* FOUNDED */}
          <p className="text-gray-400 text-sm">
            Founded on{" "}
            {new Date(
              company.foundedOn
            ).toLocaleDateString()}
          </p>



          {/* BUTTON */}
          <Link
            to={`/company/${company._id}`}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Detail Review
          </Link>

        </div>

      </div>

    </div>
  );
};

export default CompanyCard;
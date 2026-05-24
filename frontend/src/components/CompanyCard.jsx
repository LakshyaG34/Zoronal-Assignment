import { Link } from "react-router-dom";

const CompanyCard = ({ company }) => {
  return (
    <Link
      to={`/company/${company._id}`}
      className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white"
    >

      {/* Logo */}
      <img
        src={
          company.logo ||
          "https://via.placeholder.com/100"
        }
        alt={company.name}
        className="w-20 h-20 object-cover rounded-full mb-4"
      />



      {/* Name */}
      <h2 className="text-2xl font-bold mb-2">
        {company.name}
      </h2>



      {/* City */}
      <p className="text-gray-600 mb-2">
        {company.city}
      </p>



      {/* Description */}
      <p className="text-gray-500 line-clamp-3 mb-4">
        {company.description}
      </p>



      {/* Rating */}
      <div className="flex items-center justify-between">

        <p className="font-semibold">
          ⭐ {company.averageRating}
        </p>

        <p className="text-sm text-gray-500">
          {company.totalReviews} reviews
        </p>

      </div>

    </Link>
  );
};

export default CompanyCard;
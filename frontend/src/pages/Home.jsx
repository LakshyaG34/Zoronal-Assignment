import { useEffect, useState } from "react";

import API from "../api/axios";

import CompanyCard from "../components/CompanyCard";

import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";


const Home = () => {

  const [companies, setCompanies] =
    useState([]);

  const [loading, setLoading] =
    useState(false);



  // filters
  const [search, setSearch] =
    useState("");

  const [city, setCity] =
    useState("");

  const [sort, setSort] =
    useState("");



  // fetch companies
  const fetchCompanies = async () => {
    try {

      setLoading(true);

      const { data } = await API.get(
        `/companies?search=${search}&city=${city}&sort=${sort}`
      );

      setCompanies(data.companies);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch companies"
      );

    } finally {

      setLoading(false);

    }
  };



  useEffect(() => {
    fetchCompanies();
  }, [search, city, sort]);



  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* FILTERS */}
      <div className="w-full max-w-5xl mx-auto mb-12">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

          {/* LEFT SECTION */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">

            {/* CITY INPUT */}
            <div className="flex-1">

              <p className="text-gray-600 mb-2 text-sm font-medium">
                Select City
              </p>



              <div className="flex items-center bg-white border rounded-lg overflow-hidden px-4">

                <input
                  type="text"
                  placeholder="Filter by city..."
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  className="flex-1 py-3 outline-none bg-transparent"
                />



                <IoLocationOutline className="text-2xl text-purple-600" />

              </div>

            </div>



            {/* FIND BUTTON */}
            <button
              className="primary-gradient text-white px-8 py-3 rounded-lg font-medium h-fit self-end"
            >
              Find Company
            </button>

          </div>



          {/* RIGHT SECTION */}
          <div className="flex items-end gap-4">

            {/* ADD COMPANY */}
            <Link
              to="/add-company"
              className="primary-gradient text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
            >

              <FaPlus className="text-sm" />

              Add Company

            </Link>



            {/* SORT */}
            <div>

              <p className="text-gray-600 mb-2 text-sm font-medium">
                Sort:
              </p>



              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="bg-white border rounded-lg px-4 py-3 min-w-[170px]"
              >

                <option value="">
                  Latest
                </option>

                <option value="name">
                  Name
                </option>

                <option value="rating">
                  Highest Rating
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>



      {/* LOADING */}
      {loading && (
        <div className="text-center text-xl">
          Loading...
        </div>
      )}



      {/* EMPTY */}
      {!loading &&
        companies.length === 0 && (
          <div className="text-center text-xl text-gray-500">
            No companies found
          </div>
        )}



      {/* COMPANY GRID */}
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">

        {companies.map((company) => (
          <CompanyCard
            key={company._id}
            company={company}
          />
        ))}

      </div>

    </div>
  );
};

export default Home;
import { useEffect } from "react";
import API from "../api/axios";
import CompanyCard from "../components/CompanyCard";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  setCompanies,
  setLoading,
  setCity,
  setSort,
} from "../redux/slices/companySlice";

const Home = () => {

  const dispatch = useDispatch();

  const {
    companies,
    loading,
    search,
    city,
    sort,
  } = useSelector(
    (state) => state.company
  );

  const fetchCompanies = async () => {

    try {

      dispatch(setLoading(true));

      const { data } = await API.get(
        `/companies?search=${search}&city=${city}&sort=${sort}`
      );

      dispatch(
        setCompanies(data.companies)
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch companies"
      );
    } finally {

      dispatch(setLoading(false));

    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search, city, sort]);

  return (
    <div className="p-4 sm:p-10 bg-gray-100 min-h-screen">

      {/* FILTER SECTION */}
      <div className="w-full max-w-5xl mx-auto mb-12">

        {/* Desktop Layout - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:flex lg:flex-row lg:items-end lg:justify-between gap-6">

          {/* LEFT SECTION */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full max-w-lg items-center">

            {/* CITY */}
            <div className="flex-1">

              <p className="text-gray-600 mb-2 text-sm font-medium">
                Select City
              </p>

              <div className="flex items-center bg-white rounded-lg overflow-hidden px-4">
                <input
                  type="text"
                  placeholder="Filter by city..."
                  value={city}
                  onChange={(e) =>
                    dispatch(
                      setCity(
                        e.target.value
                      )
                    )
                  }
                  className="w-[100px] lg:w-[360px] px-4 py-2 pr-10 rounded-md outline-none transition-all duration-200 text-gray-700 text-sm hover:bg-white"
                />

                <IoLocationOutline className="text-2xl text-purple-600" />
              </div>
            </div>

            <button
              className="primary-gradient text-white px-4 py-2 mt-7 rounded-md font-medium text-sm whitespace-nowrap"
            >
              Find Company
            </button>
          </div>

          <div className="flex items-end gap-4">

            <Link
              to="/add-company"
              className="primary-gradient text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <FaPlus className="text-sm" />
              Add Company
            </Link>

            <div>
              <p className="text-gray-600 mb-2 text-sm font-medium">
                Sort:
              </p>

              <select
                value={sort}
                onChange={(e) =>
                  dispatch(
                    setSort(
                      e.target.value
                    )
                  )
                }
                className="bg-white border border-gray-300 rounded-md px-4 py-2 min-w-[170px] text-sm"
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

        {/* Mobile Layout - Visible only on mobile/tablet (below lg screens) */}
        <div className="flex flex-col lg:hidden gap-6">
          
          {/* City Input and Find Button Row */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 w-full">
              <p className="text-gray-600 mb-2 text-sm font-medium">
                Select City
              </p>
              <div className="flex items-center bg-white rounded-lg overflow-hidden px-4 border border-gray-200">
                <input
                  type="text"
                  placeholder="Filter by city..."
                  value={city}
                  onChange={(e) =>
                    dispatch(
                      setCity(
                        e.target.value
                      )
                    )
                  }
                  className="w-full px-4 py-2 rounded-md outline-none transition-all duration-200 text-gray-700 text-sm"
                />
                <IoLocationOutline className="text-2xl text-purple-600 flex-shrink-0" />
              </div>
            </div>

            <button
              className="primary-gradient text-white px-6 py-2 rounded-md font-medium text-sm whitespace-nowrap w-full sm:w-auto sm:mt-7"
            >
              Find Company
            </button>
          </div>

          {/* Add Company and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              to="/add-company"
              className="primary-gradient text-white px-6 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
            >
              <FaPlus className="text-sm" />
              Add Company
            </Link>

            <div className="flex-1 w-full">
              <p className="text-gray-600 mb-2 text-sm font-medium">
                Sort:
              </p>
              <select
                value={sort}
                onChange={(e) =>
                  dispatch(
                    setSort(
                      e.target.value
                    )
                  )
                }
                className="bg-white border border-gray-300 rounded-md px-4 py-2 w-full text-sm"
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

      {/* HORIZONTAL LINE */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="border-t border-gray-300 my-12"></div>
      </div>

      {loading && (
        <div className="text-center text-xl">
          Loading...
        </div>
      )}

      {!loading &&
        companies.length === 0 && (
          <div className="text-center text-xl text-gray-500">
            No companies found
          </div>
        )}

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
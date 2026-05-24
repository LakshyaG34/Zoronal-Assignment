import { useEffect, useState } from "react";

import API from "../api/axios";

import CompanyCard from "../components/CompanyCard";

import toast from "react-hot-toast";



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

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold mb-2">
          Company Reviews
        </h1>

        <p className="text-gray-600">
          Discover and review companies
        </p>

      </div>



      {/* FILTERS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">

        {/* Search */}
        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="p-3 rounded border bg-white"
        />



        {/* City Filter */}
        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
          className="p-3 rounded border bg-white"
        />



        {/* Sort */}
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="p-3 rounded border bg-white"
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
      <div className="grid md:grid-cols-3 gap-6">

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
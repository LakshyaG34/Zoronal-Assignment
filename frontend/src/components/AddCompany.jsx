import { useState } from "react";
import API from "../api/axios";

const AddCompany = () => {

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    foundedOn: "",
    city: "",
    description: "",
  });

  const [logo, setLogo] = useState(null);

  const [previewImage, setPreviewImage] = useState("");

  const [loading, setLoading] = useState(false);

  // handle text fields
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle image
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setLogo(file);

      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // submit form
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const companyData = new FormData();

      companyData.append("name", formData.name);
      companyData.append("location", formData.location);
      companyData.append("foundedOn", formData.foundedOn);
      companyData.append("city", formData.city);
      companyData.append("description", formData.description);

      // image
      if (logo) {
        companyData.append("logo", logo);
      }

      const response = await API.post(
        "/companies/add-company",
        companyData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      alert("Company Added Successfully");

      // reset form
      setFormData({
        name: "",
        location: "",
        foundedOn: "",
        city: "",
        description: "",
      });

      setLogo(null);
      setPreviewImage("");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Add Company
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* company name */}
          <div>
            <label className="block mb-2 font-medium">
              Company Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* location */}
          <div>
            <label className="block mb-2 font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* city */}
          <div>
            <label className="block mb-2 font-medium">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* founded on */}
          <div>
            <label className="block mb-2 font-medium">
              Founded On
            </label>

            <input
              type="date"
              name="foundedOn"
              value={formData.foundedOn}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* description */}
          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter company description"
              rows="4"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* logo upload */}
          <div>

            <label className="block mb-2 font-medium">
              Company Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />

          </div>

          {/* image preview */}
          {previewImage && (

            <div className="flex justify-center">

              <img
                src={previewImage}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover border"
              />

            </div>
          )}

          {/* submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >

            {
              loading
                ? "Adding Company..."
                : "Add Company"
            }

          </button>

        </form>

      </div>

    </div>
  );
};

export default AddCompany;
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CompanyDetail from "./pages/CompanyDetail";
import AddCompany from "./components/AddCompany";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import WebsiteLayout from "./layouts/WebsiteLayout";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* <Navbar /> */}
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/company/:id"
            element={<CompanyDetail />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/add-company"
            element={<AddCompany />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
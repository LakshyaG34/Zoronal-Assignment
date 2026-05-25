import { lazy, Suspense } from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import WebsiteLayout from "./layouts/WebsiteLayout";


const Login = lazy(() =>
  import("./pages/Login")
);
const Register = lazy(() =>
  import("./pages/Register")
);
const Home = lazy(() =>
  import("./pages/Home")
);
const CompanyDetail = lazy(() =>
  import("./pages/CompanyDetail")
);
const AddCompany = lazy(() =>
  import("./components/AddCompany")
);
const SingleReview = lazy(() =>
  import("./pages/SingleReview")
);


function App() {

  return (
    <>
      <Toaster position="top-right" />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />
              <p className="text-gray-500 font-medium">
                Loading...
              </p>
            </div>
          </div>
        }
      >

        <Routes>
          <Route
            element={<PublicRoute />}
          >
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/register"
              element={<Register />}
            />

            {/* <Route
              path="/review/:reviewId"
              element={<SingleReview />}
            /> */}
          </Route>

          {/* WEBSITE LAYOUT */}
          <Route
            element={<WebsiteLayout />}
          >
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/company/:id"
              element={
                <CompanyDetail />
              }
            />
            <Route
              path="/review/:reviewId"
              element={<SingleReview />}
            />

          </Route>

          {/* PROTECTED ROUTES */}
          <Route
            element={<ProtectedRoute />}
          >
            <Route
              path="/add-company"
              element={
                <AddCompany />
              }
            />
          </Route>
        </Routes>
      </Suspense>

    </>
  );
}

export default App;
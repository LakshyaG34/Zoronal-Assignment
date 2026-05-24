import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

const WebsiteLayout = () => {
  return (
    <>
      <Navbar />

      <Outlet />
    </>
  );
};

export default WebsiteLayout;
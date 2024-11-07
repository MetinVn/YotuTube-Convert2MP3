import React, { useContext } from "react";
import Button from "./Button";
import DynamicBreadcrumb from "./Breadcrumb";
import Dashboard from "./Dashboard";
import LoadingAnimation from "../components/LoadingAnimation";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { isLoggedIn, loadingUser } = useContext(UserContext);

  return (
    <div className="fixed top-5 right-5 md:top-2 flex items-center md:items-center justify-end md:justify-center text-justify gap-4 mb-4">
      <div className="block">
        <DynamicBreadcrumb />
      </div>
      {loadingUser ? (
        <LoadingAnimation />
      ) : isLoggedIn ? (
        <>
          <Dashboard />
          <Link to={"/account"}>
            <Button
              aria_label="Account"
              children={"Account"}
              type="button"
              className="p-2 rounded text-[#4CAF50] hover:bg-[#333] text-sm md:text-base"
            />
          </Link>
        </>
      ) : (
        <Link to={"/signin"}>
          <Button
            aria_label="Sign in"
            children="Sign in"
            type="button"
            className="p-2 rounded text-[#4CAF50] hover:bg-[#333] text-sm md:text-base"
          />
        </Link>
      )}
    </div>
  );
};

export default Header;

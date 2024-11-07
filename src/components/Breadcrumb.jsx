import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathnames = location.pathname
      .replace("/YouTube-Converter/", "")
      .split("/")
      .filter((x) => x);
    const newBreadcrumbs = pathnames.map((_, index) => {
      const routeTo = `/YouTube-Converter/${pathnames.slice(0, index + 1).join("/")}`;
      return { path: routeTo, label: pathnames[index] };
    });
    setBreadcrumbs(newBreadcrumbs);
  }, [location]);

  return (
    <nav className="text-blue-400">
      <Link
        title="Home page"
        aria-label="Home page"
        to="/"
        className="text-green-500 underline w-fit hover:text-green-600 duration-300 text-sm md:text-base">
        Home
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          <span className="mx-2 py-2 text-green-500 duration-300 text-sm md:text-base">{">"}</span>
          <Link
            title={breadcrumb.label}
            aria-label={breadcrumb.label}
            className="text-green-500 underline w-fit hover:text-green-600 duration-300 text-sm md:text-base"
            to={breadcrumb.path}>
            {breadcrumb.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default DynamicBreadcrumb;

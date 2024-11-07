import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const pathnames = location.pathname.split("/").filter(Boolean);

      if (!pathnames.length) {
        setBreadcrumbs([]);
        return;
      }

      const newBreadcrumbs = pathnames.map((_, index) => {
        const route = `/${pathnames.slice(0, index + 1).join("/")}`;
        return { path: route, label: pathnames[index] };
      });

      setBreadcrumbs(newBreadcrumbs);
    } catch (err) {
      console.error("Error generating breadcrumbs:", err);
      setError("An error occurred while generating breadcrumbs.");
    }
  }, [location]);

  return (
    <nav>
      <Link
        title="Home page"
        aria-label="Home page"
        to="/"
        className="text-[#4CAF50] underline w-fit hover:text-[#236e26] text-sm md:text-base">
        Home
      </Link>
      {error ? (
        <span className="text-red-500 ml-4 text-sm md:text-base">{error}</span>
      ) : (
        breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <span className="mx-2 py-2 text-[#4CAF50] text-sm md:text-base">{">"}</span>
            <Link
              title={breadcrumb.label}
              aria-label={breadcrumb.label}
              className="text-[#4CAF50] underline w-fit hover:text-[#236e26] text-sm md:text-base"
              to={breadcrumb.path}>
              {breadcrumb.label}
            </Link>
          </React.Fragment>
        ))
      )}
    </nav>
  );
};

export default DynamicBreadcrumb;

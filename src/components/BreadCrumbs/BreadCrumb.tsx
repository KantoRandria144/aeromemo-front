import React from "react";
import { Link } from "react-router-dom";
interface BreadcrumbPath {
  name: string;
  to?: string;
}
interface BreadcrumbProps {
  paths: BreadcrumbPath[];
}

const Breadcrumb = ({ paths }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <nav>
        <ol className="flex items-center gap-2 whitespace-nowrap">
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              {path.to ? (
                <li>
                  <Link className="font-medium" to={path.to}>
                    {path.name}
                  </Link>
                </li>
              ) : (
                <li className="font-medium text-primaryGreen">{path.name}</li>
              )}
              {index < paths.length - 1 && (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-none"
                >
                  <path
                    d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z"
                    className="fill-black dark:fill-white"
                  ></path>
                </svg>
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;

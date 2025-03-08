import React from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

export const Blogs = ({ data }) => {
  return (
    <>
      {data.map((reviewData) => {
        const post = reviewData.node;
        const date = new Date(post.date);
        let formattedDate = "";

        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
        return (
          <Link
            key={post._sys.filename}
            href={`/blogs/` + post._sys.filename}
            passHref
            legacyBehavior
          >
            <div
              key={post.id}
              className="group block px-6 sm:px-8 md:px-10 py-10 mb-8 last:mb-0 bg-gray-50 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-1000 rounded-md shadow-xs transition-all duration-150 ease-out hover:shadow-md hover:to-gray-50 dark:hover:to-gray-800 hover:cursor-pointer"
            >
              <h2
                className={`text-gray-700 dark:text-white text-3xl title-font mb-5 transition-all duration-150 ease-out group-hover:text-blue-600 dark:group-hover:text-blue-300`}
              >
                {post.title}{" "}
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <BsArrowRight className="inline-block h-8 -mt-1 ml-1 w-auto opacity-70" />
                </span>
              </h2>
              <div className="flex items-center">
                {formattedDate !== "" && (
                  <>
                    <span className="font-bold text-gray-200 dark:text-gray-500 mx-2">
                      —
                    </span>
                    <p className="text-base text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-150">
                      {formattedDate}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

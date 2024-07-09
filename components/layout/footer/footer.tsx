import React from "react";
import { Container } from "../../util/container";
import { options } from "../../../tina/collections/global";

export const Footer = ({ data }) => {

  const footerColor = {
    default:
      "text-gray-800 from-white to-gray-50 dark:from-gray-900 dark:to-gray-1000",
    primary: {
      blue: "text-white from-blue-500 to-blue-700",
      teal: "text-white from-teal-500 to-teal-600",
      green: "text-white from-green-500 to-green-600",
      red: "text-white from-red-500 to-red-600",
      pink: "text-white from-pink-500 to-pink-600",
      purple: "text-white from-purple-500 to-purple-600",
      orange: "text-white from-orange-500 to-orange-600",
      yellow: "text-white from-yellow-500 to-yellow-600",
    },
  };

  return (
    <footer className={`bg-gradient-to-br ${footerColor.default}`}>
      <Container className="relative" size="small">
        <div className="flex justify-between items-center gap-6 flex-wrap">
          <p className="text-gray-300">
            Made with ❤️ by{" "}
            <a
              className="text-gray-300 hover:text-gray-400 transition ease-out duration-150"
              href="https://github.com/bradystroud"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brady Stroud
            </a>
          </p>

          <div className="flex gap-4">
            {data.social.map((social) => {
              if (social && social.platform) {
                return (
                  <a
                    className="inline-block opacity-80 hover:opacity-100 transition ease-out duration-150"
                    href={social.url}
                    target="_blank"
                    key={`social-link-${social.platform}`}
                    aria-label={social.platform}
                  >
                    {
                      options.filter(
                        (option) => option.value === social.platform
                      )[0].icon
                    }
                  </a>
                );
              }
            })}
          </div>
        </div>
        <div
          className={`absolute h-1 bg-gradient-to-r from-transparent ${
            data.color === "primary" ? `via-white` : `via-black dark:via-white`
          } to-transparent top-0 left-4 right-4 opacity-5`}
        ></div>
      </Container>
    </footer>
  );
};

import React from "react";
import { Container } from "../../util/container";
import { options } from "../../../tina/collections/global";

export const Footer = ({ data }) => {
  const footerColor = {
    default:
      "text-gray-800 from-white to-gray-50 dark:from-gray-900 dark:to-gray-1000",
  };

  return (
    <footer className={`bg-linear-to-br ${footerColor.default}`}>
      <Container className="relative" size="small">
        <div className="flex justify-between items-center gap-6 flex-wrap">
          <p className="text-gray-400">
            Made with ❤️ by{" "}
            <a
              className="text-gray-400 hover:text-black transition ease-out duration-150"
              href="https://github.com/bradystroud"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brady Stroud
            </a>
          </p>

          <nav aria-label="Social media links" className="flex gap-4">
            {data?.social &&
              data.social.map((social) => {
                if (social && social.platform) {
                  const option = options.find(
                    (option) => option.value === social.platform
                  );
                  return (
                    <a
                      className="text-gray-400 hover:text-black inline-block transition ease-out duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={`social-link-${social.platform}`}
                      aria-label={`${option?.label || social.platform} (opens in new tab)`}
                    >
                      {option?.icon}
                    </a>
                  );
                }
              })}
          </nav>
        </div>
        <div
          className={`absolute h-1 bg-linear-to-r from-transparent ${
            data?.color === "primary" ? `via-white` : `via-black dark:via-white`
          } to-transparent top-0 left-4 right-4 opacity-5`}
        ></div>
      </Container>
    </footer>
  );
};

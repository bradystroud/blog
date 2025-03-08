import React, { useState, useEffect } from "react";
import { FaFacebook, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { Collection, wrapFieldsWithMeta } from "tinacms";
import { getPlatformFromUrl } from "../../utils/getPlatformFromUrl";
import { AiFillInstagram } from "react-icons/ai";

const socialIconClasses = "h-7 w-auto";
export const options = [
  {
    value: "twitter",
    label: "Twitter",
    icon: <FaXTwitter className={`${socialIconClasses}`} />,
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: <AiFillInstagram className={socialIconClasses} />,
  },
  {
    value: "github",
    label: "GitHub",
    icon: <FaGithub className={socialIconClasses} />,
  },
  {
    value: "facebook",
    label: "FaceBook",
    icon: <FaFacebook className={socialIconClasses} />,
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: <FaLinkedin className={socialIconClasses} />,
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: <FaYoutube className={socialIconClasses} />,
  },
];

const CustomDropdown = ({ selected, setSelected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 px-4 py-2 flex items-center justify-between w-40 rounded-md"
      >
        <span className="flex items-center">
          {selected?.icon}
          <span className="ml-2">{selected?.label ?? "Empty"}</span>
          {/* TODO: Handle null selected item */}
        </span>
      </button>
      {isOpen && (
        <ul className="absolute left-0 top-full mt-1 bg-white border border-gray-300 shadow-lg w-full z-10 rounded-md">
          {options.map((option) => (
            <li
              key={option?.value}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 cursor-pointer flex items-center hover:bg-gray-100"
            >
              {option.icon}
              <span className="ml-2">{option?.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Usage within the GlobalCollection

export const GlobalCollection: Collection = {
  label: "Global",
  name: "global",
  path: "content/global",
  format: "json",
  ui: {
    global: true,
  },
  fields: [
    {
      type: "object",
      label: "Header",
      name: "header",
      fields: [
        {
          type: "string",
          label: "Name",
          name: "name",
        },
        {
          type: "object",
          label: "Nav Links",
          name: "nav",
          list: true,
          ui: {
            itemProps: (item) => {
              return { label: item?.label };
            },
            defaultItem: {
              href: "home",
              label: "Home",
            },
          },
          fields: [
            {
              type: "string",
              label: "Link",
              name: "href",
            },
            {
              type: "string",
              label: "Label",
              name: "label",
            },
          ],
        },
      ],
    },
    {
      type: "object",
      label: "Footer",
      name: "footer",
      fields: [
        {
          type: "string",
          label: "Color",
          name: "color",
          options: [
            { label: "Default", value: "default" },
            { label: "Primary", value: "primary" },
          ],
        },
        {
          type: "object",
          label: "Social Links",
          name: "social",
          list: true,
          ui: {
            itemProps: (item) => {
              return {
                label: item?.url
                  ? getPlatformFromUrl(item?.url)
                  : "Empty Social Link",
              };
              // TODO: Cannot get platform data... Why?
            },
            defaultItem: {
              label: "Empty Social Link",
            },
          },
          fields: [
            {
              type: "string",
              label: "Profile URL",
              name: "url",
            },
            {
              type: "string",
              name: "platform",
              label: "Platform",
              description: "Select a platform",
              ui: {
                component: wrapFieldsWithMeta(({ input }) => {
                  const [selected, setSelected] = useState<{
                    value: string;
                    label: string;
                    icon: JSX.Element;
                  }>();

                  useEffect(() => {
                    if (input.value) {
                      const selectedOption = options.find(
                        (option) => option.value === input.value
                      );
                      setSelected(selectedOption ?? options[0]);
                    }
                  }, [input.value]);

                  return (
                    <CustomDropdown
                      {...input}
                      selected={selected}
                      setSelected={setSelected}
                      onChange={(option) => input.onChange(option.value)}
                    />
                  );
                }),
              },
            },
          ],
        },
      ],
    },
  ],
};

import React from "react";
import PropTypes from "prop-types";
import { createPopper } from "@popperjs/core";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
export default function CustomSelect({
  border,
  size,
  leftIcon,
  rightIcon,
  type,
  items,
  closeOnSelect,
  placeholder,
  defaultValue,
  patternDescription,
  changeSelector,
  assumptions,
  name,
  ...rest
}) {
  const sizes = {
    sm: "px-2 py-2 text-sm ",
    lg: "px-3 py-3 text-sm ",
    regular: "px-3 py-2 text-sm ",
  };
  const borders = {
    border: "border-blueGray-300",
    borderless: "border-transparent shadow",
  };
  let inputClasses =
    sizes[size] +
    " w-full placeholder-blueGray-200 bg-white rounded-md outline-none border border-solid transition duration-200 ";
  inputClasses = borders[border] + " " + inputClasses;
  const [menuClasses, setMenuClasses] = React.useState("");
  const [menuShow, setMenuShow] = React.useState(false);
  const [animating, setAntimating] = React.useState(false);
  const [transformOrigin, setTransformOrigin] = React.useState("origin-top-right");
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const origins = {
    "top-start": "origin-bottom-left",
    "top-end": "origin-bottom-right",
    "bottom-start": "origin-top-left",
    "bottom-end": "origin-top-right",
    "right-start": "origin-top-left",
    "right-end": "origin-top-left",
    "left-start": "origin-top-right",
    "left-end": "origin-top-right",
    bottom: "origin-top",
    top: "origin-bottom",
    left: "origin-right",
    right: "origin-left",
  };
  const startAnimation = () => {
    if (!animating) {
      setAntimating(true);
      if (menuShow) {
        setMenuClasses("");
        setTimeout(function () {
          setMenuShow(false);
        }, 310);
      } else {
        let popperObject = createPopper(
          btnDropdownRef.current,
          popoverDropdownRef.current,
          {
            placement: "bottom-start",
          }
        );
        setTransformOrigin(origins[popperObject.state.placement]);
        setMenuShow(true);
        setTimeout(function () {
          setMenuClasses("opacity-100 scale-100 ");
        }, 10);
      }
      setTimeout(function () {
        setAntimating(false);
      }, 350);
    }
  };

  return (
    <>
      <div className="mb-2 mt-2 ml-2 pt-0 relative">
        <input
          value={defaultValue}
          type="text"
          onChange={() => {}}
          onClick={startAnimation}
          placeholder={placeholder}
          ref={btnDropdownRef}
          size={size}
          className={inputClasses}
        />

        <div
          ref={popoverDropdownRef}
          className={(menuShow ? "block " : "hidden ") + "z-50"}
        >
          <div
            className={
              menuClasses +
              " absolute opacity-0 border bg-white text-base z-50 float-left p-2 text-left rounded-lg shadow-lg min-w-48 transition-all duration-200 ease-in-out transform scale-95 origin-top-left " +
              transformOrigin
            }
          >
            {items.map((prop, key) => {
              if (prop.disabled) {
                return (
                  <span
                    className="text-sm pt-12 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-500"
                    key={key}
                  >
                    {prop.text}
                  </span>
                );
              } else {
                return (
                  <span key={key}>
                    <Tooltip
                      html={patternDescription[items.indexOf(prop)]}
                      position="right"
                      arrow="true"
                    >
                      <a
                        href="#pablo"
                        name={name}
                        className={
                          (prop === defaultValue ? "bg-lightBlue-100 " : "") +
                          "text-sm px-3 py-2 font-normal block w-full whitespace-nowrap transition-all duration-200 hover:bg-blueGray-100 rounded"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          changeSelector(e, prop);
                          if (closeOnSelect) {
                            startAnimation();
                          }
                        }}
                      >
                        {prop}
                      </a>
                    </Tooltip>
                  </span>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}

CustomSelect.defaultProps = {
  border: "border",
  size: "regular",
  items: [],
  closeOnSelect: true,
  defaultValue: "",
};

CustomSelect.propTypes = {
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  border: PropTypes.oneOf(["border", "borderless"]),
  closeOnSelect: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      // pass an object with text of string
      // if you want it to be disabled
      PropTypes.shape({
        text: PropTypes.string,
      }),
      // this will not be disabled and
      // users will be able to select it
      PropTypes.string,
    ])
  ),
  size: PropTypes.oneOf(["sm", "lg", "regular"]),
  // NOTE: you sould only pass icon classes
  // // // if you also pass tailwindcss classes
  // // // the output may not be a desired one
  leftIcon: PropTypes.string,
  // NOTE: you sould only pass icon classes
  // // // if you also pass tailwindcss classes
  // // // the output may not be a desired one
  rightIcon: PropTypes.string,
};

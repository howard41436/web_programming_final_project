/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import styled from "styled-components";

export const Row = (props) => {
  const { children, className = "", ...restProps } = props;
  return (
    <div {...restProps} className={`row ${className}`}>
      {children}
    </div>
  );
};

export const Col = (props) => {
  const {
    children,
    size = 12, // md
    otherSize = {}, // lg, sm, ...
    className = "",
    ...restProps
  } = props;

  const otherGrids = Object.entries(otherSize).reduce((str, [key, value]) => {
    return key === "default"
      ? `${str}col-${value} `
      : `${str}col-${key}-${value} `;
  }, "");

  return (
    <div
      {...restProps}
      className={`${otherGrids}${size && `col-md-${size}`} ${className}`}
    >
      {children}
    </div>
  );
};

export const Button = React.forwardRef((props, ref) => {
  const {
    children,
    className = "",
    round = false,
    theme = "",
    type = "button",
    ...restProps
  } = props;

  return (
    <button
      className={`${className} ${
        theme ? `btn btn-${theme} ${round ? "btn-round" : ""}` : ""
      }`}
      ref={ref}
      // eslint-disable-next-line react/button-has-type
      type={type}
      {...restProps}
    >
      {children}
    </button>
  );
});

export const IconFilter = styled.a`
  img {
    height: 35px !important;
    max-width: 100% !important;
    opacity: ${({ selected }) => (selected ? "1" : "0.3")} !important;
    width: auto;
  }
`;

export const IconSelector = styled.a`
  cursor: pointer;
  margin: 10px;
`;

export const IconOption = styled.a`
  cursor: pointer;
  padding: 0 !important;
  text-transform: capitalize;

  label {
    align-items: center;
    display: flex !important;
    color: #212529;
    cursor: pointer;
    font-size: 14px;
    margin: 0;
    padding: 10px 45px 10px 30px;
    width: 100%;

    input {
      cursor: pointer;
      left: 10px;
      position: absolute;
    }

    :hover {
      color: white;
    }
  }
`;

export const IconSorter = styled.i`
  opacity: ${({ active }) => (active ? "1" : "0.3")};
  position: relative;
  width: 9px;

  & + & {
    right: 9px;
  }
`;

export const IconRadio = styled.input.attrs(() => ({
  type: "radio",
}))`
  display: none;

  & + label {
    cursor: pointer;
    display: contents;
  }

  & + label img {
    background: ${({ checked }) =>
      checked ? "rgba(81, 203, 206, 0.6)" : "transparent"};
    border-radius: 5px;
    max-width: 100% !important;
    height: 35px !important;
    opacity: ${({ checked }) => (checked ? 1 : 0.6)};
    width: auto;
  }

  &:hover + label img {
    background: ${({ checked }) =>
      checked ? "rgba(81, 203, 206, 0.6)" : "rgba(81, 203, 206, 0.2)"};
  }
`;

export const IconRadioBig = styled.input.attrs(() => ({
  type: "radio",
}))`
  display: none;

  & + label {
    display: contents;
  }

  & + label img {
    opacity: ${({ checked }) => (checked ? "1" : "0.6")};

    :hover {
      opacity: 1;
    }
  }
`;

export const IconArrow = styled.input.attrs(() => ({
  type: "radio",
}))`
  display: none;

  & + label {
    color: ${({ inputValue }) => (inputValue === -1 ? "#5A586B" : "#ED7B8F")};
    display: contents;
    font-size: ${({ checked }) => (checked ? "59px" : "49px")};
    margin-bottom: 8px;

    :hover {
      color: black;
    }
  }
`;

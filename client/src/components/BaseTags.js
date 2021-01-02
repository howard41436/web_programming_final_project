import React from "react";
import styled from "styled-components";

export const Row = (props) => {
  const { children, className = "" } = props;
  return <div className={`row ${className}`}>{children}</div>;
};

export const Col = (props) => {
  const { children, grid = "md", size = 12, className = "" } = props;

  return <div className={`col-${grid}-${size} ${className}`}>{children}</div>;
};

export const IconFilter = styled.a`
  img {
    opacity: ${({ selected }) => (selected ? "1" : "0.3")} !important;
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
    max-width: 8%;
    padding: ${({ checked }) => (checked ? "1px" : 0)};
  }

  &:hover + label img {
    background: ${({ checked }) =>
      checked ? "rgba(81, 203, 206, 0.6)" : "rgba(81, 203, 206, 0.2)"};
    padding: 2px;
  }
`;

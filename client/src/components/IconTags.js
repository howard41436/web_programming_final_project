import styled from "styled-components";

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

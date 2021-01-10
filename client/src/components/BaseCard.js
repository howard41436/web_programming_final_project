/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { IconFilter, IconSelector, IconOption } from "./BaseTags";
import { BASENAME } from "../constants";

const Title = ({ size, children, ...restProps }) => {
  if (size === 1) return <h1 {...restProps}>{children}</h1>;
  if (size === 2) return <h2 {...restProps}>{children}</h2>;
  if (size === 3) return <h3 {...restProps}>{children}</h3>;
  if (size === 4) return <h4 {...restProps}>{children}</h4>;
  if (size === 5) return <h5 {...restProps}>{children}</h5>;
  return <h6 {...restProps}>{children}</h6>;
};

export default function BaseCard(props) {
  const {
    className = "",
    allowHeader = false,
    title = "",
    titleSize = 4,
    headerStyle = {},
    otherHeader = <></>,
    allowFilter = false,
    filters = [],
    filterDisplay = {},
    setFilterDisplay = () => null,
    allowSelector = false,
    selectorOptions = [],
    selectorDisplay = {},
    setSelectorDisplay = () => null,
    children = <></>,
    allowFooter = false,
    footer = <></>,
  } = props;

  const handleSetFilterDisplay = (owner) => () => {
    setFilterDisplay((dis) => {
      dis[owner] = !dis[owner];
    });
  };

  const handleDropdownClick = (e) => e.stopPropagation();

  const handleSetSelectorDisplay = (cat) => () => {
    setSelectorDisplay((dis) => {
      dis[cat] = !dis[cat];
    });
  };

  const [allSelected, setAllSelected] = useImmer(true);

  useEffect(() => {
    setAllSelected(() =>
      Object.values(selectorDisplay).reduce((a, b) => a && b, true)
    );
  }, [selectorDisplay]);

  const handleSetAllSelected = () => {
    if (allSelected === false) {
      setSelectorDisplay((dis) => {
        Object.keys(dis).forEach((d) => {
          dis[d] = true;
        });
      });
    } else {
      setSelectorDisplay((dis) => {
        Object.keys(dis).forEach((d) => {
          dis[d] = false;
        });
      });
    }
    setAllSelected((sel) => !sel);
  };

  return (
    <div className={`card ${className}`}>
      {allowHeader && (
        <div className="card-header">
          <Title size={titleSize} className="card-title" style={headerStyle}>
            {title} {otherHeader}
            {(allowFilter || allowSelector) && (
              <span className="menu">
                {allowFilter && (
                  <span className="logo-list">
                    {filters.includes(0) && (
                      <IconFilter
                        onClick={handleSetFilterDisplay("0")}
                        selected={filterDisplay["0"]}
                      >
                        <img src={`${BASENAME}img/boy.png`} alt="boy" />
                      </IconFilter>
                    )}{" "}
                    {filters.includes(1) && (
                      <IconFilter
                        onClick={handleSetFilterDisplay("1")}
                        selected={filterDisplay["1"]}
                      >
                        <img src={`${BASENAME}img/girl.png`} alt="girl" />
                      </IconFilter>
                    )}{" "}
                    {filters.includes(-1) && (
                      <IconFilter
                        onClick={handleSetFilterDisplay("-1")}
                        selected={filterDisplay["-1"]}
                      >
                        <img src={`${BASENAME}img/both1.png`} alt="both" />
                      </IconFilter>
                    )}
                  </span>
                )}
                {allowSelector && (
                  <>
                    <IconSelector
                      className="dropdown-toggle"
                      id="chooseBudgeType"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-list" />{" "}
                      <span className="d-lg-none d-md-block">
                        Choose Category
                      </span>
                    </IconSelector>
                    <div
                      className="dropdown-menu dropdown-menu-right mydropdown-menu"
                      aria-labelledby="chooseBudgeType"
                      onClick={handleDropdownClick}
                      onKeyDown={handleDropdownClick}
                      role="button"
                      style={{ outline: "none" }}
                      tabIndex={0}
                    >
                      <IconOption className="dropdown-item">
                        <label htmlFor="all_selected">
                          Select All
                          <input
                            checked={allSelected}
                            id="all_selected"
                            type="checkbox"
                            onChange={handleSetAllSelected}
                          />
                        </label>
                      </IconOption>
                      {selectorOptions.map((opt) => (
                        <IconOption key={opt} className="dropdown-item">
                          <label htmlFor={opt}>
                            {opt}
                            <input
                              checked={selectorDisplay[opt]}
                              id={opt}
                              type="checkbox"
                              onChange={handleSetSelectorDisplay(opt)}
                            />
                          </label>
                        </IconOption>
                      ))}
                    </div>
                  </>
                )}
              </span>
            )}
          </Title>
        </div>
      )}

      <div className="card-body">{children}</div>

      {allowFooter && (
        <div className="card-footer">
          <hr />
          {footer}
        </div>
      )}
    </div>
  );
}

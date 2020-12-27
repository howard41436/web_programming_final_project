import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { IconFilter, IconSelector, IconOption } from "./IconTags";
import { BASENAME } from "../constants";

export default function BaseCard(props) {
  const {
    cardClasses = "",
    allowHeader = false,
    title = "",
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
    <div className={`card ${cardClasses}`}>
      {allowHeader && (
        <div className="card-header">
          <h4 className="card-title" style={{ display: "inline" }}>
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
          </h4>
        </div>
      )}

      <div className="card-body">{children}</div>

      {allowFooter && <div className="card-footer">{footer}</div>}
    </div>
  );
}

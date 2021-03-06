/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useSelector } from "react-redux";
import { selectInfo } from "../redux/infoSlice";
import { IconFilter, IconSelector, IconOption } from "./BaseTags";

const Title = ({ size, children, ...restProps }) => {
  if (size === 1) return <h1 {...restProps}>{children}</h1>;
  if (size === 2) return <h2 {...restProps}>{children}</h2>;
  if (size === 3) return <h3 {...restProps}>{children}</h3>;
  if (size === 4) return <h4 {...restProps}>{children}</h4>;
  if (size === 5) return <h5 {...restProps}>{children}</h5>;
  if (size === 6) return <h6 {...restProps}>{children}</h6>;
  return <>{children}</>;
};

export default function BaseCard(props) {
  const { ownerIcon } = useSelector(selectInfo);
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
    multiSelect = false,
    selectorName = null,
    selectorOptions = [],
    selectorDisplay = {},
    setSelectorDisplay = () => null,
    children = <></>,
    allowFooter = false,
    footer = <></>,
  } = props;

  const handleSetFilterDisplay = (filt) => () => {
    setFilterDisplay((dis) => {
      dis[filt] = !dis[filt];
    });
  };

  const handleDropdownClick = (e) => e.stopPropagation();

  const handleSetSelectorDisplay = (sel) => () => {
    setSelectorDisplay((dis) => {
      if (!multiSelect) {
        dis = Object.keys(dis).reduce((a, b) => {
          return { ...a, [b]: false };
        }, {});
      }
      dis[sel] = !dis[sel];
      return dis;
    });
  };

  const [allSelected, setAllSelected] = useImmer(true);

  useEffect(() => {
    if (multiSelect) {
      setAllSelected(() =>
        Object.values(selectorDisplay).reduce((a, b) => a && b, true)
      );
    }
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
          {(allowFilter || allowSelector) && (
            <span
              className="menu"
              style={{ paddingRight: "30px", width: "100%" }}
            >
              {allowFilter && (
                <span className="logo-list">
                  {filters.includes(0) && (
                    <IconFilter
                      onClick={handleSetFilterDisplay("0")}
                      selected={filterDisplay["0"]}
                    >
                      <img src={ownerIcon["0"].src} alt={ownerIcon["0"].alt} />
                    </IconFilter>
                  )}{" "}
                  {filters.includes(1) && (
                    <IconFilter
                      onClick={handleSetFilterDisplay("1")}
                      selected={filterDisplay["1"]}
                    >
                      <img src={ownerIcon["1"].src} alt={ownerIcon["1"].alt} />
                    </IconFilter>
                  )}{" "}
                  {filters.includes(-1) && (
                    <IconFilter
                      onClick={handleSetFilterDisplay("-1")}
                      selected={filterDisplay["-1"]}
                    >
                      <img
                        src={ownerIcon["-1"].src}
                        alt={ownerIcon["-1"].alt}
                      />
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
                    {multiSelect && (
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
                    )}
                    {selectorOptions.map((opt) => (
                      <IconOption key={opt.value} className="dropdown-item">
                        <label htmlFor={`${opt.value}_${selectorName}`}>
                          {opt.content}
                          <input
                            checked={selectorDisplay[opt.value]}
                            id={`${opt.value}_${selectorName}`}
                            type={multiSelect ? "checkbox" : "radio"}
                            name={selectorName}
                            onChange={handleSetSelectorDisplay(opt.value)}
                          />
                        </label>
                      </IconOption>
                    ))}
                  </div>
                </>
              )}
            </span>
          )}
          <Title size={titleSize} className="card-title" style={headerStyle}>
            {title} {otherHeader}
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

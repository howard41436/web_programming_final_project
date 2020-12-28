/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useImmer } from "use-immer";
import BaseCard from "../components/BaseCard";
import BaseTable from "../components/BaseTable";
import { BASENAME } from "../constants";

export default function MonthlyExpenses(props) {
  const { categoryInfo, expenses, setExpenses, setModalInfo } = props;
  const handleSetModalShow = (type, s, exp) => () => {
    setModalInfo((ss) => {
      ss.show[type] = s;
      ss.data = exp;
    });
  };

  const [filterDisplay, setFilterDisplay] = useImmer({
    "-1": true,
    0: true,
    1: false,
  });

  const [selectorDisplay, setSelectorDisplay] = useImmer(
    Object.keys(categoryInfo).reduce(
      (obj, cur) => ({ ...obj, [cur]: true }),
      {}
    )
  );

  const ownerIcon = {
    "-1": {
      src: `${BASENAME}img/both.png`,
      alt: "both",
    },
    0: {
      src: `${BASENAME}img/boy.png`,
      alt: "boy",
    },
    1: {
      src: `${BASENAME}img/girl.png`,
      alt: "girl",
    },
  };

  const shouldBeSettled = (exp) =>
    exp.paid.user0 !== exp.owed.user0 || exp.paid.user1 !== exp.owed.user1;

  const formatDate = (date) => {
    return `${new Date(date).toLocaleString("en", {
      month: "short",
    })}. ${new Date(date).getDate()}`;
  };

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const renderRow = (exp) => {
    return (
      filterDisplay[exp.owner] &&
      selectorDisplay[exp.category] && (
        <tr
          // eslint-disable-next-line dot-notation
          key={exp["_id"]}
          className={shouldBeSettled(exp) ? "selected" : null}
        >
          <td className="icon-set">
            <a
              onClick={handleSetModalShow("edit", true, exp)}
              onKeyDown={handleSetModalShow("edit", true, exp)}
              style={{ cursor: "pointer", outline: "none" }}
              role="button"
              tabIndex={0}
            >
              <i className="far fa-edit" />
            </a>{" "}
            <i className="far fa-trash-alt" />
          </td>
          <td>
            <span>{formatDate(exp.date)}</span>
          </td>
          <td style={{ textTransform: "capitalize" }}>
            <span className="icon-big text-center icon-warning">
              <i className={categoryInfo[exp.category].icon} />
            </span>{" "}
            {exp.category}
          </td>
          <td>
            <div className="logo-image-small">
              <img
                src={ownerIcon[String(exp.owner)].src}
                alt={ownerIcon[String(exp.owner)].alt}
              />
            </div>
          </td>
          <td style={{ textTransform: "capitalize" }}>{exp.name}</td>
          <td className="text-right">$ {commaNumber(exp.price)}</td>
        </tr>
      )
    );
  };

  const IconAdd = () => (
    <a
      onClick={handleSetModalShow("add", true, null)}
      onKeyDown={handleSetModalShow("add", true, null)}
      style={{ outline: "none" }}
      role="button"
      tabIndex={0}
    >
      <button
        className="btn btn-outline-success btn-round btn-icon"
        type="button"
        style={{ margin: "1px 1px" }}
      >
        <i className="nc-icon nc-simple-add" />
      </button>
    </a>
  );

  return (
    <BaseCard
      cardClasses=""
      allowHeader
      title="Monthly Expenses"
      otherHeader={<IconAdd />}
      allowFilter
      filters={[-1, 0, 1]}
      filterDisplay={filterDisplay}
      setFilterDisplay={setFilterDisplay}
      allowSelector
      selectorOptions={Object.keys(categoryInfo)}
      selectorDisplay={selectorDisplay}
      setSelectorDisplay={setSelectorDisplay}
      allowFooter={false}
    >
      <BaseTable
        columns={["", "date", "category", "member", "descriptions", "amount"]}
        sortableIndex={[1]}
        defaultSortedOrder={[1, "desc"]}
        data={expenses}
        setData={setExpenses}
        renderRow={renderRow}
      />
    </BaseCard>
  );
}

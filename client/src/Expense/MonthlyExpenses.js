/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import { selectInfo } from "../redux/infoSlice";
import { setExpenses, selectExpenses } from "../redux/expenseSlice";

import BaseCard from "../components/BaseCard";
import BaseTable from "../components/BaseTable";
import { INSTANCE } from "../constants";

export default function MonthlyExpenses(props) {
  const dispatch = useDispatch();
  const { categoryInfo, ownerIcon } = useSelector(selectInfo);
  const { expenses } = useSelector(selectExpenses);

  const { setModalInfo } = props;
  const handleSetModalInfo = (type, show, exp) => () => {
    setModalInfo((info) => {
      info.show[type] = show;
      info.data = exp;
    });
  };

  const columns = ["", "date", "category", "member", "descriptions", "amount"];
  const [data, setData] = useImmer([]);

  useEffect(() => {
    setData(() =>
      Object.values(expenses).map((exp) => [
        null,
        exp.date,
        exp.category,
        exp.owner,
        exp.name,
        exp.price,
        exp,
      ])
    );
  }, [expenses]);

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

  const shouldBeSettled = (exp) =>
    exp.paid.user0 !== exp.owed.user0 || exp.paid.user1 !== exp.owed.user1;

  const formatDate = (date) => {
    return `${new Date(date).toLocaleString("en", {
      month: "short",
    })}. ${new Date(date).getDate()}`;
  };

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleDeleteExpenses = (_id, pairId) => () => {
    INSTANCE.post("/api/deleteRecord", {}, { params: { _id, pairId } }).then(
      (res) => {
        if (res.status === 200) {
          const { [_id]: _, ...newExpenses } = expenses;
          dispatch(
            setExpenses({
              expenses: newExpenses,
            })
          );
        }
      }
    );
  };

  const renderRow = (d) => {
    const exp = d[6];
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
              onClick={handleSetModalInfo("edit", true, exp)}
              onKeyDown={handleSetModalInfo("edit", true, exp)}
              style={{ cursor: "pointer", outline: "none" }}
              role="button"
              tabIndex={0}
            >
              <i className="far fa-edit" />
            </a>{" "}
            <i
              className="far fa-trash-alt"
              // eslint-disable-next-line dot-notation
              onClick={handleDeleteExpenses(exp["_id"], exp.pairId)}
              // eslint-disable-next-line dot-notation
              onKeyDown={handleDeleteExpenses(exp["_id"], exp.pairId)}
              style={{ cursor: "pointer", outline: "none" }}
              role="button"
              tabIndex={0}
            >
              {" "}
            </i>
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
      onClick={handleSetModalInfo("add", true, null)}
      onKeyDown={handleSetModalInfo("add", true, null)}
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
    >
      <BaseTable
        columns={columns}
        sortableIndex={[1]}
        defaultSortedOrder={[1, "desc"]}
        data={data}
        renderRow={renderRow}
      />
    </BaseCard>
  );
}

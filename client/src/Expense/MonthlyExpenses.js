/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import { useImmer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import { selectInfo } from "../redux/infoSlice";
import { setExpenses, selectExpenses } from "../redux/expenseSlice";

import BaseCard from "../components/BaseCard";
import BaseTable from "../components/BaseTable";
import { baseToast, BaseToastInner } from "../components/BaseToast";
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

  const handleDeleteExpenses = async (_id, pairId) => {
    await INSTANCE.post(
      "/api/deleteRecord",
      {},
      { params: { _id, pairId } }
    ).then((res) => {
      if (res.status === 200) {
        const { [_id]: _, ...newExpenses } = expenses;
        dispatch(
          setExpenses({
            expenses: newExpenses,
          })
        );
      }
    });
  };

  const DeleteToast = ({
    exp,
    ...toastProps // From react-toastify
  }) => {
    const { closeToast } = toastProps;

    const handleDelete = async () => {
      // eslint-disable-next-line dot-notation
      await handleDeleteExpenses(exp["_id"], exp.pairId);
      closeToast();

      baseToast(
        <BaseToastInner
          icon="nc-icon nc-check-2"
          title="Delete successfully."
          message={`(${exp.name}, $ ${exp.price}, ${formatDate(exp.date)})`}
        />,
        {
          autoClose: 6000,
          position: "top-center",
        }
      );
    };

    return (
      <BaseToastInner
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...toastProps}
        icon="nc-icon nc-bell-55"
        title="Remove this record?"
        message={`(${exp.name}, $ ${exp.price}, ${formatDate(exp.date)})`}
        allowButton
        buttonAction={handleDelete}
        buttonClasses="btn btn-danger btn-round"
        buttonText="Remove"
      />
    );
  };

  const handleShowToast = (exp) => (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    baseToast(<DeleteToast exp={exp} />, {
      backdrop: true,
      dispatch,
      autoClose: 12000,
      closeOnClick: false,
      draggable: false,
      position: "top-center",
      type: "alert",
    });
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
            <a
              onClick={handleShowToast(exp)}
              onKeyDown={handleShowToast(exp)}
              style={{ cursor: "pointer", outline: "none" }}
              role="button"
              tabIndex={0}
            >
              <i className="far fa-trash-alt" />
            </a>
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

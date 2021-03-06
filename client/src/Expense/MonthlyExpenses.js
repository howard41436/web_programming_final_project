/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

import { useImmer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";
import { selectForm } from "../redux/formSlice";
import { setExpenses, selectExpenses } from "../redux/expenseSlice";

import BaseCard from "../components/BaseCard";
import BaseTable from "../components/BaseTable";
import { Button } from "../components/BaseTags";
import {
  baseToast,
  BaseToastInner,
  errorToast,
  successToast,
} from "../components/BaseToast";
import { INSTANCE } from "../constants";

export default function MonthlyExpenses(props) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const { categoryInfo, ownerIcon } = useSelector(selectInfo);
  const { expenses } = useSelector(selectExpenses);
  const {
    navbar_search: { search },
  } = useSelector(selectForm("navbar_search"));

  const { setModalInfo } = props;
  const handleSetModalInfo = (type, exp) => (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    setModalInfo((info) => {
      info.show[type] = true;
      info.data = exp
        ? {
            ...exp,
            owedPercent: {
              user0: (exp.owed.user0 / exp.price) * 100,
              user1: (exp.owed.user1 / exp.price) * 100,
            },
          }
        : null;
    });
  };

  const columns = ["", "date", "category", "member", "descriptions", "amount"];
  const [data, setData] = useImmer([]);

  const formatDate = (date) => {
    const month = new Date(date).toLocaleString("en", {
      month: "short",
    });
    return `${month}${month !== "May" && "."} ${new Date(date).getDate()}`;
  };

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
    0: user === "0",
    1: user === "1",
  });

  const [selectorDisplay, setSelectorDisplay] = useImmer(
    Object.keys(categoryInfo).reduce(
      (obj, cur) => ({ ...obj, [cur]: true }),
      {}
    )
  );

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleDeleteExpenses = async (_id, pairId) => {
    await INSTANCE.post("/api/deleteRecord", {}, { params: { _id, pairId } })
      .then((res) => {
        if (res.status === 200) {
          const { [_id]: _, ...newExpenses } = expenses;
          dispatch(
            setExpenses({
              expenses: newExpenses,
            })
          );
        }
      })
      .catch((err) => errorToast(err, "Delete"));
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

      successToast(
        "Delete",
        `(${exp.name}, $ ${exp.price}, ${formatDate(exp.date)})`
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
        buttonRound
        buttonTheme="danger"
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

  const handleSearch = (row) => {
    if (!search) return true;
    row[5] = `$ ${row[5]}`;
    row[1] = formatDate(row[1]);
    row[3] = null;
    let flag = false;
    row.forEach((r) => {
      if (typeof r === "string") {
        flag = flag || r.toLowerCase().includes(search.toLowerCase());
      }
    });
    return flag;
  };

  const renderRow = (row) => {
    const exp = row[6];
    return (
      filterDisplay[exp.owner] &&
      selectorDisplay[exp.category] &&
      handleSearch(row.slice(0, 6)) && (
        <tr
          // eslint-disable-next-line dot-notation
          key={exp["_id"]}
        >
          <td className="icon-set">
            <a
              onClick={handleSetModalInfo("edit", exp)}
              onKeyDown={handleSetModalInfo("edit", exp)}
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
            <span>{formatDate(row[1])}</span>
          </td>
          <td style={{ textTransform: "capitalize" }}>
            <span className="icon-big text-center icon-warning">
              <i className={categoryInfo[row[2]].icon} />
            </span>{" "}
            {row[2]}
          </td>
          <td>
            <div style={{ height: "40px", textAlign: "center", width: "60px" }}>
              <img
                src={ownerIcon[String(row[3])].src}
                alt={ownerIcon[String(row[3])].alt}
                style={{ height: "35px" }}
              />
            </div>
          </td>
          <td style={{ textTransform: "capitalize" }}>{row[4]}</td>
          <td className="text-right">$ {commaNumber(row[5])}</td>
        </tr>
      )
    );
  };

  const IconAdd = () => (
    <a
      onClick={handleSetModalInfo("add", null)}
      onKeyDown={handleSetModalInfo("add", null)}
      style={{ outline: "none" }}
      role="button"
      tabIndex={0}
    >
      <Button
        className="btn-outline-success"
        round
        theme="icon"
        type="button"
        style={{ margin: "1px 1px" }}
      >
        <i className="nc-icon nc-simple-add" />
      </Button>
    </a>
  );

  const selectorOptions = Object.entries(categoryInfo).map(([key, v]) => ({
    content: (
      <span className="icon-big text-center icon-warning">
        <i className={v.icon} /> {key}
      </span>
    ),
    value: key,
  }));

  return (
    <BaseCard
      allowHeader
      title="Monthly Expenses"
      headerStyle={{ display: "inline" }}
      otherHeader={<IconAdd />}
      allowFilter
      filters={[-1, 0, 1]}
      filterDisplay={filterDisplay}
      setFilterDisplay={setFilterDisplay}
      allowSelector
      multiSelect
      selectorOptions={selectorOptions}
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

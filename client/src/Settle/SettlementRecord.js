import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";
import { selectInfo } from "../redux/infoSlice";
import { selectForm } from "../redux/formSlice";
import { setDebt, setExpenses, selectExpenses } from "../redux/expenseSlice";
import BaseCard from "../components/BaseCard";
import BaseTable from "../components/BaseTable";
import {
  baseToast,
  BaseToastInner,
  errorToast,
  successToast,
} from "../components/BaseToast";
import { INSTANCE } from "../constants";

export default function SettlementRecord(props) {
  const dispatch = useDispatch();
  const { categoryInfo, ownerIcon } = useSelector(selectInfo);
  const { expenses, debt } = useSelector(selectExpenses);
  const { setModalInfo } = props;
  const {
    navbar_search: { search },
  } = useSelector(selectForm("navbar_search"));

  const handleSetModalInfo = (exp) => (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    setModalInfo((info) => {
      info.show.edit = true;
      info.data = {
        ...exp,
        owedPercent: {
          user0: (exp.owed.user0 / exp.price) * 100,
          user1: (exp.owed.user1 / exp.price) * 100,
        },
      };
    });
  };

  const columns = [
    "",
    "date",
    "category",
    "member",
    "descriptions",
    "creditor",
    "owed",
  ];
  const [data, setData] = useImmer([]);

  const formatDate = (date) => {
    return `${new Date(date).toLocaleString("en", {
      month: "short",
    })}. ${new Date(date).getDate()}`;
  };

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const getSettler = (exp) => (exp.receivedMoneyOfUser0 < 0 ? 0 : 1);
  const getCreditor = (exp) => (exp.paid.user0 > exp.owed.user0 ? 0 : 1);
  const getOwed = (exp) => Math.abs(exp.owed.user0 - exp.paid.user0);

  useEffect(() => {
    setData(() => {
      return Object.values(debt.recordsAndSettlements).map(({ content: exp }) =>
        exp.receivedMoneyOfUser0 === undefined
          ? [
              null,
              exp.date,
              exp.category,
              exp.owner,
              exp.name,
              getCreditor(exp),
              getOwed(exp),
              exp,
            ]
          : [
              null,
              exp.date,
              null,
              null,
              null,
              getSettler(exp),
              Math.abs(exp.receivedMoneyOfUser0),
              exp,
            ]
      );
    });
  }, [debt]);

  const [filterDisplay, setFilterDisplay] = useImmer({
    0: true,
    1: true,
  });

  const [selectorDisplay, setSelectorDisplay] = useImmer({
    settlements: true,
    expenses: true,
  });

  const handleDeleteSettle = async (_id, pairId, money) => {
    await INSTANCE.post(
      "/api/deleteSettlement",
      {},
      { params: { _id, pairId } }
    )
      .then((res) => {
        if (res.status === 200) {
          const { debtOfUser0 } = debt;
          const { [_id]: _, ...newRec } = debt.recordsAndSettlements;
          dispatch(
            setDebt({
              debt: {
                debtOfUser0: debtOfUser0 - money,
                recordsAndSettlements: newRec,
              },
            })
          );
        }
      })
      .catch((err) => errorToast(err, "Delete"));
  };

  const handleDeleteRecord = async (_id, pairId, money) => {
    await INSTANCE.post("/api/deleteRecord", {}, { params: { _id, pairId } })
      .then((res) => {
        if (res.status === 200) {
          const { debtOfUser0 } = debt;
          const { [_id]: _, ...newRec } = debt.recordsAndSettlements;
          dispatch(
            setDebt({
              debt: {
                debtOfUser0: debtOfUser0 - money,
                recordsAndSettlements: newRec,
              },
            })
          );
          const { [_id]: __, ...newExpenses } = expenses;
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
    type,
    ...toastProps // From react-toastify
  }) => {
    const { closeToast } = toastProps;
    const message =
      type === "settlements"
        ? `($ ${Math.abs(exp.receivedMoneyOfUser0)}, ${formatDate(exp.date)})`
        : `(${exp.name}, $ ${exp.price}, ${formatDate(exp.date)})`;

    const handleDelete = async () => {
      if (type === "settlements")
        await handleDeleteSettle(
          // eslint-disable-next-line dot-notation
          exp["_id"],
          exp.pairId,
          exp.receivedMoneyOfUser0
        );
      else
        await handleDeleteRecord(
          // eslint-disable-next-line dot-notation
          exp["_id"],
          exp.pairId,
          exp.owed.user0 - exp.paid.user0
        );
      closeToast();
      successToast("Delete", message);
    };

    return (
      <BaseToastInner
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...toastProps}
        icon="nc-icon nc-bell-55"
        title="Remove this record?"
        message={message}
        allowButton
        buttonAction={handleDelete}
        buttonRound
        buttonTheme="danger"
        buttonText="Remove"
      />
    );
  };

  const handleShowToast = (exp, type) => (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    baseToast(<DeleteToast exp={exp} type={type} />, {
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
    row[6] = `$ ${row[6]}`;
    row[1] = formatDate(row[1]);
    row[3] = null;
    row[5] = null;
    let flag = false;
    row.forEach((r) => {
      if (typeof r === "string") {
        flag = flag || r.toLowerCase().includes(search.toLowerCase());
      }
    });
    return flag;
  };

  const renderRow = (row) => {
    const creditor = row[5];
    const exp = row[7];
    const type =
      exp.receivedMoneyOfUser0 === undefined ? "expenses" : "settlements";

    return (
      filterDisplay[creditor] &&
      selectorDisplay[type] &&
      handleSearch(row.slice(0, 7)) &&
      row[6] !== 0 && (
        <tr
          // eslint-disable-next-line dot-notation
          key={exp["_id"]}
          className={`${type === "settlements" ? "selected" : ""}`}
        >
          <td className="icon-set">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              onClick={handleSetModalInfo(exp)}
              onKeyDown={handleSetModalInfo(exp)}
              style={{
                cursor: "pointer",
                outline: "none",
                visibility: type === "settlements" ? "hidden" : null,
              }}
              role="button"
              tabIndex={0}
            >
              <i className="far fa-edit" />
            </a>{" "}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              onClick={handleShowToast(exp, type)}
              onKeyDown={handleShowToast(exp, type)}
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
              <i className={row[2] && categoryInfo[row[2]].icon} />
            </span>{" "}
            {row[2]}
          </td>
          <td>
            <div style={{ height: "40px", textAlign: "center", width: "60px" }}>
              {row[3] !== null && (
                <img
                  src={ownerIcon[String(row[3])].src}
                  alt={ownerIcon[String(row[3])].alt}
                  style={{ height: "35px" }}
                />
              )}
            </div>
          </td>
          <td style={{ textTransform: "capitalize" }}>{row[4]}</td>
          <td>
            <div style={{ height: "40px", textAlign: "center", width: "96px" }}>
              <img
                src={ownerIcon["0"].src}
                alt={ownerIcon["0"].alt}
                style={{ height: "35px" }}
              />
              <span className="settle-arrow">
                <i
                  className={`fas fa-long-arrow-alt-${
                    row[5] === 0 ? "right girl" : "left boy"
                  }`}
                  style={{
                    verticalAlign: "-webkit-baseline-middle",
                    padding: "5px",
                    height: "35px",
                  }}
                />
              </span>
              <img
                src={ownerIcon["1"].src}
                alt={ownerIcon["1"].alt}
                style={{ height: "35px" }}
              />
            </div>
          </td>
          <td className="text-right">$ {commaNumber(row[6])}</td>
        </tr>
      )
    );
  };

  const selectorOptions = [
    { content: "settlements", value: "settlements" },
    { content: "expenses", value: "expenses" },
  ];

  return (
    <BaseCard
      allowHeader
      title="Settlement Record"
      allowFilter
      filters={[0, 1]}
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

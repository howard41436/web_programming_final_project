import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { useSelector } from "react-redux";
import { selectInfo } from "../redux/infoSlice";
import { selectExpenses } from "../redux/expenseSlice";
import BaseCard from "../components/BaseCard";
import BaseTable from "../components/BaseTable";

export default function DebtDetails() {
  const { categoryInfo, ownerIcon } = useSelector(selectInfo);
  const { debt } = useSelector(selectExpenses);

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

  const shouldBeSettled = (exp) =>
    exp.paid.user0 !== exp.owed.user0 || exp.paid.user1 !== exp.owed.user1;

  const formatDate = (date) => {
    return `${new Date(date).toLocaleString("en", {
      month: "short",
    })}. ${new Date(date).getDate()}`;
  };

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const getCreditor = (exp) => (exp.paid.user0 < exp.owed.user0 ? 0 : 1);
  const getOwed = (exp) => Math.abs(exp.owed.user0 - exp.paid.user0);

  useEffect(() => {
    setData(() => {
      const settledRecord = debt.recordsAndSettlements.filter(
        (deb) => deb.type === "record" && shouldBeSettled(deb.content)
      );

      return settledRecord.map(({ content: exp }) => [
        null,
        exp.date,
        exp.category,
        exp.owner,
        exp.name,
        getCreditor(exp),
        getOwed(exp),
        exp,
      ]);
    });
  }, [debt]);

  const [filterDisplay, setFilterDisplay] = useImmer({
    0: true,
    1: false,
  });

  const renderRow = (row) => {
    const creditor = row[5];
    const exp = row[7];
    return (
      filterDisplay[creditor] && (
        <tr
          // eslint-disable-next-line dot-notation
          key={exp["_id"]}
        >
          <td className="icon-set">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              style={{ cursor: "pointer", outline: "none" }}
              role="button"
              tabIndex={0}
            >
              <i className="far fa-edit" />
            </a>{" "}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
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
            <div className="logo-image-small">
              <img
                src={ownerIcon[String(row[3])].src}
                alt={ownerIcon[String(row[3])].alt}
              />
            </div>
          </td>
          <td style={{ textTransform: "capitalize" }}>{row[4]}</td>
          <td>
            <div className="logo-image-small">
              <img
                src={ownerIcon[String(row[5])].src}
                alt={ownerIcon[String(row[5])].alt}
              />
            </div>
          </td>
          <td className="text-right">$ {commaNumber(row[6])}</td>
        </tr>
      )
    );
  };

  return (
    <BaseCard
      allowHeader
      title="Debt Details"
      allowFilter
      filters={[0, 1]}
      filterDisplay={filterDisplay}
      setFilterDisplay={setFilterDisplay}
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

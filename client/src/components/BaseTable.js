import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { IconSorter } from "./IconTags";

export default function BaseTable(props) {
  const {
    columns = [],
    sortableIndex = [],
    defaultSortedOrder = [],
    data = [],
    renderRow = () => {},
  } = props;

  const [sortedData, setSortedData] = useImmer(data.map((d) => d));
  useEffect(() => {
    setSortedData(() => data.map((d) => d));
  }, [data]);

  const [sortedOrder, setSortedOrder] = useImmer(
    Object.keys(defaultSortedOrder).length === 2
      ? defaultSortedOrder
      : [sortableIndex[0], "asc"]
  );

  const compare = (label, order) => (a, b) => {
    if (a[label] < b[label]) return order === "asc" ? -1 : 1;
    if (a[label] > b[label]) return order === "asc" ? 1 : -1;
    return 0;
  };

  const handleSort = (index) => () => {
    setSortedOrder((ord) => {
      ord[index] = ord[index] === "asc" ? "desc" : "asc";
    });
  };

  useEffect(() => {
    setSortedData((d) =>
      d.sort(compare(columns[sortedOrder[0]], sortedOrder[1]))
    );
    // eslint-disable-next-line dot-notation
  }, [sortedOrder, sortedData[0] ? sortedData[0]["_id"] : null]);

  return (
    <div className="table-responsive">
      <table className="table">
        <thead className="text-primary">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col}
                className={index === columns.length - 1 ? "text-right" : null}
                onClick={
                  sortableIndex.includes(index)
                    ? handleSort(index, sortedOrder[index])
                    : null
                }
                style={{
                  cursor: sortableIndex.includes(index) ? "pointer" : null,
                }}
              >
                {col}
                {sortableIndex.includes(index) && (
                  <>
                    {" "}
                    <IconSorter
                      active={
                        sortedOrder[0] === index && sortedOrder[1] === "desc"
                      }
                      className="fas fa-sort-desc"
                    />
                    <IconSorter
                      active={
                        sortedOrder[0] === index && sortedOrder[1] === "asc"
                      }
                      className="fas fa-sort-asc"
                    />
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{sortedData.map((d) => renderRow(d))}</tbody>
      </table>
    </div>
  );
}

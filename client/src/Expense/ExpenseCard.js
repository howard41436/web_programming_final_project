import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";
import { HorizontalBar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { selectInfo } from "../redux/infoSlice";
import { selectExpenses } from "../redux/expenseSlice";

import BaseCard from "../components/BaseCard";
import BaseChart from "../components/BaseChart";

const TooltipsRow = styled.div`
  align-items: center;
  display: flex;
`;

const ColorBox = styled.span`
  background: ${({ background }) => background};
  border: 1px solid white;
  display: inline-block;
  height: 15px;
  margin: 0 3px;
  width: 15px;
`;

export default function ExpenseCard() {
  const { user, budget } = useSelector(selectUser);
  const { categoryInfo } = useSelector(selectInfo);
  const { expenses } = useSelector(selectExpenses);

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const capitalize = (word) => word.replace(/^./, word[0].toUpperCase());

  const [budgetDisplay, setBudgetDisplay] = useState(
    user === "0" ? budget.user0.total : budget.user1.total
  );

  const [filterDisplay, setFilterDisplay] = useImmer({
    0: user === "0",
    1: user === "1",
  });

  const [selectorDisplay, setSelectorDisplay] = useImmer({
    total: true,
    ...Object.keys(categoryInfo).reduce(
      (obj, cur) => ({ ...obj, [cur]: false }),
      {}
    ),
  });

  const selectorOptions = [
    {
      content: "total",
      value: "total",
    },
    ...Object.entries(categoryInfo).map(([key, v]) => ({
      content: (
        <span className="icon-big text-center icon-warning">
          <i className={v.icon} /> {key}
        </span>
      ),
      value: key,
    })),
  ];

  const [data, setData] = useImmer({
    labels: ["Total Budget", "Total Expenses"],
    datasets: [
      {
        label: capitalize("budget"),
        data: [budgetDisplay, 0],
        backgroundColor: "#e3e3e3",
        borderColor: "transparent",
        borderWidth: 2,
      },
      ...Object.entries(categoryInfo).map(([label, info]) => ({
        label: capitalize(label),
        data: [0, 0],
        backgroundColor: info.color,
        borderColor: "transparent",
        borderWidth: 2,
      })),
    ],
  });

  const [totalExpenses, setTotalExpenses] = useState(0);

  // Init / Filter / Selector
  useEffect(() => {
    setBudgetDisplay((bud) => {
      bud = 0;
      Object.keys({ ...categoryInfo, total: {} }).forEach((cat) => {
        bud +=
          filterDisplay["0"] && selectorDisplay[cat]
            ? budget.user0[cat] || 0
            : 0;
        bud +=
          filterDisplay["1"] && selectorDisplay[cat]
            ? budget.user1[cat] || 0
            : 0;
      });
      return bud;
    });

    setData((d) => {
      d.datasets = d.datasets.map((dd) => ({ ...dd, data: [0, 0] }));

      let total = 0;
      Object.values(expenses).forEach((exp) => {
        const filtered =
          (filterDisplay["0"] ? exp.owed.user0 : 0) +
          (filterDisplay["1"] ? exp.owed.user1 : 0);
        const { index } = categoryInfo[exp.category];

        d.datasets[index].data[1] +=
          selectorDisplay[exp.category] || selectorDisplay.total ? filtered : 0;
        total +=
          selectorDisplay[exp.category] || selectorDisplay.total ? filtered : 0;
      });

      setTotalExpenses(total);
    });
  }, [expenses, filterDisplay, selectorDisplay]);

  const renderData = () => {
    const newDataset = data.datasets
      .map((d, index) => {
        if (budgetDisplay === 0) {
          return {
            ...d,
            data: [d.data[1]],
          };
        }
        if (index === 0) return { ...d, data: [budgetDisplay, 0] };
        return d;
      })
      .filter((d) => d);

    const expensesHidden =
      newDataset.slice(1).reduce((a, b) => {
        return {
          data: [0, a.data[0] + a.data[1] + b.data[0] + b.data[1]],
        };
      }).data[1] === 0;

    const newLabels = [];
    if (budgetDisplay !== 0) newLabels.push("Total Budget");
    if (!expensesHidden) newLabels.push("Total Expenses");

    const newData = {
      ...data,
      labels: newLabels,
      datasets: newDataset,
    };
    return JSON.parse(JSON.stringify(newData));
  };

  // Tooltips
  const [tooltips, setTooltips] = useImmer({
    title: "",
    content: Array.from(
      { length: Object.keys(categoryInfo).length },
      () => null
    ),
  });

  const tooltipsOption = {
    custom: ({ opacity }) => {
      if (opacity === 0)
        setTooltips((tip) => {
          tip.title = "";
        });
    },
    filter: (tips) => {
      setTooltips((tip) => {
        tip.title = tips.yLabel;
      });
      return false;
    },
  };

  const options = {
    legend: false,
    scales: {
      yAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    tooltips: tooltipsOption,
  };

  useEffect(() => {
    setTooltips((tip) => {
      tip.content = data.datasets.map(({ label, data: d, backgroundColor }) => {
        if (tip.title === "") return null;
        if (tip.title === "Total Budget" && label !== "Budget") return null;
        if (tip.title === "Total Expenses" && label === "Budget") return null;
        if (d[0] + d[1] === 0 && label !== "Budget") return null;
        if (budgetDisplay === 0 && label === "Budget") return null;

        return {
          background: backgroundColor,
          label: capitalize(label),
          price: label === "Budget" ? budgetDisplay : d[0] + d[1],
        };
      });
    });
  }, [tooltips.title]);

  const renderTooltips = (
    <>
      <strong style={{ display: "block" }}>{tooltips.title}</strong>
      {tooltips.content.map(
        (tip) =>
          tip !== null && (
            <TooltipsRow key={tip.label}>
              <ColorBox background={tip.background} />
              <span>
                {tip.label}: {commaNumber(tip.price)}
              </span>
              <br />
            </TooltipsRow>
          )
      )}
    </>
  );

  const BudgetInfo = () => (
    <span style={{ fontSize: "smaller" }}>
      {commaNumber(totalExpenses)}
      {!(budgetDisplay === 0) && <> / {commaNumber(budgetDisplay)}</>}
    </span>
  );

  return (
    <BaseCard
      allowHeader
      title={budgetDisplay === 0 ? "All Expenses" : "All Budget Used"}
      otherHeader={<BudgetInfo />}
      allowFilter
      filters={[0, 1]}
      filterDisplay={filterDisplay}
      setFilterDisplay={setFilterDisplay}
      allowSelector
      selectorName="budget_selector"
      selectorOptions={selectorOptions}
      selectorDisplay={selectorDisplay}
      setSelectorDisplay={setSelectorDisplay}
    >
      <BaseChart
        Chart={HorizontalBar}
        data={renderData()}
        options={options}
        allowTooltips
        showTooltips={tooltips.title !== ""}
        renderTooltips={renderTooltips}
      />
    </BaseCard>
  );
}

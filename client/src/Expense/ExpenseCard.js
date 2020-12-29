import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";
import { HorizontalBar } from "react-chartjs-2";
import { useSelector } from "react-redux";
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
  const { categoryInfo } = useSelector(selectInfo);
  const { expenses } = useSelector(selectExpenses);

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const capitalize = (word) => word.replace(/^./, word[0].toUpperCase());
  const deCapitalize = (word) => word.replace(/^./, word[0].toLowerCase());

  // Temporary fake data
  const [budget, setBudget] = useImmer({
    food: {
      user0: 350,
      user1: 250,
      total: 600,
    },
    transportation: {
      user0: 250,
      user1: 300,
      total: 550,
    },
    education: {
      user0: 150,
      user1: 150,
      total: 300,
    },
    others: {
      user0: 300,
      user1: 250,
      total: 550,
    },
    all: {
      user0: 1050,
      user1: 950,
      total: 2000,
    },
  });

  const [filterDisplay, setFilterDisplay] = useImmer({
    0: true, // Boy
    1: false, // Girl
  });

  const [legendDisplay, setLegendDisplay] = useImmer(
    Object.keys(categoryInfo).reduce(
      (obj, cur) => ({ ...obj, [cur]: true }),
      {}
    )
  );

  const [data, setData] = useImmer({
    labels: ["Total Budget", "Total Expenses"],
    datasets: [
      {
        label: capitalize("budget"),
        data: [budget.all.total, 0],
        backgroundColor: "#e3e3e3",
        borderColor: "transparent",
        borderWidth: 2,
        hidden: budget.all.total === 0,
      },
      ...Object.entries(categoryInfo).map(([label, info]) => ({
        label: capitalize(label),
        data: [0, 0],
        backgroundColor: info.color,
        borderColor: "transparent",
        borderWidth: 2,
        hidden: false,
      })),
    ],
  });

  const [totalExpenses, setTotalExpenses] = useState(0);

  const renderData = () => {
    const newDataset = data.datasets
      .map((d, index, all) => {
        // if (index === 0 && budget.all.total === 0) return null;
        // if (index !== 0 && d.data[0] + d.data[1] === 0) return null;

        if (all[0].hidden || budget.all.total === 0) {
          return {
            ...d,
            data: [d.data[1]],
          };
        }
        if (index === 0) return { ...d, data: [budget.all.total, 0] };
        return d;
      })
      .filter((d) => d);

    const expensesHidden =
      newDataset.length > 1
        ? newDataset.slice(1).reduce((a, b) => {
            return { hidden: a.hidden && b.hidden };
          }).hidden
        : true;

    const newLabels = [];
    if (!data.datasets[0].hidden && !expensesHidden)
      newLabels.push("Total Budget");
    if (!expensesHidden) newLabels.push("Total Expenses");

    const newData = {
      ...data,
      labels: newLabels,
      datasets: newDataset,
    };
    return JSON.parse(JSON.stringify(newData));
  };

  // Init / Filter / Selector
  useEffect(() => {
    setBudget((bud) => {
      bud.all.user0 = 0;
      bud.all.user1 = 0;

      Object.keys(categoryInfo).forEach((info) => {
        bud[info].total = filterDisplay["0"] ? bud[info].user0 : 0;
        bud[info].total += filterDisplay["1"] ? bud[info].user1 : 0;

        bud.all.user0 += legendDisplay[info] && bud[info].user0;
        bud.all.user1 += legendDisplay[info] && bud[info].user1;
      });

      bud.all.total = filterDisplay["0"] ? bud.all.user0 : 0;
      bud.all.total += filterDisplay["1"] ? bud.all.user1 : 0;
    });

    setData((d) => {
      d.datasets = d.datasets.map((dd) => ({ ...dd, data: [0, 0] }));

      let total = 0;
      Object.values(expenses).forEach((exp) => {
        const filtered =
          (filterDisplay["0"] ? exp.owed.user0 : 0) +
          (filterDisplay["1"] ? exp.owed.user1 : 0);
        const { index } = categoryInfo[exp.category];

        d.datasets[index].data[1] += filtered;
        total += legendDisplay[exp.category] && filtered;
      });

      setTotalExpenses(total);
    });
  }, [expenses, filterDisplay, legendDisplay]);

  // Legends
  const legendOption = {
    onClick: (_, item) => {
      setLegendDisplay((dis) => {
        dis[deCapitalize(item.text)] = item.hidden;
      });
      setData((d) => {
        d.datasets[item.datasetIndex].hidden = !item.hidden;
      });
    },
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
    legend: legendOption,
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
      tip.content = data.datasets.map(
        ({ label, data: d, backgroundColor, hidden }) => {
          if (tip.title === "") return null;
          if (hidden) return null;
          if (tip.title === "Total Budget" && label !== "Budget") return null;
          if (tip.title === "Total Expenses" && label === "Budget") return null;
          if (d[0] + d[1] === 0 && label !== "Budget") return null;
          if (budget.all.total === 0 && label === "Budget") return null;

          return {
            background: backgroundColor,
            label: capitalize(label),
            price: label === "Budget" ? budget.all.total : d[0] + d[1],
          };
        }
      );
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
      {!data.datasets[0].hidden && <> / {commaNumber(budget.all.total)}</>}
    </span>
  );

  return (
    <BaseCard
      cardClasses=""
      allowHeader
      title={data.datasets[0].hidden ? "All Expenses" : "All Budget Used"}
      otherHeader={<BudgetInfo />}
      allowFilter
      filters={[0, 1]}
      filterDisplay={filterDisplay}
      setFilterDisplay={setFilterDisplay}
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

import React, { useEffect } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";
import { HorizontalBar } from "react-chartjs-2";
import ReactTooltip from "react-tooltip";

const IconFilter = styled.a`
  opacity: ${({ selected }) => (selected ? "1" : "0.4")};
`;

const TooltipRow = styled.div`
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

export default function ExpenseCard(props) {
  const { categoryInfo, display, setDisplay } = props;
  const handleSetDisplay = (owner) => () => {
    setDisplay((dis) => {
      dis[owner] = !dis[owner];
    });
  };

  const [total, setTotal] = useImmer(0);
  const [data, setData] = useImmer({
    labels: ["Total Budget", "Total Expenses"],
    datasets: [],
  });
  const [tooltip, setTooltip] = useImmer({
    title: "",
    content: Array.from(
      { length: Object.keys(categoryInfo).length },
      () => null
    ),
  });

  const backgroundColors = [
    "#e3e3e3",
    "#fbc658",
    "#6bd098",
    "#51bcda",
    "#a3a3a3",
  ];

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const capitalize = (word) => word.replace(/^./, word[0].toUpperCase());

  useEffect(() => {
    setTotal((t) => {
      t = 0;
      setData((d) => {
        d.datasets = [];
        Object.entries(categoryInfo).forEach(([label, value], index) => {
          d.datasets.push({
            label: capitalize(label),
            data: [
              label === "budget" ? value.price : 0,
              label === "budget" ? 0 : value.price,
            ],
            backgroundColor: backgroundColors[index],
            borderColor: "transparent",
            borderWidth: 2,
            hidden: false,
          });

          t += label === "budget" ? 0 : value.price;
        });
      });
      return t;
    });
  }, [categoryInfo]);

  const options = {
    legend: {
      onClick: (_, item) => {
        setData((d) => {
          d.datasets[item.datasetIndex].hidden = !item.hidden;
        });
      },
    },
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
        },
      ],
    },
    tooltips: {
      custom: ({ opacity }) => {
        if (opacity === 0)
          setTooltip((tip) => {
            tip.title = "";
          });
      },
      filter: (tips) => {
        setTooltip((tip) => {
          tip.title = tips.yLabel;
        });
        return false;
      },
    },
  };

  useEffect(() => {
    setTooltip((tip) => {
      tip.content = Object.entries(categoryInfo).map(
        ([label, value], index) => {
          if (tip.title === "") return null;
          if (tip.title === "Total Budget" && label !== "budget") return null;
          if (tip.title === "Total Expenses" && label === "budget") return null;
          if (value.price === 0) return null;

          return {
            background: backgroundColors[index],
            label: capitalize(label),
            price: value.price,
          };
        }
      );
    });
  }, [tooltip.title]);

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">
            All Budget Used{" "}
            <span style={{ fontSize: "smaller" }}>
              {commaNumber(total)} / {commaNumber(categoryInfo.budget.price)}
            </span>
            <span className="menu">
              <span className="logo-list">
                <IconFilter
                  onClick={handleSetDisplay("0")}
                  selected={display["0"]}
                >
                  <img src="/img/boy.png" alt="boy" />
                </IconFilter>{" "}
                <IconFilter
                  onClick={handleSetDisplay("1")}
                  selected={display["1"]}
                >
                  <img src="/img/girl.png" alt="girl" />
                </IconFilter>
              </span>
            </span>
          </h4>
        </div>
        <div className="card-body" data-tip>
          {data.datasets.length > 0 && (
            <HorizontalBar
              data={JSON.parse(JSON.stringify(data))}
              height={50}
              options={options}
              width={400}
            />
          )}
        </div>
        <div style={{ display: tooltip.title === "" ? "none" : "block" }}>
          <ReactTooltip>
            <strong style={{ display: "block" }}>{tooltip.title}</strong>
            {tooltip.content.map(
              (tip, index) =>
                tip !== null &&
                !data.datasets[index].hidden && (
                  <TooltipRow key={tip.label}>
                    <ColorBox background={tip.background} />
                    <span>
                      {tip.label}: {commaNumber(tip.price)}
                    </span>
                    <br />
                  </TooltipRow>
                )
            )}
          </ReactTooltip>
        </div>
      </div>
    </div>
  );
}

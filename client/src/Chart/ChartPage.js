import React, { useEffect } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import BasePage from "../components/BasePage";
import BaseCard from "../components/BaseCard";
import BaseChart from "../components/BaseChart";
import { Col, Row } from "../components/BaseTags";
import { INSTANCE } from "../constants";
import { errorToast } from "../components/BaseToast";

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

export default function ChartPage() {
  const {
    pairId,
    user0: { name, icon },
    user1: { name: name1, icon: icon1 },
  } = useSelector(selectUser);

  const commaNumber = (num) =>
    String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  useEffect(() => {
    document.title = "Charts | Together";
  }, []);

  const otherHeader = (
    <p className="card-category" style={{ fontSize: "14px", margin: "5px 0" }}>
      In the past year
    </p>
  );

  const iconChoice = ["boy", "boy2", "girl", "girl2", "both"];

  const iconColor = {
    boy: "#5A586B",
    boy2: "#B67F6D",
    girl: "#ED7B8F",
    girl2: "#DFB374",
    both: "#FCC468",
  };

  const months = Array.from({ length: 12 }, (_, key) => {
    const nowMonth = new Date().getMonth();
    const nowYear = new Date().getFullYear();
    const month = new Date(null, (key + nowMonth + 1) % 12).toLocaleString(
      "en",
      {
        month: "short",
      }
    );
    return `${
      nowYear - ((key + nowMonth + 1) % 12 > nowMonth ? 1 : 0)
    } ${month}${month !== "May" ? "." : ""}`;
  });

  const monthIndex = months.reduce(
    (obj, cur, index) => ({ ...obj, [cur]: index }),
    {}
  );

  const [data, setData] = useImmer({
    labels: months,
    datasets: [
      {
        label: name,
        borderColor: "transparent",
        backgroundColor: iconColor[iconChoice[icon]],
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 3,
        data: [],
        hidden: false,
      },
      {
        label: name1,
        borderColor: "transparent",
        backgroundColor: iconColor[iconChoice[icon1]],
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 3,
        data: [],
        hidden: false,
      },
      {
        label: "Both",
        borderColor: "transparent",
        backgroundColor: iconColor[iconChoice[4]],
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 3,
        data: [],
        hidden: false,
      },
    ],
  });

  const sumExpense = (exp, owner) => {
    return exp
      .filter((e) => e.owner === owner)
      .reduce(
        (sum, cur) =>
          sum +
          (owner !== 1 ? cur.owed.user0 : 0) +
          (owner !== 0 ? cur.owed.user1 : 0),
        0
      );
  };

  useEffect(() => {
    const nowMonth = new Date().getMonth();
    Array.from({ length: 12 }, (_, key) => {
      INSTANCE.get("/api/monthlyRecords", {
        params: {
          pairId,
          year:
            new Date().getFullYear() -
            ((key + nowMonth + 1) % 12 > nowMonth ? 1 : 0),
          month: (key + nowMonth + 1) % 12,
        },
      })
        .then((res) => {
          setData((d) => {
            d.datasets[0].data.push(sumExpense(res.data, 0));
            d.datasets[1].data.push(sumExpense(res.data, 1));
            d.datasets[2].data.push(sumExpense(res.data, -1));
          });
        })
        .catch((err) => errorToast(err, "Loading"));
      return true;
    });
  }, []);

  const [legendDisplay, setLegendDisplay] = useImmer([true, true, true]);

  const tooltipContent = [
    { background: iconColor[iconChoice[icon]], label: name },
    { background: iconColor[iconChoice[icon1]], label: name1 },
    { background: iconColor[iconChoice[4]], label: "Both" },
  ];

  // Tooltips
  const [tooltips, setTooltips] = useImmer({
    title: "",
    content: tooltipContent,
  });

  useEffect(() => {
    setTooltips((tip) => {
      const d = data.datasets;
      tip.content = [];
      for (let i = 0; i < 3; i += 1) {
        if (legendDisplay[i])
          tip.content.push({
            ...tooltipContent[i],
            price: d[i].data[monthIndex[tip.title]],
          });
      }
    });
  }, [tooltips.title, legendDisplay]);

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

  const options = {
    legend: {
      onClick: (_, item) => {
        setLegendDisplay((dis) => {
          dis[item.datasetIndex] = !dis[item.datasetIndex];
        });
        setData((d) => {
          d.datasets[item.datasetIndex].hidden = !d.datasets[item.datasetIndex]
            .hidden;
        });
      },
    },

    tooltips: {
      mode: "x-axis",
      custom: ({ opacity }) => {
        if (opacity === 0)
          setTooltips((tip) => {
            tip.title = "";
          });
      },
      filter: (tips) => {
        setTooltips((tip) => {
          tip.title = tips.xLabel;
        });
        return false;
      },
    },

    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "#9f9f9f",
            beginAtZero: false,
            min: 0,
            maxTicksLimit: 5,
          },
          gridLines: {
            drawBorder: false,
            zeroLineColor: "#ccc",
            color: "rgba(255,255,255,0.05)",
          },
        },
      ],

      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(255,255,255,0.1)",
            zeroLineColor: "transparent",
            display: false,
          },
          ticks: {
            padding: 20,
            fontColor: "#9f9f9f",
          },
        },
      ],
    },
  };

  return (
    <BasePage title="Chart">
      <Row>
        <Col>
          <BaseCard
            allowHeader
            title="History Expenses"
            otherHeader={otherHeader}
          >
            <BaseChart
              Chart={Line}
              height={100}
              data={JSON.parse(JSON.stringify(data))}
              options={options}
              allowTooltips
              showTooltips={tooltips.title !== ""}
              renderTooltips={renderTooltips}
            />
          </BaseCard>
        </Col>
      </Row>
    </BasePage>
  );
}

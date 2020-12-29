import React from "react";
import ReactTooltip from "react-tooltip";

export default function BaseChart(props) {
  const {
    Chart = () => <></>,
    height = 50,
    width = 400,
    data = { datasets: [] },
    options = {},
    allowTooltips = false,
    showTooltips = false,
    renderTooltips = <></>,
  } = props;

  return (
    <>
      <div data-tip>
        {data.datasets.length > 0 && (
          <Chart data={data} height={height} options={options} width={width} />
        )}
      </div>
      {allowTooltips && (
        <div style={{ display: showTooltips ? "block" : "none" }}>
          <ReactTooltip>{renderTooltips}</ReactTooltip>
        </div>
      )}
    </>
  );
}

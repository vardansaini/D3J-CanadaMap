import "./App.css";
import css from "App.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

import * as d3 from "d3";
import { toast, ToastContainer } from "react-toastify";

// Geo json files
// import countyData from "./data/counties.json";
import stateData from "./data/states.json";

const mapRatio = 0.5;

const margin = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
};

const colorScale = ["#FF0000", "#FFA500", "#EED799", "#008000", "#D3D3D3"];

function App() {
  // A random color generator
  const [width, setWidth] = React.useState(
    window.innerWidth - margin.left - margin.right
  );
  const onResize = React.useCallback(() => {
    setWidth(window.innerWidth);
  }, []);
  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  const height = width * mapRatio - margin.top - margin.bottom;
  const projection = React.useMemo(() => {
    // Creating projection, it's best to use 'geoAlbersUsa' projection
    // if you're rendering USA map and for other maps use 'geoMercator'.
    return d3.geoMercator().fitSize([width / 1.1, height / 1.1], stateData);
  }, [width, height]);

  const pathGenerator = React.useMemo(() => {
    // Creating path generator from the projection created above.
    return d3.geoPath().projection(projection);
  }, [projection]);

  function handleZoom(event, feature) {
    toast.info(
      `Selected Province is ${feature.properties.name} and the status is 
      ${feature.properties.status}`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  }

  function colorGenerator(feature) {
    if (
      feature.properties.name === "British Columbia" ||
      feature.properties.name === "Saskatchewan" ||
      feature.properties.name === "Manitoba" ||
      feature.properties.name === "Ontario"
    ) {
      return colorScale[0];
    }
    if (
      feature.properties.name === "Quebec" ||
      feature.properties.name === "Alberta" ||
      feature.properties.name === "Yukon"
    ) {
      return colorScale[1];
    }
    if (feature.properties.name === "Northwest Territories") {
      return colorScale[2];
    }
    if (
      feature.properties.name === "Newfoundland and Labrador" ||
      feature.properties.name === "New Brunswick" ||
      feature.properties.name === "Nova Scotia" ||
      feature.properties.name === "Prince Edward Island"
    ) {
      return colorScale[3];
    }
    if (feature.properties.name === "Nunavut") {
      return colorScale[4];
    }
  }

  return (
    <div>
      <div className="viz">
        <svg className="center-container" height={height} width={width}>
          <rect
            className="background center-container"
            height={height}
            width={width}
          ></rect>
          <g
            className="center-container center-items canada"
            transform={`translate(${margin.left},${margin.top})`}
            height={height}
            width={width}
          >
            <g id="states">
              {stateData.features.map((feature) => {
                return (
                  <path
                    key={feature.properties.name}
                    d={pathGenerator(feature)}
                    className="state"
                    fill={colorGenerator(feature)}
                    onClick={(e) => handleZoom(e, feature)}
                  ></path>
                );
              })}
            </g>
            <g id="labels">
              {stateData.features.map((feature) => {
                // console.log(feature.geometry.coordinates);
                var xc = 0;
                var yc = 0;
                for (let i = 0; i < feature.geometry.coordinates.length; i++) {
                  xc += feature.geometry.coordinates[i][0];
                  yc += feature.geometry.coordinates[i][1];
                }
                console.log(xc, yc);
                console.log(
                  "this is len: ",
                  feature.geometry.coordinates.length
                );
                xc = xc / feature.geometry.coordinates.length;
                yc = yc / feature.geometry.coordinates.length;
                console.log(xc, yc);
                const coords = [xc, yc];
                const [x, y] = projection(coords);
                return (
                  <text x={x} y={y}>
                    {feature.properties.name === "British Columbia"
                      ? "BC"
                      : feature.properties.name === "Newfoundland and Labrador"
                      ? "NL"
                      : feature.properties.name === "Northwest Territories"
                      ? "NT"
                      : feature.properties.name === "Prince Edward Island"
                      ? "PE"
                      : feature.properties.name === "Nova Scotia"
                      ? "NS"
                      : feature.properties.name === "New Brunswick"
                      ? "NB"
                      : feature.properties.name === "Quebec"
                      ? "QC"
                      : feature.properties.name === "Ontario"
                      ? "ON"
                      : feature.properties.name === "Manitoba"
                      ? "MB"
                      : feature.properties.name === "Saskatchewan"
                      ? "SK"
                      : feature.properties.name === "Alberta"
                      ? "AB"
                      : feature.properties.name === "Yukon"
                      ? "YT"
                      : feature.properties.name === "Nunavut"
                      ? "NU"
                      : null}
                  </text>
                );
              })}
            </g>
          </g>
        </svg>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;

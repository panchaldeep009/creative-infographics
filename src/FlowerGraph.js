import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import randomColor from "randomcolor";

const FlowerGraph = perms => {
  // hover state for dataGroup
  const [hoverDataI, setHoverDataI] = useState(-1);

  // Main Data
  const [mainData, setMainData] = useState(perms.data);

  //Check hover state on DataGroup
  const checkHover = index => {
    return hoverDataI !== -1 && index !== hoverDataI;
  };

  // colors for dataGroup
  const [dataGroupColors, setDataGroupColors] = useState([]);

  useEffect(() => {
    // Generate Random colors for dataGroup
    setDataGroupColors(
      randomColor({
        luminosity: perms.luminosity,
        count: dataGroup.length,
        ...(perms.tint ? { hue: perms.tint } : {})
      })
    );
  }, [perms.luminosity, perms.tint]);

  useEffect(() => {
    if (perms.shuffleData) {
      setMainData(_.shuffle(perms.data));
    }
  }, [perms.shuffleData]);

  // Get Sorting Group
  var dataGroup = _.orderBy(
    _.map(
      _.countBy(_.flatten(mainData.map(d => d[perms.term]))),
      (value, key) => ({ Name: key, count: value })
    ),
    ["count"],
    ["desc"]
  );

  // Map Colors with data groups
  dataGroup = _.map(dataGroup, (d, i) => ({ ...d, color: dataGroupColors[i] }));

  // to find maximum occurrence of term in data
  const maxCount = Math.max(...dataGroup.map(g => g.count));

  // averageRadius : to find radius of genre circle from it's count
  const averageRadius = (c, max, p) =>
    Math.round((p * c) / max < 2 ? 2 : (p * c) / max);

  // Count total radius of avg radius of each
  const allRadiusSum = _.sum(
    dataGroup.map(({ count }) => averageRadius(count, maxCount, 20))
  );

  //count previous genres radius to left space on left
  const sumTillIndex = index =>
    _.sum(
      _.map(dataGroup.slice(0, index + 1), g =>
        averageRadius(g.count, maxCount, 20)
      )
    );

  // :::::::::::::::
  /// Element Renders Functions
  // :::::::::::::::

  // Data Group Print
  const renderGroupList = () => {
    return dataGroup.map((data, index) => (
      <g key={"__" + index}>
        <text
          x={100 + 15 * index}
          y={150}
          transform={`rotate(-45 ${15 * index} ${45})`}
          fill={perms.luminosity == "bright" ? "#e5e5e5" : "#333333"}
          fontSize={perms.fontSize}
          opacity={checkHover(index) ? perms.fadingOpacity : 1}
          onMouseMove={() => setHoverDataI(index)}
          onMouseLeave={() => setHoverDataI(-1)}
        >
          {("0" + data.count).slice(-2) + "  :  " + data.Name}
        </text>
        <circle
          cx={20 + 15 * index + 120}
          cy={55}
          fill={data.color}
          r={5}
          opacity={checkHover(index) ? perms.fadingOpacity : 1}
          onMouseMove={() => setHoverDataI(index)}
          onMouseLeave={() => setHoverDataI(-1)}
        />
      </g>
    ));
  };

  // Data Group flower root Print
  const renderGroupListRoots = () => {
    return dataGroup.map((data, index) => (
      <circle
        key={"___" + index}
        cx={perms.flowerX - allRadiusSum + sumTillIndex(index) * 1.8}
        cy={perms.flowerY}
        fill={data.color}
        r={averageRadius(data.count, maxCount, 20)}
        opacity={checkHover(index) ? perms.fadingOpacity : 1}
        onMouseMove={() => setHoverDataI(index)}
        onMouseLeave={() => setHoverDataI(-1)}
      />
    ));
  };
  // Render connection
  const renderConnection = (
    dataChunk,
    degree,
    offDegree,
    radius,
    cirX,
    cirY
  ) => {
    return dataChunk.map((data, dataI, allData) =>
      data[perms.term].map((dataG, dataGI) =>
        dataGroup.map((g, gI) => {
          // find this group match with group list
          if (dataG == g.Name) {
            // find this group circle radius
            const gRadius = averageRadius(g.count, maxCount, 20);
            // find random position for connecting line within this genres radius
            const randomToleranceX =
              Math.floor(Math.random() * gRadius) - gRadius / 2;
            const randomToleranceY =
              Math.floor(Math.random() * gRadius) - gRadius / 2;
            return (
              <g key={"_" + dataI + "_" + dataGI + "_" + gI}>
                <path
                  d={`M ${perms.flowerX -
                    allRadiusSum +
                    randomToleranceX +
                    sumTillIndex(gI) * 1.8},${perms.flowerY + randomToleranceY}
                                        C ${cirX},${cirY},
                                            ${Math.cos(
                                              (((degree / allData.length) *
                                                dataI +
                                                offDegree) *
                                                Math.PI) /
                                                180.0
                                            ) *
                                              (radius - 20) +
                                              cirX},
                                            ${Math.sin(
                                              (((degree / allData.length) *
                                                dataI +
                                                offDegree) *
                                                Math.PI) /
                                                180.0
                                            ) *
                                              (radius - 20) +
                                              cirY},
                                            ${Math.cos(
                                              (((degree / allData.length) *
                                                dataI +
                                                offDegree) *
                                                Math.PI) /
                                                180.0
                                            ) *
                                              (radius - 5 * dataGI) +
                                              cirX},
                                            ${Math.sin(
                                              (((degree / allData.length) *
                                                dataI +
                                                offDegree) *
                                                Math.PI) /
                                                180.0
                                            ) *
                                              (radius - 5 * dataGI) +
                                              cirY},`}
                  stroke={g.color}
                  fill="transparent"
                  strokeWidth={0.5}
                  opacity={checkHover(gI) ? perms.fadingOpacity : 1}
                />
                <circle
                  fill={g.color}
                  r={2}
                  cx={
                    Math.cos(
                      (((degree / allData.length) * dataI + offDegree) *
                        Math.PI) /
                        180.0
                    ) *
                      (radius - 5 * dataGI) +
                    cirX
                  }
                  cy={
                    Math.sin(
                      (((degree / allData.length) * dataI + offDegree) *
                        Math.PI) /
                        180.0
                    ) *
                      (radius - 5 * dataGI) +
                    cirY
                  }
                  opacity={checkHover(gI) ? perms.fadingOpacity : 1}
                  onMouseMove={() => setHoverDataI(gI)}
                  onMouseLeave={() => setHoverDataI(-1)}
                />
              </g>
            );
          }
        })
      )
    );
  };
  // Labels and Indicator
  const renderDataLabels = () => {
    // split data based on number of leafs
    const splitData = _.chunk(
      mainData,
      Math.ceil(mainData.length / perms.leafs)
    );

    return splitData.map((chunkData, i) => {
      // finding position of a leaf circle based radius of flower and total number of leafs
      const cirX =
        Math.cos(
          (((perms.flowerDeg / perms.leafs) * i + perms.flowerOffDeg) *
            Math.PI) /
            180.0
        ) *
          perms.flowerR +
        perms.flowerX;

      const cirY =
        Math.sin(
          (((perms.flowerDeg / perms.leafs) * i + perms.flowerOffDeg) *
            Math.PI) /
            180.0
        ) *
          perms.flowerR +
        perms.flowerY;
      const degree = perms.leafsDeg;
      const offDegree =
        perms.flowerOffDeg +
        (perms.leafsDeg - 45) +
        (perms.flowerDeg / perms.leafs) * i +
        5;
      // each data of chunk of data

      return (
        <g key={"_" + i}>
          {// Renders Connection
          renderConnection(
            chunkData,
            degree,
            offDegree,
            perms.leafsR,
            cirX,
            cirY
          )}
          {chunkData.map((data, eachDataI, allData) => (
            <g key={i + "_" + eachDataI}>
              {/* Data Labels */}

              <text
                x={cirX + perms.leafsR + 8}
                y={cirY + 2}
                fill={perms.luminosity == "bright" ? "#e5e5e5" : "#333333"}
                fontSize={perms.fontSize}
                transform={`rotate(${(degree / allData.length) * eachDataI +
                  offDegree} ${cirX} ${cirY})`}
                opacity={
                  hoverDataI == -1 ||
                  data[perms.term].includes(dataGroup[hoverDataI].Name)
                    ? 1
                    : perms.fadingOpacity
                }
              >
                {data[perms.label].length > 18
                  ? data[perms.label].substr(0, 15) + " .."
                  : data[perms.label]}
              </text>

              {/* Data Labels indicator Line */}

              <line
                x1={
                  Math.cos(
                    (((degree / allData.length) * eachDataI + offDegree) *
                      Math.PI) /
                      180.0
                  ) *
                    (perms.leafsR + 3) +
                  cirX
                }
                y1={
                  Math.sin(
                    (((degree / allData.length) * eachDataI + offDegree) *
                      Math.PI) /
                      180.0
                  ) *
                    (perms.leafsR + 3) +
                  cirY
                }
                x2={
                  Math.cos(
                    (((degree / allData.length) * eachDataI + offDegree) *
                      Math.PI) /
                      180.0
                  ) *
                    (perms.leafsR + 8) +
                  cirX
                }
                y2={
                  Math.sin(
                    (((degree / allData.length) * eachDataI + offDegree) *
                      Math.PI) /
                      180.0
                  ) *
                    (perms.leafsR + 8) +
                  cirY
                }
                stroke="red"
                strokeWidth={0.5}
                opacity={
                  hoverDataI == -1 ||
                  data[perms.term].includes(dataGroup[hoverDataI].Name)
                    ? 1
                    : perms.fadingOpacity
                }
              />
            </g>
          ))}
        </g>
      );
    });
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={"100%"}
      height={"100%"}
      style={{ position: "relative" }}
      viewBox={`0 0 ${600} ${700}`}
    >
      {renderGroupList()}
      <g transform={`rotate(${perms.flowerRotation}, 300, 400)`}>
        {renderDataLabels()}
        {renderGroupListRoots()}
      </g>
    </svg>
  );
};

FlowerGraph.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired),
  term: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fontSize: PropTypes.number.isRequired,
  fadingOpacity: PropTypes.number.isRequired,
  flowerX: PropTypes.number.isRequired,
  flowerY: PropTypes.number.isRequired,
  flowerR: PropTypes.number.isRequired,
  flowerRotation: PropTypes.number.isRequired,
  flowerDeg: PropTypes.number.isRequired,
  flowerOffDeg: PropTypes.number.isRequired,
  leafs: PropTypes.number.isRequired,
  leafsR: PropTypes.number.isRequired,
  leafsDeg: PropTypes.number.isRequired,
  luminosity: PropTypes.oneOf([`bright`, `dark`]),
  tint: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  shuffleData: PropTypes.bool
};

FlowerGraph.defaultProps = {
  width: 600,
  height: 700,
  fontSize: 6,
  fadingOpacity: 0.02,
  flowerX: 300,
  flowerY: 400,
  flowerR: 195,
  flowerRotation: 0,
  flowerDeg: 360,
  flowerOffDeg: 50,
  leafs: 5,
  leafsR: 55,
  leafsDeg: 270,
  luminosity: "bright",
  tint: false,
  shuffleData: true
};

export default FlowerGraph;

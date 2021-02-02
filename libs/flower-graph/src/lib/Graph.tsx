import React, { useMemo, useState } from 'react';
import randomColors from 'randomcolor';
import { ColorOptions, Position } from './types';
import { Legend, LegendOptions } from './Legend';
import { Roots, RootsOptions } from './Roots';
import { Petals, PetalsOptions } from './Petals';

export interface GraphProps<Data extends Record<string | number, unknown>> extends ColorOptions {
  data: Data[],
  labelAccessor: ((data: Data) => string),
  typeAccessor: ((data: Data) => string[]),
  width?: number,
  height?: number,
  legendOptions?: LegendOptions,
  rootsOptions?: RootsOptions,
  petalsOptions?: PetalsOptions,
  fontSize?: number,
  offFocuseOpacity?: number,
  graphRotation?: number,
  graphPosition?: Partial<Position>,
  flowerInnerRadius?: number;
}

type GraphComponent = <
  D extends Record<string | number, unknown>,
>(props: GraphProps<D>) => ReturnType<React.FC>;


export const Graph: GraphComponent = ({
  data,
  typeAccessor,
  labelAccessor,
  hue,
  legendOptions,
  petalsOptions,
  rootsOptions,
  graphPosition: graphPositionProp,
  width = 600,
  height = 700,
  luminosity = 'bright',
  fontSize = 6,
  offFocuseOpacity = 0.4,
  graphRotation = 45,
  flowerInnerRadius = 195,
}) => {
  const [hoveredType, setHoveredType] = useState<string>(undefined);
  const graphPosition = useMemo(() => ({
    x: graphPositionProp.x || width / 2,
    y: graphPositionProp.y || ((height - 100) / 2) + 100
  }), [graphPositionProp, height, width])

  const types = useMemo(() => 
    data
      .reduce((acc, current) => ([...acc, ...(typeAccessor(current))]), [])
      .filter((type, index, allData) => allData.indexOf(type) === index)
  , [data, typeAccessor]);

  const typesColors = useMemo(() => randomColors({ 
    count: types.length,
    luminosity,
    hue,
   }), [hue, luminosity, types.length]);

  const legendData = useMemo(() => 
    types
      .map((type, index) => ({ 
        type,
        color: typesColors[index], 
        count: data.filter(d => typeAccessor(d).includes(type)).length
      }))
      .sort((a, b) => b.count - a.count)
  , [typesColors, types, data, typeAccessor]);

  const mappedData = useMemo(() => data.map((data) => ({
    label: labelAccessor(data),
    types: legendData.filter(({ type }) => (typeAccessor(data) || []).includes(type))
  })), [data, typeAccessor, labelAccessor, legendData]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      style={{ position: "relative", fontFamily: 'sans-serif' }}
      viewBox={`0 0 ${600} ${700}`}
    >
      <Legend
        types={legendData}
        fontSize={fontSize}
        luminosity={luminosity}
        legendOptions={legendOptions}
        hoveredLegend={hoveredType}
        offFocuseOpacity={offFocuseOpacity}
        onLegendHover={setHoveredType}
        onLegendBlur={() => setHoveredType(undefined)}
      />
      <g
        name="Graph"
        transform={`
          rotate(
            ${graphRotation},
            ${graphPosition.x},
            ${graphPosition.y}
          )
        `}
      >
        <Petals 
          flowerInnerRadius={flowerInnerRadius}
          position={graphPosition}
          options={petalsOptions}
        />
        <Roots 
          types={legendData}
          offFocuseOpacity={offFocuseOpacity}
          options={rootsOptions}
          position={graphPosition}
          hoveredRoot={hoveredType}
          onRootHover={setHoveredType}
          onRootBlur={() => setHoveredType(undefined)}
        />
      </g>
    </svg>
  );
}

export default Graph;

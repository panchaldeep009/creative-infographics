import React, { useMemo, useState } from 'react';
import randomColors from 'randomcolor';
import { ColorOptions } from './types';
import { Legend, LegendOptions } from './Legend';

export interface GraphProps<Data extends Record<string | number, unknown>> extends ColorOptions {
  data: Data[],
  labelAccessor: ((data: Data) => string),
  typeAccessor: ((data: Data) => string[]),
  legendOptions?: LegendOptions
  fontSize?: number,
  offFocuseOpacity?: number,
}

type GraphComponent = <
  D extends Record<string | number, unknown>,
>(props: GraphProps<D>) => ReturnType<React.FC>;


export const Graph: GraphComponent = ({
  data,
  typeAccessor,
  labelAccessor,
  luminosity = 'bright',
  hue,
  fontSize = 6,
  legendOptions,
  offFocuseOpacity = 0.4
}) => {
  const [hoveredType, setHoveredType] = useState<string>(undefined)

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
    </svg>
  );
}

export default Graph;

import React, { useCallback, useMemo, useRef, useState } from 'react';
import randomColors from 'randomcolor';
import { GraphBasicProps, HoverEvent, Petal, Root } from './types';
import { Legend } from './Legend';
import { Roots } from './Roots';
import { Connections } from './Connections';
import { CirclesRef, LinesRef, Petals, TextsRef } from './Petals';
import { chunkArray } from './utilities';
import { usePetalsPositions } from './usePetalsPositions';
export interface GraphProps<D extends Record<string | number, unknown>> extends GraphBasicProps {
  data: D[],
  labelAccessor: ((data: D) => string),
  typeAccessor: ((data: D) => string[]),
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
  innerCircle,
  width = 600,
  height = 700,
  luminosity = 'bright',
  fontSize = 6,
  offFocuseOpacity = 0.4,
  graphRotation = 45,
  onHoverTypes,
  onHoverLabel
}) => {
  const [hoveredlabel, setHoveredLabel] = useState<string>(undefined);
  const [hoveredTypes, setHoveredTypes] = useState<string[]>([]);
  const connectionsRef = useRef<Record<string,SVGPathElement>>({});
  const textsRef: TextsRef = useRef({})
  const linesRef: LinesRef = useRef({})
  const circlesRef: CirclesRef = useRef({})

  const [roots, updateRoots] = useState<Root[]>([]);
  
  const handleMouseMove: HoverEvent =
    useCallback((e) => {
      const label = e.currentTarget.getAttribute('data-label');
      const types = e.currentTarget.getAttribute('data-types').split(',');
      setHoveredLabel(label);
      setHoveredTypes(types);
      if (onHoverTypes) {
        onHoverTypes(types);
      }
      if (onHoverLabel) {
        onHoverLabel(label);
      }
    }, [onHoverLabel, onHoverTypes]);
  
  const handleMouseLeave: HoverEvent =
    useCallback(() => {
      setHoveredLabel(undefined);
      setHoveredTypes([]);
      if (onHoverTypes) {
        onHoverTypes([]);
      }
      if (onHoverLabel) {
        onHoverLabel(undefined);
      }
    }, [onHoverLabel, onHoverTypes]);

  const graphPosition = useMemo(() => ({
    x: graphPositionProp?.x || width / 2,
    y: graphPositionProp?.y || ((height - 100) / 2) + 100
  }), [graphPositionProp, height, width])

  const types = useMemo(() => 
    data
      .reduce((acc, current) => ([...acc, ...(typeAccessor(current))]), [] as string[])
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

  const dataChunks = useMemo(() =>
    chunkArray(mappedData, petalsOptions?.count ?? 6)
  , [mappedData, petalsOptions?.count]);

  usePetalsPositions({
    circlesRef,
    dataChunks,
    linesRef,
    position: graphPosition,
    textsRef,
    fontSize,
    innerCircle,
    petalsOptions,
    connectionsRef,
    roots
  })

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
        hoveredLegends={hoveredTypes}
        offFocuseOpacity={offFocuseOpacity}
        onLegendHover={handleMouseMove}
        onLegendBlur={handleMouseLeave}
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
        <Connections
          dataChunks={dataChunks}
          hoveredConnections={hoveredTypes}
          hoveredLabel={hoveredlabel}
          connectionsRef={connectionsRef}
        />
        <Petals
          dataChunks={dataChunks}
          options={petalsOptions}
          fontSize={fontSize}
          hoveredLabel={hoveredlabel}
          hoveredTypes={hoveredTypes}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          offFocuseOpacity={offFocuseOpacity}
          circlesRef={circlesRef}
          linesRef={linesRef}
          textsRef={textsRef}
        />
        <Roots 
          types={legendData}
          offFocuseOpacity={offFocuseOpacity}
          options={rootsOptions}
          position={graphPosition}
          hoveredRoots={hoveredTypes}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          updateRoots={updateRoots}
        />
      </g>
    </svg>
  );
}

export default Graph;

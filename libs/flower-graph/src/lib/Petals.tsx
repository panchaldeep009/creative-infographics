import React, { MutableRefObject, useMemo } from 'react';
import { ConnectionsRef } from './Connections';
import { Data, HoverEvent, PetalsOptions } from './types';

export type TextsRef = MutableRefObject<Record<string, SVGTextElement>>;
export type LinesRef = MutableRefObject<Record<string, SVGLineElement>>;
export type CirclesRef = MutableRefObject<Record<string, SVGCircleElement>>;

export interface PetalsProps {
  dataChunks: Data[][],
  fontSize?: number;
  options?: PetalsOptions;
  hoveredLabel?: string;
  hoveredTypes?: string[];
  onMouseMove?: HoverEvent;
  onMouseLeave?: HoverEvent;
  offFocuseOpacity?: number;
  textsRef: TextsRef;
  linesRef: LinesRef;
  circlesRef: CirclesRef;
}

export const Petals: React.FC<PetalsProps> = ({
  dataChunks,
  options,
  fontSize: globalFontSize,
  onMouseLeave,
  onMouseMove,
  hoveredLabel,
  hoveredTypes,
  offFocuseOpacity,
  textsRef,
  linesRef,
  circlesRef
}) => {
  const {
    fontSize,
    labelColor,
    labelLineColor,
  } = useMemo(() => ({
    labelColor: options?.labelLineColor ?? '#333',
    labelLineColor: options?.labelLineColor ?? 'red',
    fontSize: options?.labelFontSize ?? globalFontSize ?? 6,
  }), [options?.labelLineColor, options?.labelFontSize, globalFontSize]);
  
  const dataChunkMap = useMemo(() =>
    dataChunks
      .map(chunk => chunk.map(entry => ({...entry, typesString: entry.types.map(({ type }) => type).join(','), labelTrimed: entry.label.length > 18 ? entry.label.slice(0, 15) + '...' : entry.label})))
  , [dataChunks]);

  return (
    <g name="Petals">
      {dataChunkMap.map(
        (data, i) => (
            <g key={`petal_${i}`}>
              {data.map(({ label, types, typesString, labelTrimed }, dataIndex) => (
                <g
                  opacity={hoveredLabel && hoveredLabel !== label ? offFocuseOpacity : 1}
                  name={label}
                  key={label}
                  data-label={label}
                  data-types={typesString}
                  onMouseMove={onMouseMove}
                  onMouseLeave={onMouseLeave} 
                >
                  <text
                    fill={labelColor}
                    fontSize={fontSize}
                    ref={r => textsRef.current[`${i}_${dataIndex}`] = r}
                  >
                    {labelTrimed}
                  </text>
                  <line
                    stroke={labelLineColor}
                    ref={r => linesRef.current[`${i}_${dataIndex}`] = r}
                  />
                  <g name={`${label}_types`} key={`${label}_types`}>
                    {types.map(({type, color}, typeIndex) => (
                      <circle
                        opacity={hoveredTypes.length && !hoveredTypes.includes(type) ? offFocuseOpacity : 1}
                        key={`${label}_${type}`}
                        fill={color}
                        data-types={type}
                        onMouseOver={onMouseMove}
                        onMouseLeave={onMouseLeave}
                        ref={r => (circlesRef.current[`${i}_${dataIndex}_${typeIndex}`] = r)}
                      />
                    ))}
                  </g>
                </g>
              ))}
            </g>
          )
        )}
    </g>
  );
}
import React, { useMemo } from 'react';
import { CircleOptions, HoverEvent, Petal, Position } from './types';
import { chunkArray, getSplitCirclePosition } from './utilities';

export interface PetalsOptions extends Partial<CircleOptions> {
  count?: number;
  labelColor?: string;
  labelFontSize?: number,
  labelLineColor?: string;
  labelLineLength?: number;
  labelLineDistance?: number;
  typeIndicatorRadius?: number;
}
export interface PetalsProps {
  data: {
    label: string,
    types: {
      type: string,
      color: string
    }[]
  }[],
  position: Position;
  updatePetals?: (petals: Petal[]) => void;
  fontSize?: number;
  innerCircle?: Partial<CircleOptions>;
  options?: PetalsOptions;
  hoveredLabel?: string;
  hoveredTypes?: string[];
  onMouseMove?: HoverEvent;
  onMouseLeave?: HoverEvent;
  offFocuseOpacity?: number;
}

export const Petals: React.FC<PetalsProps> = ({
  data,
  options,
  position,
  innerCircle,
  updatePetals,
  fontSize: globalFontSize,
  onMouseLeave,
  onMouseMove,
  hoveredLabel,
  hoveredTypes,
  offFocuseOpacity
}) => {
  const {
    count,
    radius,
    fontSize,
    rotation,
    labelColor,
    radianOffset,
    labelLineColor,
    labelLineLength,
    labelLineDistance,
    innerCircleRadius,
    innerCircleRotation,
    typeIndicatorRadius,
    innerCircleRadianOffset,
  } = useMemo(() => ({
    count: options?.count ?? 6,
    radius: options?.radius ?? 55,
    rotation: options?.rotation ?? 0,
    radianOffset: options?.radianOffset ?? 0,
    labelColor: options?.labelLineColor ?? '#333',
    innerCircleRadius: innerCircle?.radius ?? 195,
    labelLineLength: options?.labelLineLength ?? 4,
    innerCircleRotation: innerCircle?.rotation ?? 0,
    labelLineColor: options?.labelLineColor ?? 'red',
    labelLineDistance: options?.labelLineDistance ?? 4,
    typeIndicatorRadius: options?.typeIndicatorRadius ?? 3,
    fontSize: options?.labelFontSize ?? globalFontSize ?? 6,
    innerCircleRadianOffset: innerCircle?.radianOffset ?? 0,
  }), [options, innerCircle, globalFontSize]);
  
  const dataChunks = useMemo(() =>
    chunkArray(data, count)
  , [data, count]);

  const dataChunksWithPosition = useMemo(() =>
    dataChunks
      .map((data, index) => {
        const { x, y } = getSplitCirclePosition(count, index, innerCircleRotation, innerCircleRadianOffset);
        const petalCircleX = (x * innerCircleRadius) + position.x;
        const petalCircleY = (y * innerCircleRadius) + position.y;
        return {
          data,
          petalCircleX,
          petalCircleY
        }
      })
  , [count, dataChunks, innerCircleRadianOffset, innerCircleRadius, position.x, position.y, innerCircleRotation]);

  const dataChunksWithTypesPosition = useMemo(() =>
    {
      const computedData = dataChunksWithPosition
      .map((chunk, chunkIndex) => {
        const rotationOffset = (((360 - innerCircleRadianOffset) / count) * chunkIndex);
        const textRotation =  (-(radianOffset - 360) / chunk.data.length);
          return {
          ...chunk,
          data: chunk.data.map((entry, entryIndex) => {
            const { x, y } = getSplitCirclePosition(
              chunk.data.length,
              entryIndex,
              rotation + rotationOffset,
              radianOffset
            );
            return ({
            ...entry,
            labelTrimed: entry.label.length > 18 ? entry.label.slice(0, 15) + '...' : entry.label,
            typesString: entry.types.map(({ type }) => type).join(','),
            types: entry.types.map((type, typeIndex) => {
              const r = radius - (typeIndex * (typeIndicatorRadius * 2))
              const typeCircleX = (x * r) + chunk.petalCircleX;
              const typeCircleY = (y * r) + chunk.petalCircleY;
              return {
                ...type,
                pos: {
                  x: typeCircleX,
                  y: typeCircleY
                },
              }
            }),
            line: {
              x1: (x * (radius + labelLineDistance)) + chunk.petalCircleX,
              y1: (y * (radius + labelLineDistance)) + chunk.petalCircleY,
              x2: (x * (radius + labelLineDistance + labelLineLength)) + chunk.petalCircleX,
              y2: (y * (radius + labelLineDistance + labelLineLength)) + chunk.petalCircleY,
            },
            text: {
              x: chunk.petalCircleX + radius + labelLineLength + labelLineDistance + 2,
              y: chunk.petalCircleY,
              rotation: `
                rotate(
                  ${((textRotation) * entryIndex) + rotationOffset + rotation},
                  ${chunk.petalCircleX},
                  ${chunk.petalCircleY}
                )
              `
            }
          })})
        }
      });
      updatePetals(computedData);
      return computedData;
    }
  , [updatePetals, count, dataChunksWithPosition, innerCircleRadianOffset, radianOffset, radius, rotation, typeIndicatorRadius, labelLineDistance, labelLineLength]);

  return (
    <g name="Petals">
      {dataChunksWithTypesPosition.map(
        ({ data }, i) => (
            <g key={`petal_${i}`}>
              {data.map(({ label, types, line, text, typesString, labelTrimed }) => (
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
                    x={text.x}
                    y={text.y}
                    fill={labelColor}
                    transform={text.rotation}
                    fontSize={fontSize}
                  >
                    {labelTrimed}
                  </text>
                  <line 
                    {...line}
                    stroke={labelLineColor}
                  />
                  <g name={`${label}_types`} key={`${label}_types`}>
                    {types.map(({type, color, pos}) => (
                      <circle
                        opacity={hoveredTypes.length && !hoveredTypes.includes(type) ? offFocuseOpacity : 1}
                        key={`${label}_${type}`}
                        fill={color}
                        r={typeIndicatorRadius}
                        cx={pos.x}
                        cy={pos.y}
                        data-types={type}
                        onMouseMove={onMouseMove}
                        onMouseLeave={onMouseLeave}
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
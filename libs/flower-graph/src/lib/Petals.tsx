import React, { useMemo } from 'react';
import { CircleOptions, Position } from './types';
import { chunkArray, getSplitCirclePosition } from './utilities';

export interface PetalsOptions extends Partial<CircleOptions> {
  count?: number;
  typeIndicatorRadius?: number;
  labelLineLength?: number;
  labelLineColor?: string;
  labelLineDistance?: number;
}
export interface PetalsProps {
  data: {
    label: string,
    types: {
      type: string,
      color: string
    }[]
  }[]
  position: Position;
  innerCircle?: Partial<CircleOptions>;
  options?: PetalsOptions
}

export const Petals: React.FC<PetalsProps> = ({
  data,
  innerCircle,
  position,
  options
}) => {
  const {
    radius,
    count,
    rotation,
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
    innerCircleRadius: innerCircle?.radius ?? 195,
    labelLineLength: options?.labelLineLength ?? 4,
    innerCircleRotation: innerCircle?.rotation ?? 0,
    labelLineColor: options?.labelLineColor ?? 'red',
    labelLineDistance: options?.labelLineDistance ?? 4,
    typeIndicatorRadius: options?.typeIndicatorRadius ?? 3,
    innerCircleRadianOffset: innerCircle?.radianOffset ?? 0,
  }), [options, innerCircle]);
  
  const dataChunks = useMemo(() =>
    chunkArray(data, count)
  , [data, count]);

  const dataChunksWithPosition = useMemo(() =>
    dataChunks
      .map((data, index) => {
        const { x, y } = getSplitCirclePosition(count, index, innerCircleRadius, innerCircleRotation, innerCircleRadianOffset);
        const petalCircleX = x + position.x;
        const petalCircleY = y + position.y;
        return {
          data,
          petalCircleX,
          petalCircleY
        }
      })
  , [count, dataChunks, innerCircleRadianOffset, innerCircleRadius, position.x, position.y, innerCircleRotation]);

  const dataChunksWithTypesPosition = useMemo(() =>
    dataChunksWithPosition
      .map((chunk, chunkIndex) => {
        const rotationOffset = (((360 - innerCircleRadianOffset) / count) * chunkIndex);
          return {
          ...chunk,
          data: chunk.data.map((entry, entryIndex) => ({
            ...entry,
            types: entry.types.map((type, typeIndex) => {
              const { x, y } = getSplitCirclePosition(
                chunk.data.length,
                entryIndex,
                radius - (typeIndex * (typeIndicatorRadius * 2)),
                rotation + rotationOffset,
                radianOffset
              );
              const typeCircleX = x + chunk.petalCircleX;
              const typeCircleY = y + chunk.petalCircleY;
              return {
                ...type,
                pos: {
                  x: typeCircleX,
                  y: typeCircleY
                }
              }
            })
          }))
        }
      })
  , [count, dataChunksWithPosition, innerCircleRadianOffset, radianOffset, radius, rotation, typeIndicatorRadius]);

  const dataChunksWithLinePosition = useMemo(() =>
    dataChunksWithTypesPosition
      .map((chunk, chunkIndex) => {
        const rotationOffset = (((360 - innerCircleRadianOffset) / count) * chunkIndex);
          return {
          ...chunk,
          data: chunk.data.map((entry, entryIndex) => {
            const startPos = getSplitCirclePosition(
              chunk.data.length,
              entryIndex,
              radius + labelLineDistance,
              rotation + rotationOffset,
              radianOffset
            );
            const endPos = getSplitCirclePosition(
              chunk.data.length,
              entryIndex,
              radius + labelLineDistance + labelLineLength,
              rotation + rotationOffset,
              radianOffset
            );
            return ({
              ...entry,
              line: {
                x1: startPos.x + chunk.petalCircleX,
                y1: startPos.y + chunk.petalCircleY,
                x2: endPos.x + chunk.petalCircleX,
                y2: endPos.y + chunk.petalCircleY,
              }
            })
          })
        }
      })
  , [count, dataChunksWithTypesPosition, innerCircleRadianOffset, labelLineDistance, labelLineLength, radianOffset, radius, rotation]);


  return (
    <g name="Petals">
      {dataChunksWithLinePosition.map(
        ({ data }, i) => (
            <g key={`petal_${i}`}>
              {data.map(({ label, types, line }) => (
                <g name={label} key={label}>
                  <line 
                    {...line}
                    stroke={labelLineColor}
                  />
                  <g name={`${label}_types`} key={`${label}_types`}>
                    {types.map(({type, color, pos}) => (
                      <circle
                        key={`${label}_${type}`}
                        fill={color}
                        r={typeIndicatorRadius}
                        cx={pos.x}
                        cy={pos.y}
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
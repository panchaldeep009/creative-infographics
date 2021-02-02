import React, { useMemo } from 'react';
import { CircleOptions, Position } from './types';
import { chunkArray, getSplitCirclePosition } from './utilities';

export interface PetalsOptions extends Partial<CircleOptions> {
  count?: number;
  typeIndicatorRadius?: number;
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
    innerCircleRadianOffset,
    innerCircleRadius,
    innerCircleRotation,
    typeIndicatorRadius,
  } = useMemo(() => ({
    radius: options?.radius ?? 55,
    count: options?.count ?? 6,
    rotation: options?.rotation ?? 0,
    radianOffset: options?.radianOffset ?? 0,
    typeIndicatorRadius: options?.typeIndicatorRadius ?? 3,
    innerCircleRadianOffset: innerCircle?.radianOffset ?? 0,
    innerCircleRadius: innerCircle?.radius ?? 195,
    innerCircleRotation: innerCircle?.rotation ?? 0,
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
      .map((chunk) => ({
        ...chunk,
        data: chunk.data.map((entry, entryIndex) => ({
          ...entry,
          types: entry.types.map((type, typeIndex) => {
            const { x, y } = getSplitCirclePosition(
              chunk.data.length,
              entryIndex,
              radius - (typeIndex * (typeIndicatorRadius * 2)),
              rotation,
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
      }))
  , [dataChunksWithPosition, radianOffset, radius, rotation, typeIndicatorRadius]);

  return (
    <g name="Petals">
      {dataChunksWithTypesPosition.map(
        ({data, petalCircleX, petalCircleY}, i) => (
            <g key={`petal_${i}`}>
              <circle
                cx={petalCircleX}
                cy={petalCircleY}
                r={radius}
                fill="none"
                stroke="red"
              />
              {data.map(({ label, types }) => (
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
              ))}
            </g>
          )
        )}
      <circle
        cx={position.x}
        cy={position.y}
        r={innerCircleRadius}
        fill="none"
        stroke="black"
      />
    </g>
  );
}
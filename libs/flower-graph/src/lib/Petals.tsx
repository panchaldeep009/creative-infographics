import React, { useEffect, useMemo } from 'react';
import { CircleOptions, Petal, Position } from './types';
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
  onTypeBlur?: () => void;
  onLabelBlur?: () => void;
  onTypeHover?: (types: string[]) => void;
  onLabelHover?: (label: string) => void;
  offFocuseOpacity?: number;
}

export const Petals: React.FC<PetalsProps> = ({
  data,
  options,
  position,
  innerCircle,
  updatePetals,
  fontSize: globalFontSize,
  onTypeBlur,
  onLabelBlur,
  hoveredLabel,
  hoveredTypes,
  onLabelHover,
  onTypeHover,
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

  const dataChunksWithLineAndTextPosition = useMemo(() =>
    dataChunksWithTypesPosition
      .map((chunk, chunkIndex) => {
        const rotationOffset = (((360 - innerCircleRadianOffset) / count) * chunkIndex);
        const textRotation =  (-(radianOffset - 360) / chunk.data.length);
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
            })
          })
        }
      })
  , [count, dataChunksWithTypesPosition, innerCircleRadianOffset, labelLineDistance, labelLineLength, radianOffset, radius, rotation]);
  
  useEffect(() => {
    updatePetals(dataChunksWithLineAndTextPosition)
  }, [updatePetals, dataChunksWithLineAndTextPosition]);

  return (
    <g name="Petals">
      {dataChunksWithLineAndTextPosition.map(
        ({ data }, i) => (
            <g key={`petal_${i}`}>
              {data.map(({ label, types, line, text }) => (
                <g
                  opacity={hoveredLabel && hoveredLabel !== label ? offFocuseOpacity : 1}
                  name={label}
                  key={label} 
                  onMouseMove={() => {
                    onLabelHover(label);
                    onTypeHover(types.map(({ type }) => type));
                  }}
                  onMouseLeave={() => {
                    onLabelBlur();
                    onTypeBlur();
                  }} 
                >
                  <text
                    x={text.x}
                    y={text.y}
                    fill={labelColor}
                    transform={text.rotation}
                    fontSize={fontSize}
                  >
                    {label}
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
                        onMouseMove={() => onTypeHover([type])}
                        onMouseLeave={onTypeBlur}
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
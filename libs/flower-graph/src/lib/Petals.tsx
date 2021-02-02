import React, { useMemo } from 'react';
import { CircleOptions, Position } from './types';
import { getSplitCirclePosition } from './utilities';

export interface PetalsOptions extends Partial<CircleOptions> {
  count?: number;
  rotate?: number;
}

export interface PetalsProps {
  position: Position;
  innerCircle?: Partial<CircleOptions>;
  options?: PetalsOptions
}

export const Petals: React.FC<PetalsProps> = ({
  innerCircle,
  position,
  options
}) => {

  const {
    radius,
    count,
    rotate,
    innerCircleRadianOffset,
    innerCircleRadius
  } = useMemo(() => ({
    radius: options?.radius ?? 55,
    count: options?.count ?? 6,
    rotate: options?.rotate ?? 0,
    radianOffset: options.radianOffset ?? 0,
    innerCircleRadianOffset: innerCircle?.radianOffset ?? 0,
    innerCircleRadius: innerCircle?.radius ?? 195
  }), [options, innerCircle]);

  return (
    <g name="Petals">
      {[...Array(count)].map(
        (_,i) => {
          const { x, y } = getSplitCirclePosition(count, i, innerCircleRadius, rotate, innerCircleRadianOffset);
          return (
            <circle
              cx={x + position.x}
              cy={y + position.y}
              r={radius}
              fill="none"
              stroke="red"
            />
          );
        }
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

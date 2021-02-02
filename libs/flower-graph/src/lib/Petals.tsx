import React, { useMemo } from 'react';
import { Position } from './types';
import { getSplitCirclePosition } from './utilities';

export interface PetalsOptions {
  radius?: number;
  count?: number;
}

export interface PetalsProps {
  position: Position;
  flowerInnerRadius: number;
  options?: PetalsOptions
}

export const Petals: React.FC<PetalsProps> = ({
  flowerInnerRadius,
  position,
  options
}) => {

  const {
    radius,
    count
  } = useMemo(() => ({
    radius: options?.radius || 55,
    count: options?.count || 6
  }), [options]);

  return (
    <g name="Petals">
      {[...Array(count)].map(
        (_,i) => {
          const { x, y } = getSplitCirclePosition(count, i, flowerInnerRadius);
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
        r={flowerInnerRadius}
        fill="none"
        stroke="black"
      />
    </g>
  );
}

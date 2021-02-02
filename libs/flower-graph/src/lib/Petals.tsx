import React, { useMemo } from 'react';
import { Position } from './types';
import { getSplitCirclePosition } from './utilities';

export interface PetalsOptions {
  radius?: number;
}

export interface PetalsProps {
  graphPosition: Position;
  petalsNumber: number;
  flowerInnerRadius: number;
  options?: PetalsOptions
}

export const Petals: React.FC<PetalsProps> = ({
  petalsNumber,
  flowerInnerRadius,
  graphPosition,
  options
}) => {

  const {
    radius,
  } = useMemo(() => ({
    radius: options?.radius || 55
  }), [options]);

  return (
    <g name="Petals">
      {[...Array(petalsNumber)].map(
        (_,i) => {
          const { x, y } = getSplitCirclePosition(petalsNumber, i, flowerInnerRadius);
          return (
            <circle
              cx={x + graphPosition.x}
              cy={y + graphPosition.y}
              r={radius}
              fill="none"
              stroke="red"
            />
          );
        }
      )}
      <circle
        cx={graphPosition.x}
        cy={graphPosition.y}
        r={flowerInnerRadius}
        fill="none"
        stroke="black"
      />
    </g>
  );
}

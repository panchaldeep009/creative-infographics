import React from 'react';
import { Position } from './types';
import { getSplitCirclePosition } from './utilities';

export interface PetalsProps {
  graphPosition: Position;
  petalsNumber: number;
  flowerInnerRadius: number;
}

export const Petals: React.FC<PetalsProps> = ({
  petalsNumber,
  flowerInnerRadius,
  graphPosition,
}) => {

  return (
    <g name="Petals">
      {[...Array(petalsNumber)].map(
        (_,i) => {
          const { x, y } = getSplitCirclePosition(petalsNumber, i, flowerInnerRadius);
          return (
            <circle
              cx={x + graphPosition.x}
              cy={y + graphPosition.y}
              r={60}
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

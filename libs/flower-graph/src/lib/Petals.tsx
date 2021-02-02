import React from 'react';
import { Position } from './types';

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

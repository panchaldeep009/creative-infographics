import React, { useMemo } from 'react';
import { Position } from './types';

export interface RootsOptions {
  spacing?: number;
  offFocuseOpacity?: number;
  rootMaxRadius?: number
} 

export interface RootsProps {
  types: {
    type: string,
    color: string,
    count: number,
  }[];
  graphPosition: Position;
  offFocuseOpacity?: number;
  hoveredRoot?: string;
  rootsOptions?: RootsOptions;
  onRootHover?: (type?: string) => void;
  onRootBlur?: () => void;
}

export const Roots: React.FC<RootsProps> = ({
  types,
  rootsOptions,
  offFocuseOpacity: globalOffFocusOpacity,
  hoveredRoot,
  graphPosition,
  onRootHover,
  onRootBlur
}) => {
  const {
    offFocusOpacity,
    rootsSpacing,
    rootMaxRadius,
  } = useMemo(() => ({
    offFocusOpacity: rootsOptions?.offFocuseOpacity || globalOffFocusOpacity || 1,
    rootMaxRadius: rootsOptions?.rootMaxRadius || 20,
    rootsSpacing: rootsOptions?.spacing || 2
  }), [rootsOptions,  globalOffFocusOpacity]);

  const maxCount = useMemo(() => Math.max(...types.map(type => type.count || 0)),[types]);

  const [typesWithRadius, startingX] = useMemo(() => {
    let previousOffsetX = 0;
    let previousRadius = 0;
    return [
      types.map(type => {
        const radius = rootMaxRadius * (type.count / maxCount);
        const currentRadius = Math.round(radius < 2 ? 2 : radius);
        const offsetX = previousOffsetX + previousRadius + currentRadius + rootsSpacing;
        previousRadius = currentRadius;
        previousOffsetX = offsetX;
        return {
          ...type,
          radius: currentRadius,
          offsetX
        }
      }),
      graphPosition.x - (previousOffsetX/2)
    ]
  }, [types, graphPosition.x, rootMaxRadius, maxCount, rootsSpacing]);

  const roots = useMemo(() => 
    typesWithRadius.map((type) => ({
      ...type,
      x: startingX + type.offsetX,
      y: graphPosition.y
    }))
  , [typesWithRadius, startingX, graphPosition.y]);

  return (
    <g name="roots">
      {roots.map(({ type, color, radius, x, y }) => {
        return (
          <circle
            key={"root_" + type}
            cx={x}
            cy={y}
            fill={color}
            r={radius}
            opacity={(hoveredRoot && hoveredRoot !== type) ? offFocusOpacity : 1}
            onMouseMove={() => onRootHover(type)}
            onMouseLeave={onRootBlur}
          />
        )
      })}
    </g>
  );
}

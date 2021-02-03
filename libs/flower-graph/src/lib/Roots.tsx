import React, { useEffect, useMemo } from 'react';
import { Position, Root } from './types';

export interface RootsOptions {
  spacing?: number;
  rootMaxRadius?: number;
  offFocuseOpacity?: number;
} 

export interface RootsProps {
  types: {
    type: string,
    color: string,
    count: number,
  }[];
  position: Position;
  hoveredRoots?: string[];
  options?: RootsOptions;
  onRootBlur?: () => void;
  offFocuseOpacity?: number;
  onRootHover?: (type?: string[]) => void;
  updateRoots?: (petals: Root[]) => void;
}

export const Roots: React.FC<RootsProps> = ({
  types,
  options,
  position,
  onRootBlur,
  onRootHover,
  updateRoots,
  hoveredRoots,
  offFocuseOpacity: globalOffFocusOpacity,
}) => {
  const {
    offFocusOpacity,
    rootsSpacing,
    rootMaxRadius,
  } = useMemo(() => ({
    offFocusOpacity: options?.offFocuseOpacity ?? globalOffFocusOpacity ?? 0.5,
    rootMaxRadius: options?.rootMaxRadius || 20,
    rootsSpacing: options?.spacing || 2
  }), [options,  globalOffFocusOpacity]);

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
      position.x - (previousOffsetX/2)
    ]
  }, [types, position.x, rootMaxRadius, maxCount, rootsSpacing]);

  const roots = useMemo(() => 
    typesWithRadius.map((type) => ({
      ...type,
      x: startingX + type.offsetX,
      y: position.y
    }))
  , [typesWithRadius, startingX, position.y]);

  useEffect(() => {
    updateRoots(roots);
  }, [updateRoots, roots])

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
            opacity={(hoveredRoots.length && !hoveredRoots.includes(type)) ? offFocusOpacity : 1}
            onMouseMove={() => onRootHover([type])}
            onMouseLeave={onRootBlur}
          />
        )
      })}
    </g>
  );
}

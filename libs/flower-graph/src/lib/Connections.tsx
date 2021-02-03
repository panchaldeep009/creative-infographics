import React from 'react';
import { Petal, Root } from './types';

interface ConnectionsProps {
  roots: Root[];
  petals: Petal[];
  hoveredConnections?: string[];
  hoveredLabel?: string;
}

export const Connections: React.FC<ConnectionsProps> = ({ petals, roots, hoveredConnections, hoveredLabel }) => {
  return <g name="connections">
    {petals.map(({ data, petalCircleX: petalX, petalCircleY: petalY }, index) => (
      <g key={`connections_petal_${index}`} name={`connections_petal_${index}`}>
        {data.map(({ types, label }) => (
        <g 
          key={label}
          opacity={hoveredLabel && hoveredLabel !== label ? 0 : 1}
          name={`connections_${label}`}
        >
          {types.map(({ type, color, pos }) => {
            const typeRoot = roots.find(r => r.type === type);
            return (
              <path
                opacity={hoveredConnections.length && !hoveredConnections.includes(type) ? 0 : 1}
                key={type}
                stroke={color}
                fill="transparent"
                strokeWidth={0.5}
                d={`M ${pos.x} ${pos.y} C ${petalX} ${petalY}, ${typeRoot.x} ${typeRoot.y}, ${typeRoot.x} ${typeRoot.y}`}
              />
            )
          })}
        </g>
        ))}
      </g>
    ))}
  </g>
}
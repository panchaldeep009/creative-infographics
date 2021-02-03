import React from 'react';
import { Petal, Root } from './types';

interface ConnectionsProps {
  roots: Root[];
  petals: Petal[];
}

export const Connections: React.FC<ConnectionsProps> = ({ petals, roots }) => {
  return <g name="connections">
    {petals.map(({ data, petalCircleX: petalX, petalCircleY: petalY }, index) => (
      <g key={`connections_petal_${index}`} name={`connections_petal_${index}`}>
        {data.map(({ types, label }) => (
        <React.Fragment key={label}>
          {types.map(({ type, color, pos }) => {
            const typeRoot = roots.find(r => r.type === type);
            return (
              <path 
                key={type}
                stroke={color}
                fill="transparent"
                strokeWidth={0.5}
                d={`M ${pos.x} ${pos.y} C ${petalX} ${petalY}, ${typeRoot.x} ${typeRoot.y}, ${typeRoot.x} ${typeRoot.y}`}
              />
            )
          })}
        </React.Fragment>
        ))}
      </g>
    ))}
  </g>
}
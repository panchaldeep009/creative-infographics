import React, { MutableRefObject } from 'react';
import { Data } from './types';

export type ConnectionsRef = MutableRefObject<Record<string,SVGPathElement>>;

interface ConnectionsProps {
  dataChunks: Data[][];
  hoveredConnections?: string[];
  hoveredLabel?: string;
  connectionsRef: ConnectionsRef;
}

export const Connections: React.FC<ConnectionsProps> = React.memo(({ dataChunks, hoveredConnections, hoveredLabel, connectionsRef }) => {
  return <g name="connections">
    {dataChunks.map((data, index) => (
      <g key={`connections_petal_${index}`} name={`connections_petal_${index}`}>
        {data.map(({ types, label }, dataIndex) => (
        <g 
          key={label}
          opacity={hoveredLabel && hoveredLabel !== label ? 0 : 1}
          name={`connections_${label}`}
        >
          {types.map(({ type, color }, typeIndex) => {
            return (
              <path
                opacity={hoveredConnections.length && !hoveredConnections.includes(type) ? 0 : 1}
                key={type}
                stroke={color}
                fill="transparent"
                strokeWidth={0.5}
                ref={p => connectionsRef.current[`${typeIndex}_${index}_${dataIndex}`] = p}
                d="M 0 0, 0 0"
              />
            )
          })}
        </g>
        ))}
      </g>
    ))}
  </g>
});
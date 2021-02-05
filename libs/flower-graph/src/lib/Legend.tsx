import React, { useMemo } from 'react';
import { ColorOptions, HoverEvent } from './types';

export interface LegendOptions {
  fontColor?: string;
  fontSize?: number;
  spacing?: number;
  offFocuseOpacity?: number;
  indicatorRadius?: number
} 

export interface LegendProps extends Pick<ColorOptions, 'luminosity'>{
  types: {
    type: string,
    color: string
    count: number
  }[];
  fontSize: number;
  offFocuseOpacity?: number;
  hoveredLegends?: string[];
  legendOptions?: LegendOptions;
  onLegendHover?: HoverEvent;
  onLegendBlur?: HoverEvent;
}

export const Legend: React.FC<LegendProps> = ({
  types,
  legendOptions,
  fontSize: globalFontSize,
  offFocuseOpacity: globalOffFocusOpacity,
  luminosity,
  hoveredLegends,
  onLegendHover,
  onLegendBlur
}) => {
  const {
    fontColor,
    spacing,
    fontSize,
    offFocusOpacity,
    indicatorRadius,
  } = useMemo(() => ({
    spacing: legendOptions?.spacing ?? 15,
    fontSize: legendOptions?.fontSize ?? globalFontSize ?? 6,
    fontColor: legendOptions?.fontColor || (luminosity === 'dark' ? '#e5e5e5' : '#333333'),
    offFocusOpacity: legendOptions?.offFocuseOpacity ?? globalOffFocusOpacity ?? 0.5,
    indicatorRadius: legendOptions?.indicatorRadius ?? 5
  }), [legendOptions, globalFontSize, globalOffFocusOpacity, luminosity]);
  
  return (
    <g name="legend">
      {types.map(({ type, color, count }, index) => {
        const spacingOffset = index * spacing;
        return (
          <g 
            opacity={
              (hoveredLegends.length && !hoveredLegends.includes(type)) ? offFocusOpacity : 1
            } 
            key={type} 
            name={type}
            style={{ cursor: 'pointer' }}
          >
            <text
              x={100 + spacingOffset}
              y={150}
              transform={`rotate(-45 ${spacingOffset} 45)`}
              fill={fontColor}
              fontSize={fontSize}
              data-types={type}
              onMouseMove={onLegendHover}
              onMouseLeave={onLegendBlur}
            >
              {count + "  :  " + type}
            </text>
            <circle
              cx={20 + spacingOffset + 120}
              cy={55}
              fill={color}
              r={indicatorRadius}
              data-types={type}
              onMouseMove={onLegendHover}
              onMouseLeave={onLegendBlur}
            />
          </g>
        )
      }
      )}
    </g>
  );
}

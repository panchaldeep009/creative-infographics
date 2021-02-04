import randomColors from 'randomcolor';
import { ElementType } from 'react';

export type Hue = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'monochrome';
export type ColorOptions = Pick<Parameters<typeof randomColors>[0], 'luminosity'> & { hue?: Hue };

export type Position = {
  x: number,
  y: number
}

export type CircleOptions = {
  radius: number,
  radianOffset: number,
  rotation: number,
}

export type Root = {
  x: number;
  y: number;
  radius: number;
  offsetX: number;
  type: string;
  color: string;
  count: number;
};

export type Petal = {
  data: {
    line: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };
    text: Position & {
      rotation: string;
    };
    types: {
      pos: Position;
      type: string;
      color: string;
    }[];
    label: string;
  }[];
  petalCircleX: number;
  petalCircleY: number;
};


export type AdditionalPropsType<E extends ElementType, P = Partial<React.ComponentProps<E>>> = P | ((currentProps: P) => P);

export type ComponentsAddtionalProps = Partial<{
  graphSvg: AdditionalPropsType<'svg'>;
  graphGroup: AdditionalPropsType<'g'>;
  legend: Partial<{
    group: AdditionalPropsType<'g'>;
    itemGroup: AdditionalPropsType<'g'>;
    text: AdditionalPropsType<'text'>;
    indicator: AdditionalPropsType<'circle'>;
  }>,
  roots: Partial<{
    group: AdditionalPropsType<'g'>;
    indicator: AdditionalPropsType<'circle'>;
  }>,
  petal: Partial<{
    allPetalGroup: AdditionalPropsType<'g'>;
    group: AdditionalPropsType<'g'>;
    entryGroup: AdditionalPropsType<'g'>;
    labelText: AdditionalPropsType<'text'>;
    labelIndicatorLine: AdditionalPropsType<'line'>;
    typesGroup: AdditionalPropsType<'g'>;
    typeCircle: AdditionalPropsType<'circle'>
  }>,
  connection: Partial<{
    group: AdditionalPropsType<'g'>;
    groupPerPetal: AdditionalPropsType<'g'>;
    groupPerEntry: AdditionalPropsType<'g'>;
    path: AdditionalPropsType<'path'>;
  }>
}>
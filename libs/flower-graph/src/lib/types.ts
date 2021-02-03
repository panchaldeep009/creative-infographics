import randomColors from 'randomcolor';

export type Hue = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'monochrome';
export type ColorOptions = Pick<Parameters<typeof randomColors>[0], 'luminosity'> & { hue: Hue };

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
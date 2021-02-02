import randomColors from 'randomcolor';

export type Hue = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'monochrome';
export type ColorOptions = Pick<Parameters<typeof randomColors>[0], 'luminosity'> & { hue: Hue };

export type Position = {
  x: number,
  y: number
}

export type CircleOptions = {
  radius: number,
  radianOffset: number
}
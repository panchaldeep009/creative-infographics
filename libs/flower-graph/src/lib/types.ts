import randomColors from 'randomcolor';

export type ColorOptions = Pick<Parameters<typeof randomColors>[0], 'luminosity' | 'hue'>;
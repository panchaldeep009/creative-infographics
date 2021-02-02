import React from 'react';
import { Graph } from './Graph';
import data from './../test-data/movies';
import { Story, Meta } from '@storybook/react/types-6-0';
import { number, radios, color, select } from '@storybook/addon-knobs';
import { Hue } from './types';

const hues = [undefined, 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

export default {
  component: Graph,
  title: 'FlowerGraph'
} as Meta;

export const Primary: Story = () => {
  return <div style={{ height: '100vh' }}>
    <Graph 
      data={data}
      labelAccessor={data => data.Title}
      typeAccessor={data => data.Genre?.split(', ') || []} 
      fontSize={number('fontSize', 6)}
      width={number('width', 600)}
      height={number('height', 700)}
      graphPosition={{
        x: number('graphPosition.x', undefined),
        y: number('graphPosition.y', undefined)
      }}
      flowerInnerRadius={number('flowerInnerRadius', 195, { step: 1, min: 10, max: 300, range: true })}
      graphRotation={number('graphRotation', 45, { step: 1, min: -360, max: 360, range: true })}
      petalsNumber={number('petalsNumber', 6, { step: 1, range: true, max: 30 })}
      luminosity={radios('luminosity', { Bright: 'bright', Dark: 'dark' }, 'bright')}
      hue={select('hue', hues,undefined) as Hue}
      offFocuseOpacity={number('offFocuseOpacity', 0.4, { step: 0.1, min: 0, max: 1, range: true })}
      legendOptions={{
        fontSize: number('legendOptions.fontSize', undefined),
        fontColor: color('legendOptions.fontColor', undefined),
        indicatorRadius: number('legendOptions.indicatorRadius', undefined, { step: 0.2, min: 0, max: 10, range: true }),
        offFocuseOpacity: number('legendOptions.offFocuseOpacity', undefined, { step: 0.1, min: 0, max: 1, range: true }),
        spacing: number('legendOptions.spacing', undefined, { step: 1, max: 20, range: true }),
      }}
      rootOptions={{
        offFocuseOpacity: number('rootOptions.offFocuseOpacity', undefined, { step: 0.1, min: 0, max: 1, range: true }),
        rootMaxRadius: number('rootOptions.rootMaxRadius', undefined, { step: 1, min: 0, max: 50, range: true }),
        spacing: number('rootOptions.spacing', undefined, { step: 1, max: 20, range: true }),
      }}
      petalsOptions={{
        radius: number('petalsOptions.radius', undefined, { step: 1, min: 0, max: 300, range: true })
      }}
    />;
  </div>
};

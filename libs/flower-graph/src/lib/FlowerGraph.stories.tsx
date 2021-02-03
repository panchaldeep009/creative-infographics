import React from 'react';
import { Graph } from './Graph';
import data from './../test-data/movies';
import { Story, Meta } from '@storybook/react/types-6-0';
import { number, radios, color, select } from '@storybook/addon-knobs';
import { Hue } from './types';

const hues = [undefined, 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

const graphPropsGroupId = 'props';
const innerCircleGroupId = 'innerCircle';
const petalsOptionsGroupId = 'petalsOptions';
const rootsOptionsGroupId = 'rootsOptions';
const legendOptionsGroupId = 'legendOptions';

export default {
  component: Graph,
  title: 'FlowerGraph'
} as Meta;

export const MoviesAndGenres: Story = () => {
  return <div style={{ height: '100vh' }}>
    <Graph 
      data={data.filter(d => d.Genre?.length)}
      labelAccessor={data => data.Title.length > 18 ? data.Title.slice(0, 15) + '...' : data.Title}
      typeAccessor={data => data.Genre?.split(', ') || []} 
      fontSize={number('fontSize', 6, {}, graphPropsGroupId)}
      width={number('width', 600, {}, graphPropsGroupId)}
      height={number('height', 700, {}, graphPropsGroupId)}
      graphPosition={{
        x: number('graphPosition.x', undefined, {}, graphPropsGroupId),
        y: number('graphPosition.y', undefined, {}, graphPropsGroupId)
      }}
      innerCircle={{
        radius: number('radius', 195, { step: 1, min: 0, max: 300, range: true }, innerCircleGroupId),
        radianOffset: number('radianOffset', undefined, { step: 1, min: -360, max: 360, range: true }, innerCircleGroupId),
        rotation: number('rotate', undefined, { step: 1, min: -360, max: 360, range: true }, innerCircleGroupId),
      }}
      graphRotation={number('graphRotation', 45, { step: 1, min: -360, max: 360, range: true }, graphPropsGroupId)}
      offFocuseOpacity={number('offFocuseOpacity', 0.4, { step: 0.1, min: 0, max: 1, range: true }, graphPropsGroupId)}
      luminosity={radios('luminosity', { Bright: 'bright', Dark: 'dark' }, 'bright', graphPropsGroupId)}
      hue={select('hue', hues, undefined, graphPropsGroupId) as Hue}
      legendOptions={{
        fontSize: number('fontSize', undefined, {}, legendOptionsGroupId),
        fontColor: color('fontColor', undefined, legendOptionsGroupId),
        indicatorRadius: number('indicatorRadius', undefined, { step: 0.2, min: 0, max: 10, range: true }, legendOptionsGroupId),
        offFocuseOpacity: number('offFocuseOpacity', undefined, { step: 0.1, min: 0, max: 1, range: true }, legendOptionsGroupId),
        spacing: number('spacing', undefined, { step: 1, max: 20, range: true }, legendOptionsGroupId),
      }}
      rootsOptions={{
        offFocuseOpacity: number('offFocuseOpacity', undefined, { step: 0.1, min: 0, max: 1, range: true }, rootsOptionsGroupId),
        rootMaxRadius: number('rootMaxRadius', undefined, { step: 1, min: 0, max: 50, range: true }, rootsOptionsGroupId),
        spacing: number('spacing', undefined, { step: -10, max: 20, range: true }, rootsOptionsGroupId),
      }}
      petalsOptions={{
        count: number('count', 5, { step: 1, range: true, max: 30 }, petalsOptionsGroupId),
        typeIndicatorRadius: number('typeIndicatorRadius', 3, { step: 1, range: true, max: 10, min: 1 }, petalsOptionsGroupId),
        radius: number('radius', undefined, { step: 1, min: 0, max: 300, range: true }, petalsOptionsGroupId),
        radianOffset: number('radianOffset', 124, { step: 1, min: -360, max: 360, range: true }, petalsOptionsGroupId),
        rotation: number('rotate', 245, { step: 1, min: -360, max: 360, range: true }, petalsOptionsGroupId),
        labelLineColor: color('labelLineColor', undefined, petalsOptionsGroupId),
        labelLineLength: number('labelLineLength', 5, { step: 1, range: true, max: 30 }, petalsOptionsGroupId),
        labelLineDistance: number('labelLineDistance', 3, { step: 1, range: true, max: 10 }, petalsOptionsGroupId),
        labelFontSize: number('labelFontSize',  undefined, {}, petalsOptionsGroupId)
      }}
    />
  </div>
};

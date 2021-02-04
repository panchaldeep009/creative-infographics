import Graph, { GraphProps } from './Graph';
import { Movie } from './../test-data/movies';
import { Story, Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { MoviesAndGenres } from './FlowerGraph.stories';
import data from './../test-data/movies';
import { config, Spring } from 'react-spring/renderprops';

export default {
  component: MoviesAndGenres,
  title: 'FlowerGraph / Animation',
} as Meta;

export const WithSpringAnimation2: Story<GraphProps<Movie>> = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Spring
        from={{
          innerCircleR: 0,
          rotation: 0,
          innerCircleRotation: 0,
          radius: -60,
          radianOffset: -30,
        }}
        to={{
          innerCircleR: 140,
          rotation: 158,
          innerCircleRotation: 243,
          radius: 50,
          radianOffset: 98,
        }}
        config={{ ...config.wobbly, }}
      >
        {({radianOffset, innerCircleR, rotation, radius, innerCircleRotation}) => (
          <Graph
            data={data.filter((d) => d.Genre?.length)}
            labelAccessor={(data) => data.Title}
            typeAccessor={(data) => data.Genre?.split(', ') || []}
            {...{
              innerCircle: { radius: innerCircleR, rotation: innerCircleRotation },
              offFocuseOpacity: 0.1,
              petalsOptions: {
                count: 10,
                radius,
                radianOffset,
                rotation,
                labelLineDistance: 6,
              },
              rootsOptions: {
                spacing: -30
              }
            }}
          />
        )}
      </Spring>
    </div>
  );
};
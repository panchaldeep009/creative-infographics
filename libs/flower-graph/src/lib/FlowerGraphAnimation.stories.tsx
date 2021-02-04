import Graph, { GraphProps } from './Graph';
import { Movie } from './../test-data/movies';
import { Story, Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { MoviesAndGenres } from './FlowerGraph.stories';
import data from './../test-data/movies';
import { config, Spring } from 'react-spring/renderprops'

export default {
  component: MoviesAndGenres,
  title: 'FlowerGraph / Animation'
} as Meta;

export const WithSpringAnimation: Story<GraphProps<Movie>> = () => {
  return <div style={{ height: '100vh'}}>
    <Spring
      from={{ 
        petalRadius: 30,
        innerCircleR: 100,
        radianOffset: 360,
        rotation: 50,
        innerCirRotation: 0,
        labelLineLength: 50,
        labelLineDistance: 60,
      }}
      to={{
        petalRadius: 285,
        innerCircleR: 255,
        radianOffset: 80,
        rotation: -50,
        innerCirRotation: 90,
        labelLineLength: 8,
        labelLineDistance: 4,
      }}
      config={{...config.wobbly}}
    >
      {props => (
        <Graph
          data={data.filter(d => d.Genre?.length)}
          labelAccessor={data => data.Title}
          typeAccessor={data => data.Genre?.split(', ') || []} 
          graphPosition={{
            x: 300,
            y: 670
          }}
          rootsOptions={{
            rootMaxRadius: 10,
          }}
          graphRotation={-180}
          innerCircle={{
            rotation: props.innerCirRotation,
            radianOffset: 85,
            radius: props.innerCircleR,
          }}
          petalsOptions={{
            count: 1,
            radius: props.petalRadius,
            radianOffset: props.radianOffset,
            rotation: props.rotation,
            typeIndicatorRadius: 2,
            labelLineLength: props.labelLineLength,
            labelLineDistance: props.labelLineDistance
          }}
        />
      )}
    </Spring>
  </div>
};
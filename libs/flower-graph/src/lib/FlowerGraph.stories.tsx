import React from 'react';
import { Graph } from './Graph';
import data from './../test-data/movies';

export default {
  component: Graph,
  title: 'FlowerGraph',
};

export const primary = () => {
  return <Graph data={data} labelAccessor={data => data.Title} typeAccessor={data => data.Genre?.split(', ') || []} />;
};

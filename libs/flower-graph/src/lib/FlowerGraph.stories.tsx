import React from 'react';
import { FlowerGraph, FlowerGraphProps } from './FlowerGraph';

export default {
  component: FlowerGraph,
  title: 'FlowerGraph',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: FlowerGraphProps = {};

  return <FlowerGraph />;
};

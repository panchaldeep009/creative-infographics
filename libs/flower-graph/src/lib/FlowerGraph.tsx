import React from 'react';

import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface FlowerGraphProps {}

const StyledFlowerGraph = styled.div`
  color: pink;
`;

export function FlowerGraph(props: FlowerGraphProps) {
  return (
    <StyledFlowerGraph>
      <h1>Welcome to flower-graph!</h1>
    </StyledFlowerGraph>
  );
}

export default FlowerGraph;

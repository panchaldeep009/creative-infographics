import React from 'react';
import { render } from '@testing-library/react';

import FlowerGraph from './FlowerGraph';

describe('FlowerGraph', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FlowerGraph />);
    expect(baseElement).toBeTruthy();
  });
});

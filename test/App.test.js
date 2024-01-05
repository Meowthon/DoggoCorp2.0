import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import App from '../client/App';
// import DogInputPage from '../client/Doggo';

describe('Testing App component', () => {
  describe('Test routes in App', () => {
    test('App should render to screen', () => {
      const { container } = render(<App />);
      expect(container.firstChild).toHaveClass('App');
    });

    test('App should render LandingPage component', async () => {
      const app = render(<App />);
      console.log(await app.findByText('heading'));
      // screen.debug();
      expect(container.secondChild).toHaveClass('LandingPage');
    });
  });
});

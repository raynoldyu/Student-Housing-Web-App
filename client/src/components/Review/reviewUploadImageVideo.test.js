/* eslint-disable testing-library/no-node-access */
import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from './review';

describe('ReviewForm', () => {
  it('allows the user to upload an image or video', () => {
    const {getByRole} = render(
      <ReviewForm index={1} onReviewSaved={jest.fn()} />,
    );

    // Click the button to open the review dialog
    // eslint-disable-next-line testing-library/prefer-screen-queries
    fireEvent.click(getByRole('button', {name: /add a review/i}));

    // Assuming your IconButton that triggers the file input has the aria-label "upload picture"
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const uploadButton = getByRole('button', {name: /upload picture/i});
    fireEvent.click(uploadButton);

    // Since the actual input is hidden, we need to retrieve it differently for the test
    // We get the input by its name attribute if it's unique enough or you can assign and use a test id
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    // Create a dummy file
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    // Dispatch the event to simulate user selecting a file
    fireEvent.change(input, {target: {files: [file]}});

    // Assuming your state or handler adjusts based on the input
    // You would check for those changes here
  });
});

/* eslint-disable testing-library/no-node-access */
import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from './review'; // Path to your ReviewForm component

describe('ReviewForm', () => {
  const mockOnReviewSaved = jest.fn();

  it('should allow entering a review and submitting it', async () => {
    render(<ReviewForm onReviewSaved={mockOnReviewSaved} index={1} />);

    // Open review dialog
    fireEvent.click(screen.getByRole('button', {name: /add a review/i}));

    // Get the rating input and change its value
    const rating = screen.getByLabelText(/Rate this Listing/i);
    fireEvent.mouseOver(rating.firstChild); // mouseover the first star
    fireEvent.click(rating.firstChild); // click the first star

    // Get the feedback textfield and change its value
    const feedbackInput = screen.getByLabelText(/Your Feedback/i);
    fireEvent.change(feedbackInput, {target: {value: 'Great place!'}});

    // Submit the review
    fireEvent.click(screen.getByRole('button', {name: /Submit/i}));
  });

  it('should reset the form when closed', () => {
    render(<ReviewForm onReviewSaved={mockOnReviewSaved} index={1} />);

    // Open review dialog
    fireEvent.click(screen.getByRole('button', {name: /ADD A REVIEW/i}));

    // Close the dialog
    fireEvent.click(screen.getByRole('button', {name: /cancel/i}));
  });
});

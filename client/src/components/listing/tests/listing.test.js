import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Listing from '../listing';

describe('Listing Component', () => {
  it('renders correctly', () => {
    const testListing = {
        postingID: '1',
        Price: '200',
        landlord: 'Ben Fogerty',
        description: 'Great place for students'
    };

    const { getByText, getByAltText } = render(<Listing listing={testListing} />);

    // Check if image renders correctly
    const image = getByAltText('green iguana');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://api.sandbox.game/experiences/09e61e83-ba95-4368-99b5-f5306ae9d13a/versions/18bdcd8d-ae09-4b45-ae53-858c0b553b41/banner');

    // Check if texts render correctly
    expect(getByText(`LandlordID: ${testListing.postingID}`)).toBeInTheDocument();
    expect(getByText(`Price: ${testListing.Price}`)).toBeInTheDocument();
    expect(getByText(`landlord name: ${testListing.landlord}`)).toBeInTheDocument();
    expect(getByText(`description: ${testListing.description}`)).toBeInTheDocument();
  });

});
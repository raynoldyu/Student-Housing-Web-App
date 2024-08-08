describe('Application Pages', () => {
  context('Listing Component', () => {
    it('displays the listing with correct data', () => {
      cy.visit('/');

      // Wait for the image to load with an increased timeout
      cy.get('img[alt="green iguana"]', {timeout: 10000})
        .should('be.visible')
        .and('have.attr', 'src')
        .and('include', '09e61e83-ba95-4368-99b5-f5306ae9d13a');

      cy.get('body').should('contain', 'LandlordID:');
      cy.get('body').should('contain', 'Price:');
      cy.get('body').should('contain', 'landlord name:');
      cy.get('body').should('contain', 'description:');
    });
  });

  describe('SignUp Component', () => {
    beforeEach(() => {
      cy.visit('/signup'); // Adjust the URL based on your app's route for the sign-up page
    });

    it('allows a user to sign up with unique credentials each time', () => {
      // Generate unique data for the test
      const uniqueSuffix = Date.now().toString();
      const uniqueEmail = `john.doe+${uniqueSuffix}@example.com`;
      const uniqueFirstName = `John${uniqueSuffix}`;
      const uniqueLastName = `Doe${uniqueSuffix}`;

      // Mock the `signUp` method from useUserAuth
      cy.intercept('POST', '/api/SignUp', {
        statusCode: 200,
        body: {message: 'Sign Up Successful'},
      }).as('apiSignUp');

      // Fill out the form with unique data
      cy.get('input[name="firstName"]').type(uniqueFirstName);
      cy.get('input[name="lastName"]').type(uniqueLastName);
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type('password123');
      cy.get('input[value="Student"]').check();

      // Click the sign-up button
      cy.get('button[type="submit"]').click();
    });
  });
});

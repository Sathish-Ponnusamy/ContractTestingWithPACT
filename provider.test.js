// 1. Import the Verifier class
const { Verifier } = require('@pact-foundation/pact');
const path = require('path');

describe('Pact Verification', () => {
  it('should validate the expectations of UserClient', () => {
    const opts = {
      // 2. Point to the live Provider API
      providerBaseUrl: 'http://localhost:8080',

      // 3. Define the Consumer's name
      provider: 'UserService',

      // 4. Specify the Pact files to verify (using the local file)
      pactUrls: [path.resolve(process.cwd(), 'pacts', 'userclient-userservice.json')],

      // 5. This is where you set up required state (like creating data in the database)
      stateHandlers: {
        'A user with ID 10 exists': () => {
          // Logic to create a user with ID 10 in your database/service
          console.log('Setting up state: Creating user 10...');
          return Promise.resolve();
        },
      },
      logLevel: 'INFO',
    };

    // 6. Run the verification process
    return new Verifier(opts).verifyProvider().then(() => {
      console.log('Pact verification complete!');
    });
  });
});
//1. Import the necessary tools from the PACT package
const { Pact } = require('@pact-foundation/pact');
const path = require('path');
const axios = require('axios');
const { fetchUser } = require('./user-client'); // Assuming consumer.js contains the fetchUser function

//2. Configure the PACT Mock Service
const provider = new Pact({
  consumer: 'UserClient',   // Name of the consumer application
  provider: 'UserService',   // Name of the provider service
  port: 1234,                // Port for the mock service
  log: path.resolve(process.cwd(), 'logs', 'pact.log'), // Log file path
  dir: path.resolve(process.cwd(), 'pacts'),            // Directory to save pact files
  spec: 2                     // Pact specification version
});

//3. Define the test suite = Expected interaction
describe('UserClient API Pact Test', () => {
  //4. Set up the PACT Mock Service before tests run
  beforeAll(() => provider.setup());

  // Verify the interaction occured
  afterEach(() => provider.verify());

  //5. Tear down the PACT Mock Service after tests complete
  afterAll(() => provider.finalize());

  it('gets a user by ID', async () => {
    // A. Define the expected request
    const expectedRequest = {
        method: 'GET',  // HTTP method
        path: '/users/10', // Endpoint path
    };
    
    // B. Define the expected response 
    const expectedResponse = {
        status: 200, // HTTP status code
        body: {
            id: 10,
            firstname: 'Example',
            lastname: 'User'
        },
    };

    // C. Set up the interaction in the PACT Mock Service
    await provider.addInteraction({
      state: 'A user with ID 10 exists', // The Precondition for the test
        uponReceiving: 'a request to get a user by ID',
        withRequest: expectedRequest,
        willRespondWith: expectedResponse, // Description of the request
    });

    // D. Execute the consumer function that makes the HTTP request
    const user = await fetchUser(provider.mockService.baseUrl,10); // Assuming fetchUser is the function that makes the GET request
    // E. Assert that the response matches the expected data
    expect(user.id).toEqual(10);
    expect(user.firstname).toEqual('Example');
    expect(user.lastname).toEqual('User');
  });
});
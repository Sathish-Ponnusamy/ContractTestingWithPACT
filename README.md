
How to run:
command prompt: npm start => To start the server http://localhost:8080/
command prompt: npm run pact:consumer:test => To run the pact consumer test
command prompt: npm run pact:provider:test => To run the pact provider test

The architecture and map the components directly to the files and syntax we used, incorporating the specific API details for the UserClient and UserService.

🏗️ Contract Testing Architecture and File BreakdownThe architecture is Consumer-Driven Contract (CDC) Testing using the Pact framework. It uses three logical components that map to your files:Architectural ComponentFile NameRole in the WorkflowConsumer Client Codeuser-client.jsThe actual business logic that makes the API call.Consumer Contract Testconsumer.test.jsDefines the expected API response and generates the Pact Contract.Pact Contractuserclient-userservice.jsonThe JSON agreement between the two services.Provider API Serverserver.jsThe live service being verified.Provider Verification Testprovider.test.jsReads the contract and verifies the live Provider against it.

1. 🧑‍💻 The Consumer Side: Defining the ContractThe Consumer side is responsible for defining the contract and generating the Pact file.A. Consumer Client Code (user-client.js)This file contains the actual code your application uses to talk to the API.Code SectionPurposeconst axios = require('axios');Imports the library used to make HTTP requests.async function fetchUser(baseURL, userId)The core function that makes the GET request.const url = \${baseURL}/users/${userId}`;`API Detail: Defines the endpoint structure /users/{id}.B. Consumer Contract Test (consumer.test.js)This file contains the logic that uses Pact's Mock Service to generate the contract.Code SectionPurposeconst provider = new Pact({...})Configuration: Defines the Consumer Name (UserClient), Provider Name (UserService), and the Mock Service Port (1234).beforeAll(() => provider.setup());Action: Starts the local Mock Service on port 1234.provider.addInteraction({...})Contract Definition (Crucial!): This section dictates the contract.state: 'A user with ID 10 exists'API Detail: The required Pre-condition for the test.withRequest: { method: 'GET', path: '/users/10' }API Detail: The exact Request the Consumer makes.willRespondWith: { status: 200, body: {id: 10, firstname: 'Example', lastname: 'User'} }API Detail: The exact Expected Response (status code and schema).const user = await fetchUser(provider.mockService.baseUrl, 10);Test Execution: Calls the client code, which hits the Mock Service on port 1234.expect(user.firstname).toEqual('Example');Client Logic Test: Asserts that the client can correctly process the expected response.afterAll(() => provider.finalize());Output: Shuts down the Mock Service and writes the userclient-userservice.json Pact File.

2. 🔌 The Provider Side: Verifying the ContractThe Provider side ensures the live API adheres to the generated contract.

A. Provider API Server (server.js)
This file contains the actual API logic that must satisfy the contract.Code SectionPurposeapp.get('/users/:id', ...)API 
Implementation: Defines the route.res.status(200).json({...})
API Detail: Returns the JSON response. This must match the schema defined in the contract exactly.
FIX APPLIED:The fields firstname and lastname must match the lowercase keys defined by the Consumer.

B. Provider Verification Test (provider.test.js)

This file orchestrates the verification against the live server.Code SectionPurposeconst { Verifier } = require('@pact-foundation/pact');

Imports the tool to run the verification.providerBaseUrl: 'http://localhost:8080'Provider Location: Specifies the exact location of the running live API.pactUrls: [...]

Contract Input: Tells the Verifier which Pact file(s) to read.stateHandlers: {...}State Setup: Runs code specific to the pre-condition requested by the Consumer ('A user with ID 10 exists'). 

In a real scenario, this would create the necessary test data in the database before the API is called.new Verifier(opts).verifyProvider()

Verification Action:

1. Reads the Pact File.

2. Calls the State Handler.

3. Makes the real GET /users/10 request to http://localhost:8080.

4. Compares the actual response from the server to the expected response in the Pact File.



📐 Summary of the Contract Testing Workflow

The architecture is a loop ensuring consistency:Consumer defines expectation $\rightarrow$ Pact File is created.Provider reads Pact File $\rightarrow$ Verifies its live API against the expectations.If successful, the Consumer knows the API is what they need, and the Provider knows they won't break the Consumer upon deployment.
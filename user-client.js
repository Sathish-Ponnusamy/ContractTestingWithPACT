// user-client.js
const axios = require('axios'); 
// You need to install axios: npm install axios

/**
 * Fetches user data from the API.
 * @param {string} baseURL - The base URL of the API (will be the mock server URL during testing).
 * @param {number} userId - The ID of the user to fetch.
 */
async function fetchUser(baseURL, userId) {
  const url = `${baseURL}/users/${userId}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    // Handle error if the mock server returns a non-200 status 
    // (e.g., if you test for a 404 response).
    throw error;
  }
}

module.exports = {
  fetchUser,
};
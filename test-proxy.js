const { fetch, ProxyAgent } = require('undici');

const proxyUrl = 'http://127.0.0.1:10808'; // Using the known proxy URL
const targetUrl = 'https://api.github.com/zen'; // A simple GitHub API endpoint

console.log(`Attempting to fetch ${targetUrl} through proxy: ${proxyUrl}`);

async function testProxy() {
  try {
    const response = await fetch(targetUrl, {
      dispatcher: new ProxyAgent(proxyUrl),
      // Adding a shorter timeout to fail faster for the test
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    console.log('Status:', response.status);
    const body = await response.text();
    console.log('Body:', body);
    console.log('\nSUCCESS: The proxy connection from Node.js seems to be working.');

  } catch (error) {
    console.error('\nERROR: The proxy connection from Node.js failed.');
    console.error('Details:', error);
  }
}

testProxy();


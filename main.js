import fs from 'fs';

async function getResponse(address) {
  try {
    let response = await fetch(`https://airdrop.pyth.network/api/grant/v1/evm_breakdown?identity=${address}`);
    if (response.ok) {
      let data = await response.json();
      return data;
    } else {
      throw new Error(`Request for address ${address} failed with status: ${response.status}`);
    }
  } catch (error) {
    return null; // Handle the error as needed
  }
}

async function fetchDataForAddresses() {
  const addresses = fs.readFileSync('wallets.txt', 'utf-8').split('\n');

  for (const address of addresses) {
    const data = await getResponse(address);
    if (data !== null) {
      console.log(`Data for address ${address}:`, data);

      if (!fs.existsSync('Eligible.txt')) {
        // Create the 'Eligible.txt' file and write the first address
        fs.writeFileSync('Eligible.txt', address + '\n');
      } else {
        // Append the address to 'Eligible.txt' with a new line
        fs.appendFileSync('Eligible.txt', address + '\n');
      }
    } else {
      continue;
    }
  }
}

fetchDataForAddresses();

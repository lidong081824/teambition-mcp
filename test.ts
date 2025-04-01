async function tryApi() {
  // AccessToken
  const headers = {}

  try {
    const response = await fetch('https://open.teambition.com/api/v3/usertasks/search?pageSize=10&roleTypes=creator%2Cexecutor%2CinvolveMember', { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res = await response.json()
    console.log(res)
    return res;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

tryApi()

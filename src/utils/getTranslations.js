
export const translate = async (fetchWithTimeout, options) => {

  let error = null;
  let result;
  try {
    const translateResponse = await fetchWithTimeout(`${process.env.CORE_API_URL}v1/translate`, {
      method: 'POST',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': process.env.CORE_API_KEY
      },

      body: JSON.stringify(options)
    });

    console.log("TRANSLATE", translateResponse);
    if (translateResponse.ok) {
      result = await translateResponse.json();
    } else {
      const err = await translateResponse.text();
      console.error("RESPONSE ERROR ", err);
      error = Error(translateResponse.statusText, {
        cause: { code: translateResponse.status, info: err },
      });
    }

  } catch (err) {

    console.error(err);
    let errorName = err.name;
    if (err.name === "AbortError") {
      errorName = "Timeout"
      error = Error(errorName, {
        name: err.name,
        cause: { code: 500, info: err },
      });
    }
  }
  // console.log("EXAMPLE RES END ", result);
  return { error, translations: result };
}


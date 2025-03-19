
export const clientInit = async (fetchWithTimeout, options) => {
  //sessionID, knowledgebaseId, lang
  options.appId = process.env.NEXT_PUBLIC_APP_ID
  let initResponse;
  let error = null;
  let result;
  try {

    //NEXT_PUBLIC_APP_ID
    // requestBody supports OPENAI_API_KEY option too.. but then better create proxy api otherwise secret is visible...  
    // const requestBody = { sessionID, knowledgebaseId, sourceLng: EVALS.contentLng, targetLng: lang }
    const requestBody = options;
    // ${process.env.MIDDLEWARE_API_URL}v2/init
    initResponse = await fetchWithTimeout(`${process.env.CORE_API_URL}v1/twin/init`, {
      method: 'POST',
      timeout: 25000,
      headers: {
        // 'Cache-Control': 'no-cache', ... Access to fetch at 'http://localhost:3330/api/v1/init' from origin 'http://localhost:3332' has been blocked by CORS policy: Request header field cache-control is not allowed by Access-Control-Allow-Headers in preflight response.
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': process.env.CORE_API_KEY
      },

      body: JSON.stringify(requestBody)
    });

    console.log("INIT", initResponse);
    if (initResponse.ok) {
      result = await initResponse.json();
    } else {
      const err = await initResponse.text();
      console.error("RESPONSE ERROR ", err);
      error = Error(initResponse.statusText, {
        cause: { code: initResponse.status, info: err },
      });
    }

  } catch (err) {

    console.error(err);
    let errorName = err.name;
    if (err.name === "AbortError") {
      errorName = "AI Timeout"
      error = Error(errorName, {
        name: err.name,
        cause: { code: 500, info: err },
      });
    }
  }
  // console.log("EXAMPLE RES END ", result);
  return { error, data: result };
}


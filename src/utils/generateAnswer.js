import { fetchWithTimeout } from "@/utils";
//import { remark } from "remark";
//import strip from 'strip-markdown'
import { marked } from 'marked';

function customDeserialize(str) {
  // console.log("DESERIALIZE ", str);
  const obj = {};
  str.split(';').forEach(pair => {
    const [key, value] = pair.split('=');
    try {
      // Decode each part safely
      obj[decodeURIComponent(key)] = decodeURIComponent(value);
    } catch (e) {
      console.error("Failed to decode URI component", e);
      // Handle or log the error, or assign a default value
      obj[key] = value; // Optionally keep the original undecoded value
    }
  });
  return obj;
}

/* 
function customDeserialize(str) {
  console.log("DESERIALIZE ", str);
  //text=%20around;finish_reason=null
  const obj = {};
  str.split(';').forEach(pair => {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    obj[key] = value;
  });
  return obj;
} */

export const getStreamAnswer = async (data, chatId, update = false) => {

  // Set options for marked
  marked.use({
    "async": false,
    "breaks": true,
    "extensions": null,
    "gfm": true,
    "hooks": null,
    "pedantic": false,
    "silent": false,
    "tokenizer": null,
    "walkTokens": null
  });

  //console.log("STREAM ", data);
  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;
  if (!update) {
    document.getElementById(chatId).querySelector('.dots').style.display = "none";
  }
  const element = document.getElementById(chatId).querySelector('.question-answer');
  console.log("ELEMENT FOUND ", element, new Date().toISOString());
  if (update) {
    element.innerHTML += " ";
  }

  let answer = "";
  let finish_reason = null;
  //let count = 0;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    // count++;
    console.log("STREAM VALUE ", decoder.decode(value));
    /*
   STREAM VALUE  text=-;finish_reason=null
text=%20Outdoor;finish_reason=null
text=%20activities;finish_reason=null
    */

    let chunkValue = decoder.decode(value);
    if (value !== "") {
      const chunks = chunkValue.split('\n');
      if (chunks.length > 0) {
        //console.log("CHUNKS ", chunks);

        const deserialized = chunks.filter(c => c !== "").map(chunk => JSON.stringify(customDeserialize(chunk))).map(str => JSON.parse(str));
        //console.log(deserialized, deserialized.length);
        if (deserialized.length > 0) {
          chunkValue = "";
          deserialized.forEach(c => {
            finish_reason = c.finish_reason;
            if (c.text !== undefined) {
              chunkValue += c.text;
            }
          })
        }

      }
      // finish_reason = chunk.finish_reason;
      // streamValue = chunk.text;
    }

    //const chunkValue = decoder.decode(streamValue);
    //const text = chunkValue.replaceAll("\n", "<br/>");
    const text = answer + chunkValue;
    //element.innerHTML += text;
    //element.innerHTML += marked(chunkValue);
    //console.log("TEXT ", text);
    element.innerHTML = await marked.parse(text);
    //element.innerHTML += chunkValue;

    const scrollHere = document.getElementById("scroll-marker");
    scrollHere.scrollIntoView(true, { behavior: "smooth", block: "end", inline: "nearest" });
    answer += chunkValue;
  }

  // console.log("COUNT ", count);
  //const stripped = await remark().use(strip, { keep: ['html'] }).process(answer);
  //const stripped = await remark().use(strip).process(answer);
  /*  const stripped = await remark()
     .use(retainLineBreaks) // Use the custom plugin first to handle line breaks
     .use(strip)            // Then use strip-markdown
     .process(answer); */

  // console.log("STRIPPED ", stripped.toString());

  console.log("STREAM RESPONSE ", answer, finish_reason, new Date().toISOString());
  //return Promise.resolve({ answer: stripped.toString().replace(/###/g, ''), finish_reason });
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  //answer = answer.replaceAll("<br/>", "\n");
  //console.log("STREAM RESPONSE2 ", answer, finish_reason, new Date().toISOString());

  return Promise.resolve({ answer, finish_reason });
}


export const makeRequest = async (requestOptions, url) => {

  let requestResponse = undefined;
  try {
    //requestResponse = await fetchWithTimeout(`${url}/generate`, requestOptions);
    //  requestResponse = await fetchWithTimeout(`${process.env.MIDDLEWARE_API_URL}v2/generate`, requestOptions);
    requestResponse = await fetchWithTimeout(`/api/v1/get-answer`, requestOptions);

  } catch (err) {
    console.log("OPENAI ERROR ", err);
    console.error(err);
    let error;
    let errorName = err.name;
    if (err.name === "AbortError") {
      errorName = "OPENAI Timeout"
      error = Error(errorName, {
        name: errorName,
        cause: { code: 500, info: err },
      });
    } else {

      const requestErr = await requestResponse.text()
      error = Error(requestResponse.statusText, {
        cause: { code: requestResponse.status, info: requestErr },
      });
    }

    return { error };
  }
  if (!requestResponse.ok) {
    console.log("ERROR ", requestResponse);

    const error = Error(requestResponse.statusText, {
      cause: { code: requestResponse.status, info: await requestResponse.json() },
    });

    return { error }
  }

  // Parse the response body content (you can use json, text, etc.)
  let data;
  try {
    //console.log("REQ ", requestOptions);
    const reqOpts = JSON.parse(requestOptions.body);
    if (reqOpts?.stream && reqOpts.stream === true) {
      data = requestResponse.body;
    } else {
      // Assuming JSON response, modify to 'text()' if it's a plain text response
      data = await requestResponse.json();
    }

  } catch (err) {
    console.log("Error parsing response body: ", err);
    return { error: new Error("Response parsing failed", { cause: err }) };
  }

  return { error: null, data };

  //const data = requestResponse.body;
  return { error: null, data };

}

export const getDetails = async ({ url, requestId, sessionId }) => {

  // proxy api, which outputs info to app logs. 
  const detailsRequest = await fetch(`${url}/get-details?requestId=${requestId}&sessionId=${sessionId}`, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' })
  });

  let details = {};
  if (detailsRequest.ok) {
    details = await detailsRequest.json();
  }

  return Promise.resolve(details);
}
export const getData = async (
  entry,
  { scoreLimit, sessionId, defaultModel, userId, chatId,
    url, appId,
    userLanguage,
    exampleClick, msgIdx },
  knowledgebaseId,
  requestId,
  debugOption = false
) => {
  /* 
  locale:navigator.language || navigator.userLanguage,
  timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
  offset:new Date().getTimezoneOffset(),
 */
  if (debugOption)
    console.log(
      "GET DATA ",
      scoreLimit,
      knowledgebaseId,
      defaultModel,
      sessionId
    );

  //const { topK = 10, scoreLimit = 0.4, markdown = false, max_tokens, temperature, statement,
  // previousContext, knowledgebaseId, userId, OPENAI_API_KEY, history = [], lastEntry } = body;

  const requestBody = {
    statement: entry,
    knowledgebaseId,
    scoreLimit,
    userId,
    requestId,
    debug: debugOption,
    userLanguage,
    stream: true,
    msgIdx,
    sessionId,
    networkId: process.env.NEXT_PUBLIC_NETWORK_ID,
    appId, localize: {}
  };

  const now = new Date();
  const january = new Date(now.getFullYear(), 0, 1);
  const dst = now.getTimezoneOffset() < january.getTimezoneOffset();

  //console.log("Is DST Currently Active?", isCurrentlyInDST());
  const offsetMinutes = now.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;
  const sign = offsetMinutes > 0 ? "-" : "+";

  const gmtOffset = `GMT${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;


  requestBody.localize = {
    locale: navigator.language || navigator.userLanguage,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: offsetMinutes,
    currentTime: now.toISOString(),
    dst,
    gmtOffset
  }
  // locale:navigator.language || navigator.userLanguage,
  //     timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
  //     offset:new Date().getTimezoneOffset(),


  const startTime = new Date().getTime();
  const { error, data } = await makeRequest(
    {
      method: "POST",
      timeout: 42000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (error) {
    return { error };
  }

  //console.log("HEADERS ", sentMessages);
  if (!data) {
    return;
  }

  console.log("ELAPSED TIME ", (new Date().getTime() - startTime) / 1000);

  const streamResults = getStreamAnswer(data, chatId);
  //  const detailsResults = getDetails({ url, requestId, sessionId: sessionID });
  const results = await Promise.all([streamResults]);

  //  const detailsResults = await getDetails({ url, requestId, sessionId: sessionID });
  // console.log("DETAILS RESULTS", detailsResults);

  // normal finish reason is "stop"

  console.log("ANSWER RESULTS", results);
  return {
    error: null, results: {
      answer: results[0].answer, finish_reason: results[0].finish_reason,
    }
  };


};

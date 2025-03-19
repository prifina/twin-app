import NextCors from 'nextjs-cors';
import { XMLParser } from "fast-xml-parser";

async function getRequest(payload) {

  //`${process.env.MIDDLEWARE_API_URL}v2/get-user?userId=${user}`,
  //`${process.env.SENTENCE_EXTRACT_URL}`,
  //console.log("PAYLOAD", payload, `${process.env.MIDDLEWARE_API_URL}v2/sentence-extract}`);
  ///api/v2/sentence-extract
  //http://localhost:3330/api/v2/sentence-extract
  // console.log("SENTENCE EXTRACT URL", `${process.env.MIDDLEWARE_API_URL}v2/sentence-extract`);
  //${process.env.CORE_API_URL}v1/translate
  const requestResponse = await fetch(
    `${process.env.CORE_API_URL}v1/detect`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "APP-REQUEST",
        'x-api-key': process.env.CORE_API_KEY
      },
      body: JSON.stringify(payload),
    }
  );

  if (!requestResponse.ok) {
    let errMsg = "HTTP error! Status: " + requestResponse.status;
    try {
      const errorBody = await requestResponse.json();
      if (errorBody?.["error"] !== undefined) {
        errMsg += "; " + JSON.stringify(errorBody.error);
      } else {
        errMsg += "; " + JSON.stringify(errorBody);
      }
    } catch (jsonError) {
      // If error response isn't JSON or couldn't be parsed, include the original status text
      errMsg += "; " + requestResponse.statusText;
    }
    throw new Error(errMsg);
  }

  return await requestResponse.json();
}

function checkMetaData(meta) {
  try {
    let metaData = JSON.parse(meta);
    //console.log("META DATA ", metaData);
    let addons = [];
    if (metaData.addons.length > 0) {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        attributesGroupName: "@_",
        allowBooleanAttributes: true
      });
      addons = metaData.addons.map(addon => parser.parse(addon));
      // console.log("JSON ", jsonObj);
      metaData.addons = addons;
    }

    // console.log("ADDONS ", JSON.stringify(addons, true, 2));

    return metaData;
  } catch (error) {
    console.log("ERROR ", error);
    return {}
  }
}

export default async function handler(req, res) {

  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });


  if (req.method !== "GET") {
    return res.status(404).json({ error: 'Invalid method, only GET allowed!' });
    // //return;
    // return new Response(JSON.stringify({ error: 'Invalid method, only GET allowed!' }), {
    //   status: 404,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // })
  }


  //const buddyId = req.nextUrl.searchParams.get("buddyId");
  const requestId = req.query.requestId;
  //const sessionId = req.query.sessionId;

  if (requestId == null) {
    return res.status(400).json({ error: "Query option requestId is missing" });
  }
  try {
    // {"requestId":"d7bb8aa7-17d8-438e-a558-0d74019e78fe","cache":true,"sessionId":"id-1728548729464-d73bccd83c73f"}
    const requestDetails = await getRequest({
      requestId,
      //  sessionId,
      cache: true
    });

    if (requestDetails?.result === undefined || requestDetails.result?.chunks === undefined) {
      return res.status(200).json({ response: {} });
    }

    //const scores = chunks.flat().map(item => { return { source: item.source, score: item.score } });
    const metaDataList = requestDetails.result.chunks.flat().map((chunk) => {
      return checkMetaData(chunk.metadata);
    });

    // console.log("META DATA ", metaDataList);


    res.status(200).json({ response: { ...requestDetails.result, metadata: metaDataList } });
  } catch (err) {
    // promise rejects will be captured here... 
    console.log("Error", err);
    return res.status(500).json({ error: err });
  }


}

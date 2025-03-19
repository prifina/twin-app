import crypto from 'crypto';

import { footerText } from '@/appConfig';

// Convert base64url to base64 and decode to UTF-8
function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  return Buffer.from(paddedBase64, 'base64').toString('utf-8');
}

// Convert base64url secret to raw bytes (Buffer in Node.js)
function base64ToBuffer(base64) {
  const base64Standard = base64.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64Standard, 'base64');
  // Buffer.from(base64String, 'base64').toString('utf-8');

}

// Verify JWT using HMAC SHA-256
function verifyJwt(token, base64Secret) {
  // Split the token into header, payload, and signature
  const [headerB64, payloadB64, signatureB64] = token.split('.');

  if (!headerB64 || !payloadB64 || !signatureB64) {
    console.log("Invalid token structure.");
    return null;
  }

  // Decode header and payload
  const header = JSON.parse(base64UrlDecode(headerB64));
  const payload = JSON.parse(base64UrlDecode(payloadB64));

  // Recreate the signature
  const data = `${headerB64}.${payloadB64}`;
  const secretKey = base64ToBuffer(base64Secret);

  // Debugging logs for better insights
  // console.log("Data to sign:", data);
  // console.log("Secret Key (Buffer):", secretKey.toString('hex'));

  // Create an HMAC SHA-256 signature
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);
  const expectedSignature = hmac.digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // Convert to base64url

  // Debugging output for signature comparison
  // console.log("Expected Signature (base64url):", expectedSignature);
  // console.log("Provided Signature (base64url):", signatureB64);

  // Verify the signature matches the token's signature
  const isValid = expectedSignature === signatureB64;
  // console.log("isValid:", isValid);
  console.log("payload:", header, payload);

  return isValid ? { header, payload } : null;
}

async function getUser(user) {
  // `${process.env.MIDDLEWARE_API_URL}v2/get-user?userId=${user}`,
  const requestResponse = await fetch(
    `${process.env.CORE_API_URL}v1/twin/get-user?userId=${user}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "APP-REQUEST",
        'x-api-key': process.env.CORE_API_KEY
      }
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


export default async function handler(req, res) {


  //const { summary, tokens } = req.body;
  //const body = await req.json();
  const body = req.body;
  console.log("NAV API BODY ", body);

  try {
    //const name = body.currentUrl.split("/").pop();

    const debug = body.debug || false;
    const url = new URL(body.currentUrl);
    const name = url.pathname.substring(1);
    const q = url.searchParams.get("q");
    const target = url.searchParams.get("target");
    let token = url.searchParams.get("token");

    let stat = url.searchParams.get("via") || 'default';

    console.log("NAME ", name,);
    let data = {};

    const user = await getUser(name);
    if (user.response?.['userId'] === undefined) {
      //return new Response(JSON.stringify({ message: `Unknown ${name}` }), { status: 400 });
      return res.status(400).json({ message: `Unknown ${name}`, code: "Unknown" });
    } else {
      if (debug) {
        data = user.response;
      } else {
        const selectedAttrs = ['mimeType', 'title', 'description', 'caption', 'userId', 'knowledgebaseId', 'active', 'name',
          'disclaimerText', 'exampleQuestions', 'noOfExampleQuestions', 'ownerId', 'typeOfExampleQuestions', 'addBadge', 'twinStatus', 'footer', 'hideFooter', 'authRequired', 'authRedirect'

        ];
        data = Object.keys(user.response).filter(key => selectedAttrs.includes(key)).reduce((obj, key) => {
          obj[key] = user.response[key];
          return obj;
        }, {});

      }

    }


    const fileExtension = data.mimeType.split('/')[1];
    const avatarUrl = `https://s3.${process.env.MY_REGION}.amazonaws.com/${process.env.SPEAK_TO_CDN}/avatars/${name}.${fileExtension}`;
    // const response = await fetch(avatarUrl); // Fetch the image data from the public URL
    // const buffer = await response.arrayBuffer(); // Convert the response to an arrayBuffer
    // const base64 = Buffer.from(buffer).toString('base64'); // Convert buffer to base64 string
    // const mimeType = response.headers.get("content-type"); // Get the image MIME type
    // const base64Image = `data:${data.mimeType};base64,${base64}`;
    data['avatar-url'] = avatarUrl;
    // data['avatar'] = base64Image;

    if (data?.addBadge === undefined) {
      data['addBadge'] = false;
    }

    if (data?.twinStatus === undefined) {
      data['twinStatus'] = 0;
    }

    if (data?.footer === undefined) {
      data['footer'] = footerText;
    }
    if (data?.hideFooter === undefined) {
      data['hideFooter'] = false;
    }
    if (data?.authRequired === undefined) {
      data['authRequired'] = false;
    }

    console.log("DATA ", data);

    if (data.authRequired) {
      //console.log("AUTH TOKEN ", token);
      if (token === undefined || token === "" || token === null) {
        return res.status(400).json({ message: `Invalid token`, code: "TokenRequired", auth: { authRequired: data.authRequired, authRedirect: data.authRedirect } });
      }
      const tokenCheck = verifyJwt(token, process.env.JWT_SECRET_BASE64);
      console.log("TOKEN CHECK ", tokenCheck);
      if (tokenCheck.payload.twin !== name) {
        token = "";
        return res.status(400).json({ message: `Invalid token`, code: "InvalidTwin", auth: { authRequired: data.authRequired, authRedirect: data.authRedirect } });
      }
      if (tokenCheck.payload.expire < Date.now()) {
        token = "";
        return res.status(400).json({ message: `Invalid token`, code: "TokenExpired", auth: { authRequired: data.authRequired, authRedirect: data.authRedirect } });
      }

    }

    /*  if (data.mimeType !== undefined) {
 
       const fileExtension = data.mimeType.split('/')[1];
       //https://s3.amazonaws.com/cdn.speak-to.ai/avatars/tero1.png
 
       //MY_REGION=eu-west-1
       data['avatar-url'] = `https://s3.${process.env.MY_REGION}.amazonaws.com/${process.env.SPEAK_TO_CDN}/avatars/${name}.${fileExtension}`;
       data['avatar'] = await getBase64Image(name, data.mimeType);
     } 
      */
    /* else {
      await saveBase64Image(data.avatar, name);

      const mimeType = data['avatar'].match(/data:(.*);base64/)[1];
      const fileExtension = mimeType.split('/')[1];
      data['avatar-url'] = `https://s3.${process.env.MY_REGION}.amazonaws.com/${process.env.SPEAK_TO_CDN}/avatars/${name}.${fileExtension}`;
    } */
    // return new Response(JSON.stringify({ result: { ...data, name } }), { status: 200 });
    return res.status(200).json({ result: { ...data, name, token, query: { q, target }, stat } });
  } catch (err) {
    // promise rejects will be captured here... 
    console.log("Error", err);
    // return new Response(JSON.stringify({ error: err }), { status: 500 });

    // console.log(err.name);    // Logs "TypeError"
    // console.log(err.message); // Logs "Invalid type provided"
    // console.log(err.stack);   // Logs the stack trace


    return res.status(500).json({ error: { message: err.message, code: err.name } });
  }

}


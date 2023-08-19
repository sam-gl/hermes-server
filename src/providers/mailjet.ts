import { Buffer } from 'node:buffer';

const { MAIL_PROVIDER_API_KEY, MAIL_PROVIDER_API_SECRET, MAIL_PROVIDER_API_URL } = process.env;
const creds = Buffer.from(`${MAIL_PROVIDER_API_KEY}:${MAIL_PROVIDER_API_SECRET}`, 'utf8').toString('base64');

const addEmail = async (email: string) => {
  const url = `${MAIL_PROVIDER_API_URL}/contact`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Authorization": `Basic ${creds}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "IsExcludedFromCampaigns": "true",
        "Email": email
      })
    });

    return response.json();
  } catch(e) {
    console.error(`Error making request to ${url}`, e);
  }
};

const sendVerificationEmail = async(email: string, verificationCode: string) => {
  const url = `${MAIL_PROVIDER_API_URL}/send`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Authorization": `Basic ${creds}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "Messages":[
          {
              "From": {
                  "Email": "",
                  "Name": "Sam"
              },
              "To": [
                  {
                      "Email": email
                  }
              ],
              "Subject": "Verify your newsletter subscription",
              "TextPart": "Hello and welcome to the newsletter, thank you for joining us! Verify your subscription here: ",
              "HTMLPart": "Hello and welcome to the newsletter, thank you for joining us! Verify your subscription here: <a>link</a>"
          }
        ]
      })
    });

    return response.json();
  } catch(e) {
    console.error(`Error making request to ${url}`, e);
  }
};



export { addEmail, sendVerificationEmail };
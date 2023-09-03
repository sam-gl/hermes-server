import { Buffer } from "node:buffer";

const {
  MAIL_PROVIDER_API_KEY,
  MAIL_PROVIDER_API_SECRET,
  MAIL_PROVIDER_FROM_ADDRESS,
  MAIL_PROVIDER_FROM_NAME
} = process.env;
const creds = Buffer.from(
  `${MAIL_PROVIDER_API_KEY}:${MAIL_PROVIDER_API_SECRET}`,
  "utf8"
).toString("base64");

const MAIL_PROVIDER_API_URL = "https://api.mailjet.com/v3";

const addEmail = async (email: string) => {
  const url = `${MAIL_PROVIDER_API_URL}/REST/contact`;
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        IsExcludedFromCampaigns: "true",
        Email: email
      })
    });

    return response.json();
  } catch (e) {
    console.error(`Error making request to ${url}`, e);
  }
};

const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  const url = `${MAIL_PROVIDER_API_URL}/send`;
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        FromEmail: MAIL_PROVIDER_FROM_ADDRESS,
        FromName: MAIL_PROVIDER_FROM_NAME,
        Subject: "Verify your newsletter subscription",
        "Text-part": `Hello and welcome to the newsletter, thank you for joining us! Verify your subscription here: ${process.env.HERMES_URL}/subscribe/verify?code=${verificationCode}`,
        "Html-part": `Hello and welcome to the newsletter, thank you for joining us! Verify your subscription <a href="${process.env.HERMES_URL}/subscribe/verify?code=${verificationCode}" target="_blank">here</a>. <br><br>If the link above doesn't work, copy and paste this in a new tab: ${process.env.HERMES_URL}/subscribe/verify?code=${verificationCode}`,
        Recipients: [{ Email: email }]
      })
    });

    return response.json();
  } catch (e) {
    console.error(`Error making request to ${url}`, e);
  }
};

const verifyEmail = async (email: string) => {
  const url = `${MAIL_PROVIDER_API_URL}/REST/contact/${encodeURIComponent(
    email
  )}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        IsExcludedFromCampaigns: "false"
      })
    });

    return response.json();
  } catch (e) {
    console.error(`Error making request to ${url}`, e);
  }
};

enum ManageSubscriptionAction {
  Subscribe = "addforce",
  Unsubscribe = "remove"
}

const manageSubscription = async (
  action: ManageSubscriptionAction,
  mailingListID: string,
  email: string
) => {
  const url = `${MAIL_PROVIDER_API_URL}/REST/contact/${encodeURIComponent(
    email
  )}/managecontactslists`;

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ContactsLists: [
          {
            Action: action,
            ListID: mailingListID
          }
        ]
      })
    });

    return response.json();
  } catch (e) {
    console.error(`Error making request to ${url}`, e);
  }
};

const subscribe = async (mailingListID: string, email: string) => {
  return manageSubscription(
    ManageSubscriptionAction.Subscribe,
    mailingListID,
    email
  );
};

const unsubscribe = async (mailingListID: string, email: string) => {
  return manageSubscription(
    ManageSubscriptionAction.Unsubscribe,
    mailingListID,
    email
  );
};

const getUser = async (email: string) => {
  try {
    const response = await fetch(
      `${MAIL_PROVIDER_API_URL}/REST/contact/${encodeURIComponent(email)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Basic ${creds}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.json();
  } catch (e) {
    console.error(`Error making request to ${MAIL_PROVIDER_API_URL}`, e);
  }
};

const removeUser = async (email: string) => {
  // For some reason, the deletion API for Mailjet is under /v4 rather
  // than /v3 - which everything else is under.
  const user = await getUser(email);
  console.log("user:", user);
  if (!user || user.Count !== 1)
    throw new Error(`Couldn't get user for ${email}:`, user);

  const MAIL_PROVIDER_DELETION_API_URL = `https://api.mailjet.com/v4/contacts/${user.Data[0].ID}`;
  console.log("MAIL_PROVIDER_DELETION_API_URL", MAIL_PROVIDER_DELETION_API_URL);
  try {
    const response = await fetch(MAIL_PROVIDER_DELETION_API_URL, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Response", response);

    return response.status === 200;
  } catch (e) {
    console.error(
      `Error making request to ${MAIL_PROVIDER_DELETION_API_URL}`,
      e
    );
  }
};

export {
  addEmail,
  sendVerificationEmail,
  verifyEmail,
  subscribe,
  unsubscribe,
  removeUser
};

# Hermes Server

This is the backend server for Hermes - the counterpart to [Hermes React](https://github.com/sam-gl/hermes-react). Own your mailing lists on your own server and use third-party mailing providers to send the emails.

It accepts and stores email addresses POSTed to it and does a number of other things:
- Anti-spam/bot protection
- Rate limiting and extra security with [Helmet](https://github.com/helmetjs/helmet)
- Hosted mailing list management pages (view, change & cancel subscriptions)
- Sends emails to a configured third-party email service like Mailchimp or Mailjet.
- Define multiple mailing lists that people can subscribe to.

## Why?
- Subscribe widgets are bad, poorly customisable and don't integrate well into your website/app. Hermes does.
- You don't own your email list, the provider does. Save, analyse and move your email list to any provider or even send the mail yourself.
- Host your own mailing list management pages allowing maximum customisation.

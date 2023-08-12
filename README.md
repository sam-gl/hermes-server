# Hermes Server

This is the backend server for Hermes - the counterpart to [Hermes React](https://github.com/sam-gl/hermes-react). Own your mailing lists on your own server and use third-party mailing providers to send the emails.

It accepts and stores email addresses POSTed to it and does a number of other things:
- Anti-spam/bot protection
- Rate limiting and extra security with [Helmet](https://github.com/helmetjs/helmet)
- Hosted mailing list management pages (view, change & cancel subscriptions)
- Sends emails to a configured third-party email service like Mailchimp or Mailgun.
- Define multiple mailing lists that people can subscribe to
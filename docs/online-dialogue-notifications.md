# Online dialogue email notifications

This workflow is intentionally prepared but **not deployed or activated** by this pull request. The homepage keeps its local text-file fallback until an API URL is configured.

## What it does

- Sends a submitted online-dialogue request to the team's private notification email through Resend.
- Uses a Cloudflare Worker so the Resend API key and destination email remain server-side secrets.
- Restricts browser requests to the published GitHub Pages origin.
- Validates fields and payload size, includes a honeypot, and applies an approximate per-IP rate limit (5 requests per 60 seconds per Cloudflare location).
- Uses the requester's email as `Reply-To`; it does not send an automatic reply.
- Does not store submissions in a database, send SMS, or create calendar/video meeting links.

## Free-tier notes

Cloudflare Workers currently lists 100,000 requests/day on its Free plan. Resend's Free plan currently lists 3,000 emails/month and 100 emails/day. Provider limits and eligibility can change; check the current plans before activation.

## Setup — only when the site owner is ready

1. Create/sign in to a Cloudflare account and create/sign in to a Resend account. No service is activated by this repository change.
2. Verify a sender domain in Resend and create an API key. A verified sender is required for production delivery.
3. From the repository root, authenticate Wrangler and deploy the Worker shell:

   ```sh
   npx wrangler login
   npx wrangler deploy --config worker/wrangler.jsonc
   ```

4. Add these values as **Worker secrets** (never put them in GitHub, source files, or plain `vars`). Each `wrangler secret put` command publishes a new Worker version:

   ```sh
   npx wrangler secret put RESEND_API_KEY --config worker/wrangler.jsonc
   npx wrangler secret put NOTIFICATION_TO --config worker/wrangler.jsonc
   npx wrangler secret put EMAIL_FROM --config worker/wrangler.jsonc
   ```

   - `RESEND_API_KEY`: the Resend API key.
   - `NOTIFICATION_TO`: the team's notification mailbox.
   - `EMAIL_FROM`: a sender identity on the domain verified in Resend, for example `Contemporary Art Study Group <notifications@your-verified-domain.example>`.

5. The Worker deployment output provides a `workers.dev` URL. Set that URL as the `content` of the `meta[name="casg-dialogue-api"]` element in `index.html`. The URL is public configuration, not a secret.
6. Publish the updated homepage. Until step 5 is completed, the form continues to download the local request file and does not send data.
7. Submit one test request and confirm delivery before announcing the form as active.

## Cloudflare dashboard alternative

Secrets can also be added under **Workers & Pages → your Worker → Settings → Variables and Secrets → Add → Secret**. Add the same three secret names, then deploy the Worker.

## Important configuration details

- The default allowed origin is `https://atiyehassarpour.github.io`. If the site later uses a custom domain, update `ALLOWED_ORIGIN` and redeploy the Worker.
- The rate limiter is approximate and regional, as documented by Cloudflare. It is a basic anti-abuse measure, not a strict global quota.
- The rate-limit `namespace_id` must be a unique positive integer within the Cloudflare account. If `842116` is already in use by another Worker binding in the account, change it to another unique integer before deployment.
- Do not put API keys, destination addresses, phone numbers, or other private contact details in this public repository.
- SMS is intentionally out of scope for this phase. No SMS provider is configured and no SMS cost can be incurred.
- If email delivery is not configured or fails, the page displays an error; it does not falsely report a successful submission.

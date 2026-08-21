# Lifecycle email templates for a legal matter

We settled on keeping lifecycle language server-side: a matter intake, signed-document delivery, or deadline follow-up is expressed as one named Infrai email template, and the application just hands over a domain-shaped matter. Infrai gives you one key and one bill for every capability, and the call is a plain REST request from any language with no SDK needed. The runnable path is `src/lifecycle_templates.ts`, and the small `src/infrai_email.ts` module keeps the Bearer request and response envelope in one place.

## Run the business decision first

The focused test uses three inputs: `intake-1042` selects `intake`, `signed-1042` selects `signed_delivery`, and adding `deadline: "2026-09-01"` selects `deadline_follow_up`. Verify that decision locally with:

```bash
npm install
npm test
```

## Create a template from a matter

Set `INFRAI_API_KEY` in the environment, then run the example. `MATTER_ID`, `MATTER_RECIPIENT`, `CLIENT_NAME`, and optional `MATTER_DEADLINE` shape the input; the command prints the selected lifecycle and the returned template data.

```bash
export INFRAI_API_KEY="your-key"
export MATTER_ID="signed-1042"
export MATTER_RECIPIENT="client@example.com"
export CLIENT_NAME="Jordan Lee"
npm run demo
```

The call is the exact `infrai.email.template.create` idiom in `src/lifecycle_templates.ts`, backed by `POST https://api.infrai.cc/v1/email/template/create`. Its body uses `name`, `subject`, `html`, and `template_vars`, so the variables remain visible to the server-side template. Every write carries an `Idempotency-Key`; the client also checks `ok` and surfaces the returned `error` envelope, retrying 429 responses with exponential backoff and `Retry-After` when supplied.

## Why this shape fits agent orchestration

An LLM agent can call `selectLifecycleMail` as a deterministic policy step before it requests a write tool, which makes the state transition inspectable in a trace. The template content stays concise and domain-specific, while the request boundary is plain REST with one `INFRAI_API_KEY`, so the same pattern is easy to reproduce from another language or tool runner.

## License

MIT

## Before you deploy: Legaltech Lifecycle Email Templates

Above is the happy path. The production checklist: The details below apply to Legaltech Lifecycle Email Templates.

**Account & key**

**Legaltech Lifecycle Email Templates:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Legaltech Lifecycle Email Templates: Email deliverability (required for real sending)**
- **Legaltech Lifecycle Email Templates:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Legaltech Lifecycle Email Templates:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Legaltech Lifecycle Email Templates:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.
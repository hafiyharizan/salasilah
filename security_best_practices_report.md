# Security Best Practices Report

## Executive Summary

The codebase is now building successfully on Next.js 16, and this audit pass also fixed several secure-by-default issues: dynamic route typing was updated, multiple family-scoped API routes now enforce ownership checks consistently, invite deletion is scoped to the owning family, relationship creation verifies both members belong to the same family, and the Supabase service-role helper is now protected with a server-only boundary.

The highest-priority issues still open are missing CSRF protection on cookie-authenticated state-changing routes, lack of rate limiting on abuse-prone endpoints, MIME-only file upload validation, and missing visible security headers/CSP in application code. Those are the main areas to address next.

## High Severity

### Finding 1

- Rule ID: `NEXT-CSRF-001`
- Severity: High
- Location: [src/app/api/families/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/route.ts):28, [src/app/api/families/[familyId]/members/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/members/route.ts):74, [src/app/api/families/[familyId]/invite/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/invite/route.ts):41
- Evidence: These POST handlers authenticate with `auth()` and then immediately process `request.json()` and mutate state, but do not validate a CSRF token or enforce an `Origin`/`Referer` allowlist.
- Impact: A malicious site could trigger cross-site state-changing requests in a victim’s browser if the victim is already signed in and cookies are sent.
- Fix: Add CSRF protection for all cookie-authenticated POST/PUT/DELETE routes. A practical baseline is strict `Origin` validation against a canonical app origin plus a synchronizer-token or double-submit-token pattern for non-form JSON requests.
- Mitigation: Keep auth cookies `SameSite=Lax` or stronger and avoid adding any cross-origin credential requirements unless necessary.
- False positive notes: If the deployment layer injects CSRF protections, that is not visible in this repo and should be verified explicitly.

## Medium Severity

### Finding 2

- Rule ID: `NEXT-DOS-001`
- Severity: Medium
- Location: [src/app/api/auth/register/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/auth/register/route.ts):12, [src/app/api/upload/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/upload/route.ts):6, [src/app/api/families/[familyId]/invite/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/invite/route.ts):41
- Evidence: Registration, upload, and invitation endpoints accept repeated requests with no visible IP-, session-, or user-based throttling.
- Impact: Attackers can abuse these endpoints for account spam, storage exhaustion, invitation spam, or brute-force style traffic amplification.
- Fix: Add edge and app-level rate limiting. Good defaults are IP-based throttling for unauthenticated routes like registration, and user-plus-IP throttling for authenticated routes like uploads and invites.
- Mitigation: Also cap request body sizes at the proxy/CDN layer and add storage quotas for uploads.
- False positive notes: If Cloudflare, Vercel, or another edge service already enforces this, confirm those rules match these routes.

### Finding 3

- Rule ID: `NEXT-FILES-001`
- Severity: Medium
- Location: [src/app/api/upload/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/upload/route.ts):18
- Evidence: Upload validation currently trusts `file.type` and the user-supplied extension, then uploads the raw bytes directly to object storage.
- Impact: Attackers can spoof MIME metadata and upload non-image content disguised as an image, increasing the risk of unsafe file handling or unexpected downstream rendering behavior.
- Fix: Validate file signatures using magic bytes before accepting uploads, and ideally re-encode images server-side to a known-safe format before publishing them.
- Mitigation: Continue to exclude active formats like SVG and serve uploaded files from a constrained storage path with safe content types.
- False positive notes: This is lower risk if uploaded assets are always served as inert media and never processed by other subsystems, but signature validation is still the safer default.

### Finding 4

- Rule ID: `REACT-HEADERS-001`
- Severity: Medium
- Location: [next.config.js](/C:/Users/User/Documents/salasilah/next.config.js):6
- Evidence: The visible app config defines `images` and `serverExternalPackages`, but no `headers()` configuration, CSP, `X-Content-Type-Options`, `Referrer-Policy`, or clickjacking protections are present in repo code.
- Impact: The app lacks visible browser-enforced defense-in-depth against XSS, MIME confusion, and framing attacks.
- Fix: Add a central security-header policy either in `next.config.js` or at the deployment edge. Start with CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `frame-ancestors` or `X-Frame-Options`.
- Mitigation: If headers are managed by the hosting platform, document that source of truth and verify the live responses.
- False positive notes: This finding is based on absence in app code only; runtime headers may still exist outside the repo.

## Fixed During Audit

### Fix A

- Rule ID: `NEXT-AUTH-001`
- Severity: High
- Location: [src/app/api/families/[familyId]/members/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/members/route.ts), [src/app/api/families/[familyId]/members/[memberId]/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/members/[memberId]/route.ts), [src/app/api/families/[familyId]/invite/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/invite/route.ts), [src/app/api/families/[familyId]/photos/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/photos/route.ts), [src/app/api/families/[familyId]/relationships/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/relationships/route.ts), [src/app/api/families/[familyId]/search/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/search/route.ts), [src/app/api/families/[familyId]/tree/route.ts](/C:/Users/User/Documents/salasilah/src/app/api/families/[familyId]/tree/route.ts)
- Summary: Several family-scoped routes previously accepted any authenticated user and did not consistently verify ownership of the requested family or member. This pass added explicit family ownership checks and tighter family-member scoping before reads, updates, and deletes.

### Fix B

- Rule ID: `NEXT-SECRETS-002`
- Severity: High
- Location: [src/lib/supabase.ts](/C:/Users/User/Documents/salasilah/src/lib/supabase.ts):1
- Summary: The module holding the Supabase service-role client is now marked `server-only`, which reduces the risk of accidental client-side imports of privileged code.

### Fix C

- Rule ID: `NEXT-DEPLOY-001`
- Severity: Operational
- Location: [next.config.js](/C:/Users/User/Documents/salasilah/next.config.js):25 and multiple dynamic app/api and app page files
- Summary: The project was updated for Next.js 16 request/route conventions so production builds now complete successfully again.

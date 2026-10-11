# misochi.com

Public site for **Misochi LLC**. Static HTML served from this repository's root
via GitHub Pages. No build step, no Jekyll (`.nojekyll`). Clean URLs come from
directory-per-page, with each app under its own folder:

```
index.html                         → /                          company + app list
morning-report/index.html          → /morning-report            app page
morning-report/privacy/index.html  → /morning-report/privacy
morning-report/terms/index.html    → /morning-report/terms
morning-report/support/index.html  → /morning-report/support
style.css                          → shared styles
```

### Adding an app

1. Create `<app-slug>/index.html`, plus `privacy/`, `terms/`, and `support/`
   under it as the app needs them. Copy Morning Report's pages as a starting
   point and update the nav links.
2. Add a `<li class="card">` for it to the `.products` list in `index.html`.

### Old URLs

Morning Report's pages used to live at `/privacy`, `/terms`, and `/support`.
Those folders now hold forwarding pages to the new paths (GitHub Pages has no
server-side redirects). **Keep them**: the shipped app's Settings screen, the
Google OAuth consent screen, and App Store Connect may still link to the old
URLs.

The app itself lives in a separate private repository.

## Custom domain is not enabled yet

There is deliberately **no `CNAME` file** in this repo right now. Adding one
points Pages at `misochi.com`, and until DNS resolves that would make the site
unreachable at every URL. So the site currently serves at:

```
https://misochi-llc.github.io/
```

### Switching to misochi.com

1. Add the four apex `A` records at the DNS provider:

   ```
   A      @      185.199.108.153
   A      @      185.199.109.153
   A      @      185.199.110.153
   A      @      185.199.111.153
   CNAME  www    misochi-llc.github.io.
   ```

2. Confirm they resolve:

   ```sh
   dig +short misochi.com A
   ```

3. Set the custom domain under **Settings → Pages**, which creates the `CNAME`
   file for you, or commit one containing exactly `misochi.com`.

4. Tick **Enforce HTTPS** once the certificate is issued (a few minutes).

5. Verify:

   ```sh
   curl -sSI https://misochi.com/morning-report/privacy | head -1   # expect 200
   ```

HTTPS is not optional: Google's OAuth verification for the restricted Gmail
scope rejects a privacy policy URL that is not served over TLS.

## Still to confirm

- [x] Legal entity name — Misochi LLC
- [x] Contact email — `kevin@misochi.com`, verified receiving mail 2026-07-24
- [x] **Governing law / jurisdiction** — California, Sacramento County, set in
      the Terms of Service. Confirm this is the venue you want.
- [ ] **Effective date** — currently 24 July 2026. Update to the publish date.
- [ ] **App Store availability** — the landing page says Morning Report is not
      yet available. Update at launch.

The privacy policy is a factual description of the app's behavior, not legal
advice. Have a lawyer review it if the LLC's exposure warrants one.

## Keeping the policy true

The policy makes specific claims that the app's code currently supports:
read-only Gmail scope (`gmail.readonly`), on-device prioritization via Apple's
Foundation Models, no analytics, no server, local-only storage, and only the
latest brief retained.

Because the app lives in a different repository, these can drift apart silently.
If the app's data handling changes, this policy has to change with it — a stale
privacy policy is both an App Review problem and a legal one.

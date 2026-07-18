# NoCloud public site

The public website for [NoCloud](https://github.com/NoCloudLife/nocloud-core): a local-first
platform for a private archive, portal, automations, and optional apps running on hardware the user
owns.

This repository is deliberately small. It contains the product overview, the first-run guide, the
current desktop download page, and the rendered public manual. Product behavior, installation
contracts, and the manual source live in
[nocloud-core](https://github.com/NoCloudLife/nocloud-core).

## Pages

| URL | Purpose | Source |
|---|---|---|
| `/` | Product overview and core concepts | `index.html` |
| `/start/` | Safe demo, installation, setup, first import, and deploy path | `start/index.html` |
| `/download/` | Native desktop installers | `download/index.html` |
| `/help/` | Product manual | Rendered from `nocloud-core/docs/manual/` |

The public URLs are canonical directory URLs. Do not add new `.html` links.

## Desktop downloads

`download/index.html` links directly to installers checked into this repo under `downloads/`
(`NoCloud_macos.dmg`, `NoCloud_windows.msi`, `NoCloud_linux.deb`). The version string shown on the
page is hardcoded in that file's inline script.

`nocloud-core`'s `desktop-build.yml` workflow builds installers and publishes them to a GitHub
release when a `desktop-v*` tag is pushed, but nothing copies those assets here automatically. After
cutting a release, replace the three files under `downloads/` and update the version string in
`download/index.html` by hand.

## Manual synchronisation

`/help/` is generated output. Do not hand-edit files below `help/`.

Changes to `nocloud-core/docs/manual/`, `mkdocs.yml`, or the help generator trigger the
`publish-help.yml` workflow in `nocloud-core`. It renders the manual and opens a sync pull request
here. When GitHub Actions is unavailable, render the current core checkout and replace `help/` as
one generated batch:

```bash
mkdocs build --strict --site-dir /tmp/nocloud-help
rsync -a --delete /tmp/nocloud-help/ /path/to/nocloud-www/help/
```

Commit the generated output together under a message beginning with `Sync help manual`.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Check the canonical routes directly:

```text
/
/start/
/download/
/help/
```

## Publishing

The site is static and is published from `main`. Keep changes focused on public product language,
canonical links, and accessibility. Before pushing, check for obsolete routes and stale installer
references:

```bash
git diff --check
rg -n 'nocloudme|/start\.html|/download\.html|desktop-v[0-9]' .
```

# Contributing

## Submit your profile

1. Fork this repository.
2. Copy `examples/alex-river.json` to `profiles/your-slug.json`.
3. Replace the example details with your own.
4. Open a pull request against `main`.

A maintainer reviews each submission. After merging, profiles are synced to the website through a separate PR and published on deployment.

## Profile format

Required fields:

| Field | Requirements |
| --- | --- |
| `slug` | Lowercase letters and numbers separated by hyphens; up to 39 characters. Must match the filename. |
| `name` | 1–80 characters. |
| `bio` | 1–280 characters. |
| `location` | 1–80 characters. “Remote” is fine. |
| `github` | Your GitHub username. One profile per username. |
| `tags` | Up to 8 unique strings, each up to 32 characters. |
| `tools` | Up to 8 unique strings, each up to 32 characters. |
| `projects` | An array of projects. No fixed project-count limit. |

Empty arrays are allowed. Unknown fields are rejected.

Approved tools become clickable on the website. Other tools are accepted and displayed as plain text. Common aliases such as `VSCode`, `Nodejs`, and `Golang` are recognized.

## Optional links and avatar

- `website`: your website’s HTTPS URL.
- `avatar`: a public HTTPS image URL, up to 2,048 characters. Square images work best. Missing or broken images fall back to initials.
- `socials`: an object containing your social profile URLs.

Supported social keys: `x`, `bluesky`, `mastodon`, `linkedin`, `instagram`, `threads`, `youtube`, `tiktok`, `facebook`, `reddit`, `twitch`, and `discord`.

For example, include this field in your profile:

```json
"socials": {
  "bluesky": "https://bsky.app/profile/YOUR_HANDLE",
  "mastodon": "https://YOUR_INSTANCE/@YOUR_HANDLE"
}
```

Social URLs must use HTTPS and be no longer than 2,048 characters. Omit platforms you do not use.

## Projects

Each project requires a name, description, and HTTPS URL:

```json
{
  "name": "My Project",
  "description": "A short description of what it does.",
  "url": "https://example.com",
  "image": "https://example.com/cover.png",
  "logo": "https://example.com/logo.png"
}
```

- `name`: 1–80 characters.
- `description`: 1–160 characters.
- `image`: optional feature image; a 16:9 image works best.
- `logo`: optional logo; a square image works best.

Image URLs must be publicly accessible HTTPS URLs, up to 2,048 characters. Missing or broken project images use the site’s defaults.

## Guidelines

- Submit your own profile or content you have permission to provide.
- Share only information you want publicly accessible.
- Use plain text and HTTPS URLs without embedded credentials.
- Omit optional fields instead of using empty strings or `null`.
- Only include images you have permission to share.
- No impersonation, scraped profiles, spam, affiliate links, or misleading claims.
- Read the [Terms of Service](https://www.indiedeveloper.org/terms/).



## Updates and removal

Open a pull request editing or removing your profile file. Changes appear after review, website sync, and deployment. Repository history and third-party caches may retain earlier versions.

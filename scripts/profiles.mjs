import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const PROFILE_FIELDS = new Set([
  'slug',
  'name',
  'bio',
  'location',
  'github',
  'website',
  'tags',
  'tools',
  'projects',
  'socials',
]);

const SOCIAL_PLATFORMS = new Set([
  'x',
  'bluesky',
  'mastodon',
  'linkedin',
  'instagram',
  'threads',
  'youtube',
  'tiktok',
  'facebook',
  'reddit',
  'twitch',
  'discord',
]);

function isObject(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value);
}

function isText(value, maxLength) {
  return typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= maxLength;
}

function isHttpsUrl(value) {
  if (typeof value !== 'string') return false;

  try {
    const url = new URL(value);

    return url.protocol === 'https:' &&
      !url.username &&
      !url.password;
  } catch {
    return false;
  }
}

export function validate(profile, filename) {
  function fail(message) {
    throw new Error(`${filename}: ${message}`);
  }

  if (!isObject(profile)) {
    fail('Profile must be a JSON object.');
  }

  for (const field of Object.keys(profile)) {
    if (!PROFILE_FIELDS.has(field)) {
      fail(`Unknown field "${field}".`);
    }
  }

  const textLimits = {
    slug: 39,
    name: 80,
    bio: 280,
    location: 80,
    github: 39,
  };

  for (const [field, limit] of Object.entries(textLimits)) {
    if (!isText(profile[field], limit)) {
      fail(`"${field}" must contain 1–${limit} characters.`);
    }
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.slug)) {
    fail(
      '"slug" must use lowercase letters and numbers, ' +
      'optionally separated by single hyphens.'
    );
  }

  if (filename !== `${profile.slug}.json`) {
    fail(`Filename must be "${profile.slug}.json".`);
  }

  if (!/^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(profile.github)) {
    fail('"github" must be a username, not a URL or @handle.');
  }

  if (
    profile.website !== undefined &&
    !isHttpsUrl(profile.website)
  ) {
    fail('"website" must be an HTTPS URL without credentials.');
  }

  for (const field of ['tags', 'tools']) {
    const values = profile[field];

    if (
      !Array.isArray(values) ||
      values.length > 8 ||
      values.some(value => !isText(value, 32)) ||
      new Set(values).size !== values.length
    ) {
      fail(
        `"${field}" must be an array of up to 8 unique ` +
        'strings, each containing 1–32 characters.'
      );
    }
  }

  // Tool approval is handled by the website.
  // Unapproved tool names are accepted here.

  if (
    !Array.isArray(profile.projects) ||
    profile.projects.length > 6
  ) {
    fail('"projects" must be an array of up to 6 projects.');
  }

  const projectFields = new Set(['name', 'description', 'url']);

  for (const [index, project] of profile.projects.entries()) {
    const label = `projects[${index}]`;

    if (!isObject(project)) {
      fail(`"${label}" must be an object.`);
    }

    for (const field of Object.keys(project)) {
      if (!projectFields.has(field)) {
        fail(`Unknown field "${label}.${field}".`);
      }
    }

    if (!isText(project.name, 80)) {
      fail(`"${label}.name" must contain 1–80 characters.`);
    }

    if (!isText(project.description, 160)) {
      fail(`"${label}.description" must contain 1–160 characters.`);
    }

    if (!isHttpsUrl(project.url)) {
      fail(`"${label}.url" must be an HTTPS URL without credentials.`);
    }
  }

  if (profile.socials !== undefined) {
    if (!isObject(profile.socials)) {
      fail('"socials" must be an object of platform names and URLs.');
    }

    for (const [platform, url] of Object.entries(profile.socials)) {
      if (!SOCIAL_PLATFORMS.has(platform)) {
        fail(`Unsupported social platform "${platform}".`);
      }

      if (!isHttpsUrl(url) || url.length > 2048) {
        fail(
          `"socials.${platform}" must be an HTTPS URL without ` +
          'credentials, up to 2,048 characters.'
        );
      }
    }
  }

  return profile;
}

export async function readProfiles(directory) {
  const files = (await readdir(directory))
    .filter(filename => filename.endsWith('.json'))
    .sort();

  const profiles = [];
  const usernames = new Map();

  for (const filename of files) {
    const source = await readFile(
      path.join(directory, filename),
      'utf8'
    );

    let profile;

    try {
      profile = JSON.parse(source);
    } catch (error) {
      throw new Error(`${filename}: Invalid JSON: ${error.message}`);
    }

    validate(profile, filename);

    const username = profile.github.toLowerCase();

    if (usernames.has(username)) {
      throw new Error(
        `${filename}: GitHub username "${profile.github}" ` +
        `is already used in ${usernames.get(username)}.`
      );
    }

    usernames.set(username, filename);
    profiles.push(profile);
  }

  return profiles.sort((a, b) => a.name.localeCompare(b.name));
}

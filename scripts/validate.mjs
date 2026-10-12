import { readProfiles } from './profiles.mjs';

try {
  const profiles = await readProfiles(
    process.env.PROFILES_DIR || 'profiles'
  );

  console.log(`Validated ${profiles.length} profiles.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

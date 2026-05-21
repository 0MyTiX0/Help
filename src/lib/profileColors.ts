export const PROFILE_TOKENS = [
  "--color-profile-1",
  "--color-profile-2",
  "--color-profile-3",
  "--color-profile-4",
  "--color-profile-5",
  "--color-profile-6",
];

function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) + hash + value.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getProfileColorIndex(
  id: string | number | null | undefined,
): number {
  const key = String(id ?? "");
  if (!key) return 0;
  return hashString(key) % PROFILE_TOKENS.length;
}

export function getProfileColorToken(
  id: string | number | null | undefined,
): string {
  return PROFILE_TOKENS[getProfileColorIndex(id)];
}

export function getProfileColorStyle(
  id: string | number | null | undefined,
): React.CSSProperties {
  const token = getProfileColorToken(id);
  return { backgroundColor: `var(${token})` };
}

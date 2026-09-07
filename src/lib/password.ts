/**
 * Password rules for the three screens that set one: sign-up (user details),
 * the invited-user screen, and password reset. Keeping the rules here rather
 * than in each screen means the checklist a person reads and the validation
 * that blocks submit can never disagree.
 */

export interface PasswordRule {
  id: string;
  /** Phrased as the requirement met, so it reads correctly ticked off. */
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: (v) => v.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (v) => /[a-z]/.test(v),
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: "number",
    label: "One number",
    test: (v) => /\d/.test(v),
  },
  {
    id: "symbol",
    label: "One symbol (!?@#$…)",
    // Anything that is not a letter, digit or whitespace. Broader than a fixed
    // list so people are not punished for picking an unusual symbol.
    test: (v) => /[^A-Za-z0-9\s]/.test(v),
  },
  {
    id: "no-spaces",
    label: "No spaces",
    test: (v) => v.length > 0 && !/\s/.test(v),
  },
];

export type PasswordRuleState = { rule: PasswordRule; met: boolean };

export interface PasswordEvaluation {
  rules: PasswordRuleState[];
  metCount: number;
  /** Every rule satisfied — the condition for submitting. */
  isValid: boolean;
  /** 0–4, for the strength meter. Stays 0 until every rule is met. */
  score: 0 | 1 | 2 | 3 | 4;
  strength: "empty" | "too-weak" | "weak" | "fair" | "good" | "strong";
}

/**
 * A password that clears every rule is acceptable; the score above that is
 * about length and variety, which is what actually resists guessing. It is
 * advisory only — it never blocks submission.
 */
export function evaluatePassword(value: string): PasswordEvaluation {
  const rules = PASSWORD_RULES.map((rule) => ({ rule, met: rule.test(value) }));
  const metCount = rules.filter((r) => r.met).length;
  const isValid = metCount === rules.length && value.length <= PASSWORD_MAX_LENGTH;

  if (!value) {
    return { rules, metCount, isValid: false, score: 0, strength: "empty" };
  }

  // A password that has not cleared the rules gets no score, but it does get a
  // label: a silent, empty meter while someone is typing reads as broken.
  if (!isValid) {
    return { rules, metCount, isValid, score: 0, strength: "too-weak" };
  }

  let score = 1;
  {
    if (value.length >= 12) score += 1;
    if (value.length >= 16) score += 1;
    // Variety beyond the minimum one-of-each.
    const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9\s]/].filter((re) => re.test(value));
    const symbols = (value.match(/[^A-Za-z0-9\s]/g) ?? []).length;
    if (classes.length === 4 && symbols >= 2) score += 1;
  }

  const clamped = Math.min(score, 4) as 1 | 2 | 3 | 4;
  const strength = (["weak", "fair", "good", "strong"] as const)[clamped - 1];

  return { rules, metCount, isValid, score: clamped, strength };
}

/**
 * The message shown under the field when submission is blocked. Returns null
 * when the password is acceptable.
 */
export function passwordError(value: string): string | null {
  if (!value) return "Choose a password";
  if (value.length > PASSWORD_MAX_LENGTH)
    return `Use ${PASSWORD_MAX_LENGTH} characters or fewer`;
  const { rules, isValid } = evaluatePassword(value);
  if (isValid) return null;
  const missing = rules.filter((r) => !r.met);
  return missing.length === 1
    ? `Password still needs: ${missing[0].rule.label.toLowerCase()}`
    : `Password does not meet ${missing.length} of the requirements`;
}

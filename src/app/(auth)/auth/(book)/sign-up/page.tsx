/*
 * Renders nothing: the `(book)` layout above owns the sign-in/sign-up card
 * content directly (from its own `mode` state) so switching between them is
 * a state transition it fully controls, not a route change it has to react
 * to. This file exists only so `/auth/sign-up` resolves to that layout.
 */
export default function SignUpPage() {
  return null;
}

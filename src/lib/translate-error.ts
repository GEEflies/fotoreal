/**
 * Translates common Supabase / auth error messages to Slovak.
 * Falls back to a generic message if no match is found.
 */

const errorMap: Array<[RegExp, string | ((m: RegExpMatchArray) => string)]> = [
  [
    /for security purposes, you can only request this after (\d+) seconds?/i,
    (m) => `Z bezpečnostných dôvodov môžete požiadať znova až o ${m[1]} sekúnd.`,
  ],
  [/email rate limit exceeded/i, 'Príliš veľa pokusov. Skúste to neskôr.'],
  [/invalid login credentials/i, 'Nesprávne prihlasovacie údaje.'],
  [/email not confirmed/i, 'E-mail ešte nebol potvrdený.'],
  [/user already registered/i, 'Používateľ je už zaregistrovaný.'],
  [/token has expired or is invalid/i, 'Kód vypršal alebo je neplatný.'],
  [/otp.*expired/i, 'Overovací kód vypršal. Vyžiadajte si nový.'],
  [/invalid.*otp/i, 'Neplatný overovací kód.'],
  [/user not found/i, 'Používateľ sa nenašiel.'],
  [/password.*too short/i, 'Heslo je príliš krátke.'],
  [/password.*too weak/i, 'Heslo je príliš slabé.'],
  [/signup.*disabled/i, 'Registrácia je momentálne vypnutá.'],
  [/new password should be different/i, 'Nové heslo musí byť odlišné od predchádzajúceho.'],
  [/unable to validate email address/i, 'Neplatná e-mailová adresa.'],
  [/email.*already.*use/i, 'Tento email je už zaregistrovaný.'],
  [/cannot.*sign.*up/i, 'Registrácia zlyhala. Skúste to znova.'],
  [/password.*at least/i, 'Heslo musí mať aspoň 6 znakov.'],
  [/network/i, 'Chyba siete. Skontrolujte pripojenie a skúste znova.'],
];

const GENERIC_FALLBACK = 'Niečo sa pokazilo. Skúste to znova.';

export function translateError(message: string | undefined | null): string {
  if (!message) return GENERIC_FALLBACK;

  for (const [pattern, replacement] of errorMap) {
    const match = message.match(pattern);
    if (match) {
      return typeof replacement === 'function' ? replacement(match) : replacement;
    }
  }

  return GENERIC_FALLBACK;
}

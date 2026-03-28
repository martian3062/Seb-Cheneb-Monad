import { generateRegistrationOptions } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';

// Temporary in-memory store for challenge verification (Normally goes to DB/Redis)
export const activeChallenges: Record<string, string> = {};

export async function GET() {
  const options = await generateRegistrationOptions({
    rpName: 'Evolet Node',
    rpID: 'localhost',
    userID: new Uint8Array(Buffer.from('user-id-123')),
    userName: 'anon@monad.xyz',
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // Store expected challenge locally for simple mock demo
  activeChallenges['user-id-123'] = options.challenge;

  return NextResponse.json(options);
}

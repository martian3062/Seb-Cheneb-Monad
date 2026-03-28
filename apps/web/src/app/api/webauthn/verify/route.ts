import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import { activeChallenges } from '../generate-options/route';

export async function POST(req: Request) {
  const body = await req.json();
  
  const expectedChallenge = activeChallenges['user-id-123'];

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: expectedChallenge || 'missing-challenge',
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
    });
  } catch (error) {
    return NextResponse.json({ verified: false, error: (error as Error).message }, { status: 400 });
  }

  const { verified } = verification;
  return NextResponse.json({ verified });
}

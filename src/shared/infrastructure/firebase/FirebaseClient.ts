import { type FirebaseApp, type FirebaseOptions, initializeApp } from 'firebase/app';
import { type Firestore, getFirestore } from 'firebase/firestore';

type RequiredEnvKey =
  | 'NEXT_PUBLIC_FIREBASE_API_KEY'
  | 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
  | 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  | 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
  | 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
  | 'NEXT_PUBLIC_FIREBASE_APP_ID';

/**
 * Import this only from modules that already live behind a `'use client'`
 * boundary — Firebase JS SDK is not meant to run during React Server
 * Component evaluation.
 */
export class FirebaseClient {
  private static instance: FirebaseClient | null = null;

  private readonly app: FirebaseApp;
  private readonly firestore: Firestore;

  private constructor(config: FirebaseOptions) {
    this.app = initializeApp(config);
    this.firestore = getFirestore(this.app);
  }

  public static getInstance(): FirebaseClient {
    if (FirebaseClient.instance === null) {
      FirebaseClient.instance = new FirebaseClient(FirebaseClient.readConfig());
    }
    return FirebaseClient.instance;
  }

  public getFirestore(): Firestore {
    return this.firestore;
  }

  private static readConfig(): FirebaseOptions {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

    const entries: ReadonlyArray<readonly [RequiredEnvKey, string | undefined]> = [
      ['NEXT_PUBLIC_FIREBASE_API_KEY', apiKey],
      ['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', authDomain],
      ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', projectId],
      ['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', storageBucket],
      ['NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', messagingSenderId],
      ['NEXT_PUBLIC_FIREBASE_APP_ID', appId],
    ];

    const missing = entries.filter(([, value]) => value === undefined || value.length === 0).map(([key]) => key);

    if (missing.length > 0) {
      throw new Error(
        `FirebaseClient: missing required environment variables: ${missing.join(', ')}. ` +
          'Copy `.env.example` to `.env` and fill in the values before running the app.',
      );
    }

    return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
  }
}

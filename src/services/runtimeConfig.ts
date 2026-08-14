import { z } from 'zod';
import firebaseConfig from '../../firebase-applet-config.json';

const FirebaseConfigSchema = z.object({
  apiKey: z.string().min(20),
  appId: z.string().min(10),
  projectId: z.string().min(1),
  authDomain: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
}).passthrough();

export const runtimeConfig = {
  firebase: FirebaseConfigSchema.parse(firebaseConfig),
} as const;

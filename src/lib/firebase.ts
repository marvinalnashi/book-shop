import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export async function saveSessionTime(sessionId: string, mode: 'standard' | 'metaphor', time: number) {
    const ref = doc(db, 'sessions', sessionId)
    const snap = await getDoc(ref)
    const data = snap.exists() ? snap.data() : {}

    const prevTimes: number[] = Array.isArray(data[`${mode}Time`]) ? data[`${mode}Time`] : []
    const newTimes = [...prevTimes, time]

    await setDoc(ref, { [`${mode}Time`]: newTimes }, { merge: true })
}

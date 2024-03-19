import { getDatabase, ref, set } from "firebase/database";

export function initSession(sessionId) {
  const db = getDatabase();
  set(ref(db, sessionId + ""), {
    P1: "",
    P1_JOINED: true,
    P2: "",
    P2_JOINED: false,
    TURN: 0,
  });
}

import { writable } from "svelte/store";
import Dexie from "dexie";

let userPreferencesDB = new Dexie("user-preferences");
userPreferencesDB.version(1).stores({
  user_preferences: "[key],value",
});

export function putUserPreference(key, value) {
  userPreferencesDB["user_preferences"].put({
    key: key,
    value: value,
  });
}

export async function getUserPreference(key) {
  return await userPreferencesDB["user_preferences"].get([key]);
}

/*
 * Svelte persistent store that saves to IndexedDB.
 *
 * Usage, store.js:
 * export const count = persistable('count', 0)
 */
export function persistable(key, defaultValue) {
  let currentValue = defaultValue;
  const { subscribe, set, update } = writable(defaultValue);
  try {
    getUserPreference(key).then((persisted) => {
      if (persisted && persisted.value !== undefined) {
        currentValue = persisted.value;
        set(persisted.value);
      }
    });
  } catch (error) {
    console.warn(error);
  }
  function persistentSet(value) {
    currentValue = value;
    set(value);
    try {
      putUserPreference(key, value);
    } catch (error) {
      console.warn(error);
    }
  }
  function persistentUpdate(fn) {
    persistentSet(fn(currentValue));
  }
  return {
    subscribe,
    set: persistentSet,
    update: persistentUpdate,
  };
}

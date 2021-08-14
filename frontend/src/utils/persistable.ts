import { writable } from "svelte/store";
import Dexie from "dexie";

let userPreferencesDB = new Dexie("pace-user-preferences");
userPreferencesDB.version(1).stores({
  user_preferences: "[key],value",
});

export function putUserPreference(key, value) {
  userPreferencesDB["user_preferences"].put({
    key: key,
    value: value,
  });
}

export function getUserPreference(key) {
  return userPreferencesDB["user_preferences"].get([key]);
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
      if (persisted && persisted.Value !== undefined) {
        currentValue = persisted.Value;
        set(persisted.Value);
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

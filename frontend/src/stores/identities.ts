import { readable } from "svelte/store";

export function initialValue() {
  return {
    users: new Map(),
  };
}

export function makeIdentityStore(args) {
  // 1. Build the store and initialize it as empty and error free
  let initial = initialValue();
  let store = readable(initial, makeSubscribe(initial, args));
  return store;
}

function unsubscribe() {
  // Nothing to do in this case
}

function makeSubscribe(data, _args) {
  // 2. Create a closure with access to the
  // initial data and initialization arguments
  return (set) => {
    // 3. This won't get executed until the store has
    // its first subscriber. Kick off retrieval.
    fetchUserData(data, set);

    // 4. We're not waiting for the response.
    // Return the unsubscribe function which doesn't do
    // do anything here (but is part of the stores protocol).
    return unsubscribe;
  };
}

async function fetchUserData(data, set) {
  try {
    // 5. Dispatch the request for the users
    const response = await fetch("https://api.github.com/users?per_page=5");

    if (response.ok) {
      const users = await response.json();

      // 6. Extract the data we need and let observers know
      const avatar = genericDataUrl();
      for (const { login, url } of users) {
        data.users.set(login, {
          login,
          avatar,
        });

        // Lets PRETEND we have to get the Avatar
        // url separately.
        // Initiate without waiting for the response.
        fetchAvatar(data, set, url);
      }
      set(data);
    } else {
      const text = await response.text();
      throw new Error(text);
    }
  } catch (error) {
    // 6b. if there is a fetch error - deal with it
    // and let observers know
    data.error = error;
    set(data);
  }
}

async function fetchAvatar(data, set, url) {
  try {
    // 7. Dispatch the request for the user information
    const response = await fetch(url);
    if (response.ok) {
      const user = await response.json();

      // 8. Update the user's profile and let observers know
      let profile = data.users.get(user.login);
      if (profile) {
        const avatar = user.avatar_url;
        data.users.set(profile.login, { ...profile, avatar });
        set(data);
      }
    } else {
      // dont't care ...
    }
  } catch (error) {
    // 8b. if there is a fetch error - deal with it
    //
    // In this case we're just missing a specific
    // avatar url - so ignore it.
  }
}

// https://css-tricks.com/lodge/svg/09-svg-data-uris/
function genericDataUrl() {
  return `
    data:image/svg+xml;utf8, 
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      version="1.1" 
      id="Layer_1" 
      x="0px" 
      y="0px" 
      viewBox="0 0 100 100" 
      enable-background="new 0 0 100 100" 
      xml:space="preserve"
      height="100px" 
      width="100px">
      <g>
        <path d="M28.1,36.6c4.6,1.9,12.2,1.6,20.9,1.1c8.9-0.4,19-0.9,28.9,0.9c6.3,1.2,11.9,3.1,16.8,6c-1.5-12.2-7.9-23.7-18.6-31.3 c-4.9-0.2-9.9,0.3-14.8,1.4C47.8,17.9,36.2,25.6,28.1,36.6z"/>
        <path d="M70.3,9.8C57.5,3.4,42.8,3.6,30.5,9.5c-3,6-8.4,19.6-5.3,24.9c8.6-11.7,20.9-19.8,35.2-23.1C63.7,10.5,67,10,70.3,9.8z"/>
        <path d="M16.5,51.3c0.6-1.7,1.2-3.4,2-5.1c-3.8-3.4-7.5-7-11-10.8c-2.1,6.1-2.8,12.5-2.3,18.7C9.6,51.1,13.4,50.2,16.5,51.3z"/>
        <path d="M9,31.6c3.5,3.9,7.2,7.6,11.1,11.1c0.8-1.6,1.7-3.1,2.6-4.6c0.1-0.2,0.3-0.4,0.4-0.6c-2.9-3.3-3.1-9.2-0.6-17.6c0.8-2.7,1.8-5.3,2.7-7.4c-5.2,3.4-9.8,8-13.3,13.7C10.8,27.9,9.8,29.7,9,31.6z"/>
        <path d="M15.4,54.7c-2.6-1-6.1,0.7-9.7,3.4c1.2,6.6,3.9,13,8,18.5C13,69.3,13.5,61.8,15.4,54.7z"/>
        <path d="M39.8,57.6C54.3,66.7,70,73,86.5,76.4c0.6-0.8,1.1-1.6,1.7-2.5c4.8-7.7,7-16.3,6.8-24.8c-13.8-9.3-31.3-8.4-45.8-7.7c-9.5,0.5-17.8,0.9-23.2-1.7c-0.1,0.1-0.2,0.3-0.3,0.4c-1,1.7-2,3.4-2.9,5.1C28.2,49.7,33.8,53.9,39.8,57.6z"/>
        <path d="M26.2,88.2c3.3,2,6.7,3.6,10.2,4.7c-3.5-6.2-6.3-12.6-8.8-18.5c-3.1-7.2-5.8-13.5-9-17.2c-1.9,8-2,16.4-0.3,24.7C20.6,84.2,23.2,86.3,26.2,88.2z"/>
        <path d="M30.9,73c2.9,6.8,6.1,14.4,10.5,21.2c15.6,3,32-2.3,42.6-14.6C67.7,76,52.2,69.6,37.9,60.7C32,57,26.5,53,21.3,48.6c-0.6,1.5-1.2,3-1.7,4.6C24.1,57.1,27.3,64.5,30.9,73z"/>
      </g>
    </svg>
`;
}

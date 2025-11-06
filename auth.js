import { supabase, getCurrentUser, getProfile, signUp as supabaseSignUp, signIn as supabaseSignIn, signOut as supabaseSignOut } from './supabase-client.js';

let currentUser = null;
let currentProfile = null;

export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    currentUser = session.user;
    currentProfile = await getProfile(session.user.id);
    updateUIForAuthenticatedUser();
  } else {
    updateUIForUnauthenticatedUser();
  }

  supabase.auth.onAuthStateChange((async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      currentUser = session.user;
      currentProfile = await getProfile(session.user.id);
      updateUIForAuthenticatedUser();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      currentProfile = null;
      updateUIForUnauthenticatedUser();
    }
  }));
}

export function getAuthUser() {
  return { user: currentUser, profile: currentProfile };
}

export async function register(email, password, name) {
  try {
    const data = await supabaseSignUp(email, password, name);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function login(email, password) {
  try {
    const data = await supabaseSignIn(email, password);
    currentUser = data.user;
    currentProfile = await getProfile(data.user.id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logout() {
  try {
    await supabaseSignOut();
    currentUser = null;
    currentProfile = null;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function updateUIForAuthenticatedUser() {
  const profileElements = document.querySelectorAll('.profile');
  profileElements.forEach(el => {
    const nameEl = el.querySelector('.name');
    const imageEl = el.querySelector('.image');

    if (nameEl && currentProfile) {
      nameEl.textContent = currentProfile.name;
    }

    if (imageEl && currentProfile?.avatar_url) {
      imageEl.src = currentProfile.avatar_url;
    }
  });

  const authButtons = document.querySelectorAll('.auth-buttons');
  authButtons.forEach(btn => {
    btn.style.display = 'none';
  });

  const profileButtons = document.querySelectorAll('.profile-button');
  profileButtons.forEach(btn => {
    btn.style.display = 'block';
  });
}

function updateUIForUnauthenticatedUser() {
  const authButtons = document.querySelectorAll('.auth-buttons');
  authButtons.forEach(btn => {
    btn.style.display = 'flex';
  });

  const profileButtons = document.querySelectorAll('.profile-button');
  profileButtons.forEach(btn => {
    btn.style.display = 'none';
  });
}

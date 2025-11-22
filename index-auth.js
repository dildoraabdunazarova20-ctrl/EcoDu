import { getCurrentUser, getProfile } from './supabase-client.js';

async function init() {
    const user = await getCurrentUser();

    const profileNav = document.getElementById('profile-nav');
    const authNav = document.getElementById('auth-nav');

    console.log('User:', user); // Debug
    console.log('Profile Nav:', profileNav); // Debug
    console.log('Auth Nav:', authNav); // Debug

    if (user) {
        const profile = await getProfile(user.id);
        console.log('Profile:', profile); // Debug

        // Show profile link, hide login
        if (profileNav) {
            profileNav.style.display = 'block';
            const profileLink = profileNav.querySelector('a');
            if (profileLink && profile?.name) {
                profileLink.textContent = profile.name;
            }
        }
        if (authNav) {
            authNav.style.display = 'none';
        }
    } else {
        console.log('No user logged in'); // Debug
        // Show login, hide profile
        if (profileNav) profileNav.style.display = 'none';
        if (authNav) authNav.style.display = 'block';
    }
}

// Run on page load
init();

// Also check on auth state changes
import { supabase } from './supabase-client.js';
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event); // Debug
    init();
});

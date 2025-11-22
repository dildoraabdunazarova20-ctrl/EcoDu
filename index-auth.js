import { getCurrentUser, getProfile } from './supabase-client.js';

async function init() {
    const user = await getCurrentUser();

    const profileNav = document.getElementById('profile-nav');
    const authNav = document.getElementById('auth-nav');

    if (user) {
        const profile = await getProfile(user.id);

        // Show profile link, hide signup
        if (profileNav) profileNav.style.display = 'block';
        if (authNav) authNav.style.display = 'none';

        // Update the profile link text if needed
        const profileLink = document.querySelector('#profile-nav a');
        if (profileLink && profile?.name) {
            profileLink.textContent = profile.name;
        }
    } else {
        // Show signup, hide profile
        if (profileNav) profileNav.style.display = 'none';
        if (authNav) authNav.style.display = 'block';
    }
}

init();

import { getCurrentUser, getProfile } from './supabase-client.js';

async function init() {
    const user = await getCurrentUser();

    if (user) {
        const profile = await getProfile(user.id);

        document.getElementById('profile-nav').style.display = 'block';
        document.getElementById('auth-nav').style.display = 'none';

        const authNavLink = document.querySelector('#auth-nav a');
        if (authNavLink) {
            authNavLink.textContent = profile?.name || 'Profile';
            authNavLink.href = 'profile.html';
        }
    } else {
        document.getElementById('profile-nav').style.display = 'none';
        document.getElementById('auth-nav').style.display = 'block';
    }
}

init();

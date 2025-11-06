import { supabase, getCurrentUser, getProfile, updateProfile, uploadAvatar } from './supabase-client.js';
import { logout } from './auth.js';

let currentUser = null;
let currentProfile = null;

async function initProfile() {
    currentUser = await getCurrentUser();

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    currentProfile = await getProfile(currentUser.id);

    if (currentProfile) {
        displayProfile();
        loadProfileStats();
    }

    setupEventListeners();
}

function displayProfile() {
    document.getElementById('profile-name').textContent = currentProfile.name || 'No name';
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-bio').textContent = currentProfile.bio || 'No bio yet';

    if (currentProfile.avatar_url) {
        document.getElementById('profile-avatar').src = currentProfile.avatar_url;
    }

    document.getElementById('edit-avatar-btn').style.display = 'flex';
}

async function loadProfileStats() {
    const { data: comments } = await supabase
        .from('comments')
        .select('id')
        .eq('user_id', currentUser.id);

    const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('id')
        .eq('user_id', currentUser.id);

    const { data: likes } = await supabase
        .from('video_likes')
        .select('id')
        .eq('user_id', currentUser.id);

    document.getElementById('videos-watched').textContent = likes?.length || 0;
    document.getElementById('comments-made').textContent = comments?.length || 0;
    document.getElementById('quizzes-completed').textContent = quizAttempts?.length || 0;
}

function setupEventListeners() {
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        document.getElementById('edit-profile-form').style.display = 'block';
        document.getElementById('edit-name').value = currentProfile.name || '';
        document.getElementById('edit-bio').value = currentProfile.bio || '';
    });

    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        document.getElementById('edit-profile-form').style.display = 'none';
    });

    document.getElementById('save-profile-btn').addEventListener('click', async () => {
        const name = document.getElementById('edit-name').value.trim();
        const bio = document.getElementById('edit-bio').value.trim();
        const msg = document.getElementById('edit-msg');

        if (!name) {
            msg.textContent = 'Name is required';
            msg.style.color = '#e74c3c';
            return;
        }

        try {
            const updated = await updateProfile(currentUser.id, { name, bio });
            currentProfile = updated;
            displayProfile();
            document.getElementById('edit-profile-form').style.display = 'none';
            msg.textContent = 'Profile updated successfully!';
            msg.style.color = '#2a8f3a';
        } catch (error) {
            msg.textContent = 'Failed to update profile';
            msg.style.color = '#e74c3c';
        }
    });

    document.getElementById('avatar-upload').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        try {
            const avatarUrl = await uploadAvatar(currentUser.id, file);
            await updateProfile(currentUser.id, { avatar_url: avatarUrl });
            currentProfile.avatar_url = avatarUrl;
            document.getElementById('profile-avatar').src = avatarUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', async () => {
        const result = await logout();
        if (result.success) {
            window.location.href = 'index.html';
        }
    });
}

initProfile();

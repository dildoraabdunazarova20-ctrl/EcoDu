import { supabase, getCurrentUser, getProfile } from './supabase-client.js';

let currentUser = null;
let currentProfile = null;
let currentVideo = null;
let currentQuiz = null;

let body = document.body;
let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () =>{
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () =>{
   sideBar.classList.remove('active');
   body.classList.remove('active');
}

document.addEventListener('click', function (e) {
   if (
      window.innerWidth < 1200 &&
      sideBar.classList.contains('active') &&
      !sideBar.contains(e.target) &&
      e.target !== document.querySelector('#menu-btn')
   ) {
      sideBar.classList.remove('active');
      body.classList.remove('active');
   }
})

sideBar.onclick = (e) => {
   e.stopPropagation();
};

window.onscroll = () =>{
   if(window.innerWidth < 1200){
      sideBar.classList.remove('active');
      body.classList.remove('active');
   }
};

async function initVideo() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoSlug = urlParams.get('slug');

    if (!videoSlug) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = await getCurrentUser();
    if (currentUser) {
        currentProfile = await getProfile(currentUser.id);
        updateUIForAuthenticatedUser();
    } else {
        updateUIForUnauthenticatedUser();
    }

    await loadVideo(videoSlug);
    setupEventListeners();
    setupSidebarNavigation();
}

function updateUIForAuthenticatedUser() {
    const profileElements = document.querySelectorAll('.profile .name');
    profileElements.forEach(el => {
        el.textContent = currentProfile?.name || 'User';
    });

    const avatars = document.querySelectorAll('.profile .image');
    avatars.forEach(el => {
        if (currentProfile?.avatar_url) {
            el.src = currentProfile.avatar_url;
        }
    });

    const authButtons = document.querySelectorAll('.flex-btn');
    authButtons.forEach(btn => {
        btn.style.display = 'none';
    });
}

function updateUIForUnauthenticatedUser() {
    document.getElementById('comment-form-container').innerHTML = `
        <div class="login-prompt">
            <p>Please log in to post comments</p>
            <a href="login.html" class="btn">Log In</a>
        </div>
    `;
}

async function loadVideo(slug) {
    const { data: video, error } = await supabase
        .from('videos')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error || !video) {
        console.error('Error loading video:', error);
        alert('Video not found');
        window.location.href = 'index.html';
        return;
    }

    currentVideo = video;

    document.getElementById('video-iframe').src = video.video_url;
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-description').textContent = video.description;
    document.getElementById('video-date').textContent = new Date(video.created_at).toLocaleDateString();

    await loadLikes();
    await loadComments();
    await loadQuiz();
}

async function loadLikes() {
    const { data: likes } = await supabase
        .from('video_likes')
        .select('*')
        .eq('video_id', currentVideo.id);

    document.getElementById('like-count').textContent = likes?.length || 0;

    if (currentUser) {
        const userLike = likes?.find(like => like.user_id === currentUser.id);
        if (userLike) {
            document.getElementById('like-btn').classList.add('liked');
            const icon = document.querySelector('#like-btn i');
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
    }
}

async function loadComments() {
    const { data: comments } = await supabase
        .from('comments')
        .select(`
            *,
            profiles (name, avatar_url)
        `)
        .eq('video_id', currentVideo.id)
        .order('created_at', { ascending: false });

    const commentsList = document.getElementById('comments-list');
    const commentCount = document.getElementById('comment-count');

    commentCount.textContent = `(${comments?.length || 0})`;

    if (!comments || comments.length === 0) {
        commentsList.innerHTML = '<p style="color: var(--light-color); font-size: 1.6rem;">No comments yet. Be the first to comment!</p>';
        return;
    }

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <img src="${comment.profiles?.avatar_url || 'https://via.placeholder.com/40'}" alt="Avatar" class="comment-avatar">
                <div class="comment-author">
                    <span class="comment-author-name">${comment.profiles?.name || 'Anonymous'}</span>
                    <span class="comment-date">${formatDate(comment.created_at)}</span>
                </div>
            </div>
            <p class="comment-content">${escapeHtml(comment.content)}</p>
            ${currentUser && comment.user_id === currentUser.id ? `
                <div class="comment-actions">
                    <button onclick="deleteComment('${comment.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function loadQuiz() {
    const { data: quiz } = await supabase
        .from('quizzes')
        .select(`
            *,
            quiz_questions (
                *,
                quiz_options (*)
            )
        `)
        .eq('video_id', currentVideo.id)
        .maybeSingle();

    if (quiz) {
        currentQuiz = quiz;
        document.getElementById('quiz-btn').style.display = 'flex';
    } else {
        document.getElementById('quiz-btn').style.display = 'none';
    }
}

function setupEventListeners() {
    document.getElementById('like-btn').addEventListener('click', async () => {
        if (!currentUser) {
            alert('Please log in to like videos');
            window.location.href = 'login.html';
            return;
        }

        const likeBtn = document.getElementById('like-btn');
        const isLiked = likeBtn.classList.contains('liked');

        if (isLiked) {
            await supabase
                .from('video_likes')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('video_id', currentVideo.id);

            likeBtn.classList.remove('liked');
            const icon = likeBtn.querySelector('i');
            icon.classList.remove('fas');
            icon.classList.add('far');
        } else {
            await supabase
                .from('video_likes')
                .insert([{
                    user_id: currentUser.id,
                    video_id: currentVideo.id
                }]);

            likeBtn.classList.add('liked');
            const icon = likeBtn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
        }

        await loadLikes();
    });

    const postCommentBtn = document.getElementById('post-comment-btn');
    if (postCommentBtn) {
        postCommentBtn.addEventListener('click', async () => {
            const input = document.getElementById('comment-input');
            const content = input.value.trim();

            if (!content) {
                alert('Please enter a comment');
                return;
            }

            const { error } = await supabase
                .from('comments')
                .insert([{
                    user_id: currentUser.id,
                    video_id: currentVideo.id,
                    content: content
                }]);

            if (error) {
                alert('Failed to post comment');
                return;
            }

            input.value = '';
            await loadComments();
        });
    }

    document.getElementById('quiz-btn')?.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please log in to take quizzes');
            window.location.href = 'login.html';
            return;
        }

        showQuizModal();
    });

    document.getElementById('close-quiz-modal').addEventListener('click', () => {
        document.getElementById('quiz-modal').style.display = 'none';
    });

    document.getElementById('submit-quiz-btn').addEventListener('click', submitQuiz);
    document.getElementById('retake-quiz-btn').addEventListener('click', resetQuiz);
}

function setupSidebarNavigation() {
    const navLinks = document.querySelectorAll('.navbar a[data-slug]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const slug = link.getAttribute('data-slug');
            window.location.href = `video.html?slug=${slug}`;
        });
    });
}

function showQuizModal() {
    if (!currentQuiz) return;

    document.getElementById('quiz-title').textContent = currentQuiz.title;
    document.getElementById('quiz-description').textContent = currentQuiz.description || '';

    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = currentQuiz.quiz_questions
        .sort((a, b) => a.order_index - b.order_index)
        .map((question, index) => `
            <div class="quiz-question" data-question-id="${question.id}">
                <div class="question-text">${index + 1}. ${question.question_text}</div>
                <div class="quiz-options">
                    ${question.quiz_options
                        .sort((a, b) => a.order_index - b.order_index)
                        .map(option => `
                            <div class="quiz-option">
                                <input type="radio" id="option-${option.id}" name="question-${question.id}" value="${option.option_key}">
                                <label for="option-${option.id}">${option.option_key}. ${option.option_text}</label>
                            </div>
                        `).join('')}
                </div>
            </div>
        `).join('');

    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('submit-quiz-btn').style.display = 'block';
    document.getElementById('quiz-modal').style.display = 'flex';
}

async function submitQuiz() {
    const questions = currentQuiz.quiz_questions;
    let score = 0;

    questions.forEach(question => {
        const selected = document.querySelector(`input[name="question-${question.id}"]:checked`);
        if (selected && selected.value === question.correct_answer) {
            score++;
        }
    });

    await supabase
        .from('quiz_attempts')
        .insert([{
            user_id: currentUser.id,
            quiz_id: currentQuiz.id,
            score: score,
            total_questions: questions.length
        }]);

    document.getElementById('quiz-score').textContent = score;
    document.getElementById('quiz-total').textContent = questions.length;
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('submit-quiz-btn').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
}

function resetQuiz() {
    showQuizModal();
}

window.deleteComment = async function(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) {
        alert('Failed to delete comment');
        return;
    }

    await loadComments();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

initVideo();

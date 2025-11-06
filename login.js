import { login } from './auth.js';

const loginForm = document.getElementById('login-form');
const loginMsg = document.getElementById('login-msg');

document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginMsg.textContent = '';
  loginMsg.style.color = '#b00020';

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;

  if (!email || !password) {
    loginMsg.textContent = 'Please enter email and password.';
    return;
  }

  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';

  const result = await login(email, password);

  if (result.success) {
    loginMsg.style.color = '#2a8f3a';
    loginMsg.textContent = 'Login successful! Redirecting...';
    setTimeout(() => location.href = 'index.html', 800);
  } else {
    loginMsg.textContent = result.error || 'Login failed. Please check your credentials.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log In';
  }
});

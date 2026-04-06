document.addEventListener('DOMContentLoaded', () => {
  const wrapper      = document.querySelector('.wrapper');
  const registerLink = document.querySelector('.register-link');
  const loginLink    = document.querySelector('.login-link');

  registerLink.addEventListener('click', e => {
    e.preventDefault();
    wrapper.classList.add('active');
  });

  loginLink.addEventListener('click', e => {
    e.preventDefault();
    wrapper.classList.remove('active');
  });

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isLogin = form.closest('.form-box').classList.contains('login');
      const url = isLogin
        ? 'http://localhost:8080/api/login'
        : 'http://localhost:8080/api/signup';

      const data = {};
      form.querySelectorAll('input[name]').forEach(input => {
        data[input.name] = input.value;
      });

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorMsg = await res.text();
          alert(errorMsg || "Invalid Credentials");
          return;
        }

        const result = await res.json(); // Only parse once

        if (isLogin) {
          // For successful login, Java backend returns user object with id, name, email, role
          if (result.id && result.email) {
            // Store user data for later use
            localStorage.setItem('email', result.email);
            localStorage.setItem('username', result.name);
            localStorage.setItem('userId', result.id);
            localStorage.setItem('userRole', result.role || 'user');
            window.location.href = '/';
          } else {
            alert("Login failed");
          }
        } else {
          // For signup, check if response is successful
          alert("Signup successful! Please log in.");
        }

      } catch (err) {
        console.error(err);
        alert('Error connecting to backend');
      }
    });
  });
});

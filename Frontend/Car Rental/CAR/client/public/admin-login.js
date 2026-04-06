document.addEventListener('DOMContentLoaded', () => {
  const adminLoginForm = document.getElementById('admin-login-form');

  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {};
    adminLoginForm.querySelectorAll('input[name]').forEach(input => {
      data[input.name] = input.value;
    });

    try {
      const res = await fetch('http://localhost:8080/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        alert(errorMsg || "Invalid admin credentials");
        return;
      }

      const result = await res.json();

      // For successful admin login
      if (result.id && result.email && result.role === 'admin') {
        // Store admin data
        localStorage.setItem('email', result.email);
        localStorage.setItem('username', result.name);
        localStorage.setItem('userId', result.id);
        localStorage.setItem('userRole', result.role);
        
        // Redirect to dashboard
        window.location.href = '/owner';
      } else {
        alert("Admin login failed");
      }

    } catch (err) {
      console.error(err);
      alert('Error connecting to backend');
    }
  });
});

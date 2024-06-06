document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('signup-form');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://127.0.0.1:8081/user/login/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {
                const token = data.token;
                sessionStorage.setItem('token', token);
                window.location.href = "home.html";
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    });

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const username = document.getElementById('signup-username').value;
        const first_name = document.getElementById('signup-firstname').value;
        const last_name = document.getElementById('signup-lastname').value;
        const noHouse = document.getElementById('signup-noHouse').value;
        const street = document.getElementById('signup-street').value;
        const district = document.getElementById('signup-district').value;
        const city = document.getElementById('signup-city').value;
        const country = document.getElementById('signup-country').value;

        try {
            const response = await fetch('http://127.0.0.1:8081/user/register/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    account: {
                        username: username,
                        password: password
                    },
                    fullname: {
                        first_name: first_name,
                        last_name: last_name
                    },
                    address: {
                        noHouse: noHouse,
                        street: street,
                        district: district,
                        city: city,
                        country: country
                    }
                })
            });

            if (!response.ok) {
                alert('Registration failed');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error registering:', error);
        }
    });

    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const loginContainer = document.getElementById("login");
    const signupContainer = document.getElementById("signup");
    loginBtn.addEventListener("click", function () {
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
        loginContainer.classList.remove("hidden");
        signupContainer.classList.add("hidden");
    });

    signupBtn.addEventListener("click", function () {
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
        signupContainer.classList.remove("hidden");
        loginContainer.classList.add("hidden");
    });
});

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // ⛔ stop page reload

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    // ✅ SAVE TOKEN
    localStorage.setItem("token", data.token);

    // ✅ REDIRECT
    window.location.href = "/client/dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});

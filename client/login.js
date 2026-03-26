console.log("login.js loaded");

document.getElementById("loginBtn").addEventListener("click", async () => {
  console.log("Login button clicked");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // ✅ SAVE TOKEN
    localStorage.setItem("token", data.token);

    console.log("Saved token:", data.token);
    console.log("From storage:", localStorage.getItem("token"));

    // ✅ REDIRECT
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("Login error:", err);
    alert("Server error");
  }
});
// after login success
localStorage.setItem("token", data.token);
window.location.href = "/client/dashboard.html";


document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  try {
    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("user_name", result.user_name);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      const errorData = await response.json();
      alert(`Login failed: ${errorData.detail || "Invalid credentials"}`);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("An error occurred. Please try again.");
  }
});

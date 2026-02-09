document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    window.location.href = "login.html";
    return;
  }
  const nameInput = document.getElementById("profile-name");
  const emailInput = document.getElementById("profile-email");
  const phoneInput = document.getElementById("profile-phone");
  const addressInput = document.getElementById("profile-address");
  const headerUserName = document.getElementById("header-user-name");
  const profileForm = document.querySelector(".profile-form");

  try {
    const response = await fetch("http://localhost:8000/api/auth/profile", {
      headers: {
        "User-ID": userId,
      },
    });
    if (response.ok) {
      const user = await response.json();
      nameInput.value = user.name;
      emailInput.value = user.email;
      phoneInput.value = user.phone;
      addressInput.value = user.address;
      headerUserName.textContent = user.name;
    } else {
      console.error("Failed to fetch profile");
      alert("Could not load profile details.");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedData = {
      name: nameInput.value,
      email: emailInput.value.trim(),
      phone: phoneInput.value,
      address: addressInput.value,
    };
    try {
      const response = await fetch("http://localhost:8000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "User-ID": userId,
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const user = await response.json();
        headerUserName.textContent = user.name;
        localStorage.setItem("user_name", user.name);
        alert("Profile updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || "Failed to update profile"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating profile.");
    }
  });
  document.querySelector(".btn-secondary").addEventListener("click", () => {
    location.reload();
  });
});

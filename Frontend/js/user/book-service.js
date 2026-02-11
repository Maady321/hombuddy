document.addEventListener("DOMContentLoaded", async () => {
  window.checkAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get("service_id") || 1;

  document.getElementById("service_id").value = serviceId;
  try {
    const response = await makeRequest(`/api/services/${serviceId}`);
    if (response.ok) {
      const service = await response.json();
      document.getElementById("display-service-name").textContent =
        service.name;
      document.getElementById("display-service-price").textContent =
        `Starting at ₹${service.price}`;
      let icon = "fa-wrench";
      const name = service.name.toLowerCase();
      if (name.includes("clean")) icon = "fa-broom";
      else if (name.includes("plumb")) icon = "fa-faucet";
      else if (name.includes("elect")) icon = "fa-plug";
      else if (name.includes("garden")) icon = "fa-seedling";
      else if (name.includes("paint")) icon = "fa-paint-roller";
      else if (name.includes("appliance")) icon = "fa-screwdriver-wrench";
      else if (name.includes("window")) icon = "fa-window-maximize";
      else if (name.includes("move")) icon = "fa-truck-moving";
      document.querySelector(
        "#selected-service-display .service-icon",
      ).innerHTML = `<i class="fa-solid ${icon}"></i>`;
    }
  } catch (e) {
    console.log("Could not fetch service details");
  }
  document
    .getElementById("booking-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = {
        service_id: parseInt(document.getElementById("service_id").value),
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        pincode: document.getElementById("zipcode").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        instructions: document.getElementById("notes").value,
      };
      try {
        const response = await makeRequest(`/api/bookings`, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const result = await response.json();
          alert("Booking created successfully!");
          window.location.href = "my-bookings.html";
        } else {
          const errorData = await response.json();
          alert(`Booking failed: ${errorData.detail || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error booking:", error);
        alert("An error occurred. Please try again.");
      }
    });
});

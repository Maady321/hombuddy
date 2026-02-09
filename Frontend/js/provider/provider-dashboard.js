document.addEventListener("DOMContentLoaded", async () => {
  const providerId = localStorage.getItem("provider_id");
  if (!providerId) {
    window.location.href = "provider-login.html";
    return;
  }
  updateNavBar();
  updateStatistics();
  const container = document.getElementById("bookings-container");
  try {
    const response = await fetch(
      "http://localhost:8000/api/bookings/provider/pending",
      {
        headers: {
          "Provider-ID": localStorage.getItem("provider_id"),
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const bookings = await response.json();
    if (bookings.length === 0) {
      container.innerHTML = `
                <div class="no-bookings">
                    <p>No new requests at the moment.</p>
                </div>`;
      return;
    }
    container.innerHTML = "";

    bookings.forEach((booking) => {
      const card = document.createElement("div");
      card.className = "order-card";
      const serviceName = booking.service_id; 
      card.innerHTML = `
                <div class="order-header">
                  <span class="order-id">Order #${booking.id}</span>
                  <span class="order-status status-new">Request</span>
                </div>
                <div class="order-details">
                  <div class="order-detail">
                    <span class="detail-label">Service</span>
                    <span class="detail-value"><i class="fa-solid fa-bell-concierge"></i> ${booking.service_name}</span>
                  </div>
                  <div class="order-detail">
                    <span class="detail-label">Date & Time</span>
                    <span class="detail-value"><i class="fa-regular fa-calendar"></i> ${booking.date} - <i class="fa-regular fa-clock"></i> ${booking.time}</span>
                  </div>
                  <div class="order-detail">
                    <span class="detail-label">Instructions</span>
                    <span class="detail-value"><i class="fa-solid fa-circle-info"></i> ${booking.instructions}</span>
                  </div>
                  <div class="order-detail">
                    <span class="detail-label">Address</span>
                    <span class="detail-value"><i class="fa-solid fa-location-dot"></i> ${booking.address}, ${booking.city}</span>
                  </div>
                </div>
                <div class="order-actions">
                    <button class="btn-accept" onclick="acceptBooking(${booking.id})"><i class="fa-solid fa-check"></i> Accept Order</button>
                    <!-- Reject not implemented in backend yet -->
                </div>
            `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error:", error);
    container.innerHTML = `<div class="no-bookings"><p>Error loading requests.</p></div>`;
  }
});
async function updateStatistics() {
  try {
    const response = await fetch(
      "http://localhost:8000/api/bookings/provider/statistics",
      {
        headers: {
          "Provider-ID": localStorage.getItem("provider_id"),
        },
      },
    );
    if (response.ok) {
      const stats = await response.json();
      document.getElementById("stat-pending").textContent = stats.pending;
      document.getElementById("stat-accepted").textContent = stats.accepted;
      document.getElementById("stat-completed").textContent = stats.completed;
      document.getElementById("stat-rating").textContent = stats.rating;
      document.getElementById("stat-earnings").textContent =
        `₹${stats.earnings}`;
      document.getElementById("stat-completion-rate").textContent =
        `${stats.completion_rate}%`;
      const providerName = localStorage.getItem("provider_name");
      if (providerName) {
        document.getElementById("provider-name").textContent = providerName;
      }
    }
  } catch (error) {
    console.error("Error updating stats:", error);
    // alert.("erroe in updating")
  }
}
function updateNavBar() {
  const providerName = localStorage.getItem("provider_name");
  if (providerName) {
    const nameEl = document.getElementById("nav-provider-name");
    const avatarEl = document.getElementById("nav-provider-avatar");
    if (nameEl) nameEl.textContent = providerName;
    if (avatarEl) {
      const initials = providerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
      avatarEl.textContent = initials;
    }
  }
}
async function acceptBooking(bookingId) {
  if (!confirm("Are you sure you want to accept this booking?")) return;

  try {
    const response = await fetch(
      `http://localhost:8000/api/bookings/provider/${bookingId}/confirm`,
      {
        method: "PUT",
        headers: {
          "Provider-ID": localStorage.getItem("provider_id"),
        },
      },
    );

    if (response.ok) {
      alert("Booking confirmed!");
      await updateStatistics();
      location.reload();
    } else {
      const error = await response.json();
      alert(`Error: ${error.detail}`);
    }
  } catch (error) {
    console.error("Error accepting:", error);
    alert("Failed to accept booking");
  }
}

const state = {
  dashboard: null,
  rooms: [],
  guests: [],
  bookings: []
};

const navItems = document.querySelectorAll('.nav-item');
const tabPanels = document.querySelectorAll('.tab-panel');
const summaryCards = document.getElementById('summaryCards');
const roomsTable = document.getElementById('roomsTable');
const guestsTable = document.getElementById('guestsTable');
const bookingsTable = document.getElementById('bookingsTable');
const upcomingReservations = document.getElementById('upcomingReservations');
const recentBookings = document.getElementById('recentBookings');

const roomForm = document.getElementById('roomForm');
const guestForm = document.getElementById('guestForm');
const bookingForm = document.getElementById('bookingForm');
const bookingGuestSelect = document.getElementById('bookingGuestSelect');
const bookingRoomSelect = document.getElementById('bookingRoomSelect');

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function setActiveTab(tabName) {
  navItems.forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tabName);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === tabName);
  });
}

navItems.forEach((button) => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tab));
});

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed.' }));
    throw new Error(error.error || 'Request failed.');
  }

  return response.json();
}

function renderSummaryCards() {
  if (!state.dashboard) return;

  const items = [
    { label: 'Total rooms', value: state.dashboard.summary.totalRooms },
    { label: 'Occupancy rate', value: `${state.dashboard.occupancyRate}%` },
    { label: 'Available', value: state.dashboard.summary.availableRooms },
    { label: 'Revenue', value: currency.format(state.dashboard.summary.totalRevenue) }
  ];

  summaryCards.innerHTML = items
    .map(
      (item) => `
        <div class="card">
          <div class="card-label">${item.label}</div>
          <div class="card-value">${item.value}</div>
          <div class="card-subtext">Updated live</div>
        </div>
      `
    )
    .join('');
}

function renderUpcomingReservations() {
  if (!state.dashboard) return;

  const items = state.dashboard.upcomingReservations.length
    ? state.dashboard.upcomingReservations
        .map(
          (booking) => `
            <div class="stack-item">
              <div>
                <strong>${booking.guestName}</strong>
                <span>Room ${booking.roomNumber}</span>
              </div>
              <div>
                <strong>${booking.checkIn}</strong>
                <span>${booking.nights} nights</span>
              </div>
              <span class="badge confirmed">${booking.status}</span>
            </div>
          `
        )
        .join('')
    : '<p>No confirmed reservations.</p>';

  upcomingReservations.innerHTML = items;
}

function renderRecentBookings() {
  if (!state.dashboard) return;

  const items = state.dashboard.recentBookings.length
    ? state.dashboard.recentBookings
        .map(
          (booking) => `
            <div class="stack-item">
              <div>
                <strong>${booking.guestName}</strong>
                <span>${booking.roomNumber}</span>
              </div>
              <div>
                <strong>${currency.format(booking.totalAmount)}</strong>
                <span>${booking.status}</span>
              </div>
            </div>
          `
        )
        .join('')
    : '<p>No recent bookings.</p>';

  recentBookings.innerHTML = items;
}

function renderRooms() {
  roomsTable.innerHTML = state.rooms
    .map(
      (room) => `
        <tr>
          <td>Room ${room.roomNumber}</td>
          <td>${room.type}</td>
          <td>${currency.format(room.pricePerNight)}</td>
          <td>${room.capacity}</td>
          <td><span class="badge ${room.status}">${room.status}</span></td>
          <td>${room.notes || '—'}</td>
        </tr>
      `
    )
    .join('');
}

function renderGuests() {
  guestsTable.innerHTML = state.guests
    .map(
      (guest) => `
        <tr>
          <td>${guest.firstName} ${guest.lastName}</td>
          <td>${guest.email}</td>
          <td>${guest.phone || '—'}</td>
          <td>${guest.nationality || '—'}</td>
          <td><span class="badge ${guest.vip ? 'confirmed' : 'completed'}">${guest.vip ? 'VIP' : 'Regular'}</span></td>
        </tr>
      `
    )
    .join('');
}

function renderBookings() {
  bookingsTable.innerHTML = state.bookings
    .map(
      (booking) => `
        <tr>
          <td>${booking.guestName}</td>
          <td>Room ${booking.roomNumber}</td>
          <td>${booking.checkIn} → ${booking.checkOut}</td>
          <td>${booking.nights}</td>
          <td><span class="badge ${booking.status}">${booking.status}</span></td>
          <td>${currency.format(booking.totalAmount)}</td>
          <td>
            <div class="actions">
              <button class="button secondary" data-action="checkin" data-id="${booking.id}">Check in</button>
              <button class="button secondary" data-action="checkout" data-id="${booking.id}">Check out</button>
              <button class="button danger" data-action="delete-booking" data-id="${booking.id}">Delete</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

function renderBookingOptions() {
  bookingGuestSelect.innerHTML = state.guests
    .map((guest) => `<option value="${guest.id}">${guest.firstName} ${guest.lastName}</option>`)
    .join('');

  bookingRoomSelect.innerHTML = state.rooms
    .filter((room) => room.status !== 'maintenance')
    .map((room) => `<option value="${room.id}">Room ${room.roomNumber} (${room.type})</option>`)
    .join('');
}

async function loadData() {
  try {
    const [dashboard, rooms, guests, bookings] = await Promise.all([
      fetchJson('/api/dashboard'),
      fetchJson('/api/rooms'),
      fetchJson('/api/guests'),
      fetchJson('/api/bookings')
    ]);

    state.dashboard = dashboard;
    state.rooms = rooms;
    state.guests = guests;
    state.bookings = bookings;

    renderSummaryCards();
    renderUpcomingReservations();
    renderRecentBookings();
    renderRooms();
    renderGuests();
    renderBookings();
    renderBookingOptions();
  } catch (error) {
    alert(error.message);
  }
}

roomForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(roomForm);

  try {
    await fetchJson('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({
        roomNumber: formData.get('roomNumber'),
        type: formData.get('type'),
        pricePerNight: Number(formData.get('pricePerNight')),
        capacity: Number(formData.get('capacity')),
        notes: formData.get('notes'),
        status: formData.get('status')
      })
    });

    roomForm.reset();
    roomForm.classList.add('hidden');
    await loadData();
  } catch (error) {
    alert(error.message);
  }
});

guestsTable.addEventListener('click', async (event) => {
  const action = event.target.dataset.action;
  if (!action) return;
  // no guest delete action at the moment
});

guestsTable.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.action === 'delete') {
    console.log('Guest management not yet implemented');
  }
});

guestsTable.addEventListener('click', (event) => {
  if (!event.target.closest('button')) return;
  event.preventDefault();
});

guestsTable.addEventListener('click', (event) => {
  if (!event.target.closest('button')) return;
  alert('Guest detail management is not available in this version.');
});

guestForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(guestForm);

  try {
    await fetchJson('/api/guests', {
      method: 'POST',
      body: JSON.stringify({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        nationality: formData.get('nationality'),
        vip: Boolean(formData.get('vip'))
      })
    });

    guestForm.reset();
    guestForm.classList.add('hidden');
    await loadData();
  } catch (error) {
    alert(error.message);
  }
});

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);

  try {
    await fetchJson('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        guestId: formData.get('guestId'),
        roomId: formData.get('roomId'),
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut')
      })
    });

    bookingForm.reset();
    bookingForm.classList.add('hidden');
    await loadData();
  } catch (error) {
    alert(error.message);
  }
});

bookingsTable.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, id } = button.dataset;

  try {
    if (action === 'checkin') {
      await fetchJson(`/api/bookings/${id}/checkin`, { method: 'PUT' });
    }

    if (action === 'checkout') {
      await fetchJson(`/api/bookings/${id}/checkout`, { method: 'PUT' });
    }

    if (action === 'delete-booking') {
      await fetchJson(`/api/bookings/${id}`, { method: 'DELETE' });
    }

    await loadData();
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById('toggleRoomForm').addEventListener('click', () => {
  roomForm.classList.toggle('hidden');
});

document.getElementById('toggleGuestForm').addEventListener('click', () => {
  guestForm.classList.toggle('hidden');
});

document.getElementById('toggleBookingForm').addEventListener('click', () => {
  bookingForm.classList.toggle('hidden');
});

loadData();

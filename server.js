const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'hotel-data.json');

const seedData = {
  rooms: [
    { id: 'room-1', roomNumber: '101', type: 'Deluxe', pricePerNight: 180, capacity: 2, status: 'available', notes: 'Garden view' },
    { id: 'room-2', roomNumber: '102', type: 'Standard', pricePerNight: 120, capacity: 2, status: 'occupied', notes: 'Quiet corner room' },
    { id: 'room-3', roomNumber: '201', type: 'Suite', pricePerNight: 260, capacity: 4, status: 'available', notes: 'Two-bedroom suite' },
    { id: 'room-4', roomNumber: '202', type: 'Executive', pricePerNight: 210, capacity: 2, status: 'maintenance', notes: 'Under repair' },
    { id: 'room-5', roomNumber: '301', type: 'Standard', pricePerNight: 130, capacity: 2, status: 'occupied', notes: 'City view, near elevator' }
  ],
  guests: [
    { id: 'guest-1', firstName: 'Emma', lastName: 'Brown', email: 'emma.brown@example.com', phone: '555-0101', nationality: 'American', vip: true },
    { id: 'guest-2', firstName: 'Daniel', lastName: 'Miller', email: 'daniel.miller@example.com', phone: '555-0102', nationality: 'Canadian', vip: false },
    { id: 'guest-3', firstName: 'Sofia', lastName: 'Nguyen', email: 'sofia.nguyen@example.com', phone: '555-0103', nationality: 'Vietnamese', vip: true }
  ],
  bookings: [
    {
      id: 'booking-1',
      guestId: 'guest-1',
      roomId: 'room-1',
      roomNumber: '101',
      guestName: 'Emma Brown',
      checkIn: '2026-10-22',
      checkOut: '2026-10-27',
      nights: 5,
      status: 'checked-in',
      totalAmount: 900,
      createdAt: '2026-10-20T08:00:00.000Z'
    },
    {
      id: 'booking-2',
      guestId: 'guest-2',
      roomId: 'room-2',
      roomNumber: '102',
      guestName: 'Daniel Miller',
      checkIn: '2026-10-23',
      checkOut: '2026-10-30',
      nights: 7,
      status: 'confirmed',
      totalAmount: 840,
      createdAt: '2026-10-21T09:00:00.000Z'
    },
    {
      id: 'booking-3',
      guestId: 'guest-3',
      roomId: 'room-5',
      roomNumber: '301',
      guestName: 'Sofia Nguyen',
      checkIn: '2026-10-25',
      checkOut: '2026-10-28',
      nights: 3,
      status: 'checked-in',
      totalAmount: 390,
      createdAt: '2026-10-22T10:00:00.000Z'
    }
  ]
};

const ensureDataFile = () => {
  const dir = path.dirname(DATA_FILE);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2));
  }
};

const readData = () => {
  ensureDataFile();

  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const parsed = JSON.parse(raw);

  return {
    rooms: Array.isArray(parsed.rooms) ? parsed.rooms : [],
    guests: Array.isArray(parsed.guests) ? parsed.guests : [],
    bookings: Array.isArray(parsed.bookings) ? parsed.bookings : []
  };
};

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  const nights = diff / (1000 * 60 * 60 * 24);

  return Number.isFinite(nights) && nights > 0 ? nights : 0;
};

const updateRoomStatus = (room, bookings) => {
  const active = bookings.some((booking) =>
    booking.roomId === room.id && ['confirmed', 'checked-in'].includes(booking.status)
  );

  if (room.status === 'maintenance') {
    return room.status;
  }

  return active ? 'occupied' : 'available';
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hotel management system is running.' });
});

app.get('/api/dashboard', (req, res) => {
  const { rooms, guests, bookings } = readData();
  const totalRooms = rooms.length;
  const occupyingBookings = bookings.filter((booking) => ['confirmed', 'checked-in'].includes(booking.status));
  const occupiedRooms = new Set(occupyingBookings.map((booking) => booking.roomId)).size;
  const availableRooms = rooms.filter((room) => room.status === 'available').length;
  const maintenanceRooms = rooms.filter((room) => room.status === 'maintenance').length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);
  const upcomingReservations = bookings
    .filter((booking) => booking.status === 'confirmed')
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
    .slice(0, 5);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn))
    .slice(0, 5);

  const dashboard = {
    summary: {
      totalRooms,
      occupiedRooms,
      availableRooms,
      maintenanceRooms,
      totalGuests: guests.length,
      totalRevenue
    },
    occupancyRate: totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
    upcomingReservations,
    recentBookings
  };

  res.json(dashboard);
});

app.get('/api/rooms', (req, res) => {
  const { rooms, bookings } = readData();

  const normalizedRooms = rooms.map((room) => ({
    ...room,
    status: updateRoomStatus(room, bookings)
  }));

  saveData({ ...readData(), rooms: normalizedRooms });
  res.json(normalizedRooms);
});

app.post('/api/rooms', (req, res) => {
  const { rooms } = readData();
  const { roomNumber, type, pricePerNight, capacity, notes, status } = req.body;

  if (!roomNumber || !type || !pricePerNight || !capacity) {
    return res.status(400).json({ error: 'roomNumber, type, pricePerNight, and capacity are required.' });
  }

  if (rooms.some((room) => room.roomNumber === String(roomNumber))) {
    return res.status(409).json({ error: 'A room with this number already exists.' });
  }

  const newRoom = {
    id: createId('room'),
    roomNumber: String(roomNumber),
    type,
    pricePerNight: Number(pricePerNight),
    capacity: Number(capacity),
    status: status || 'available',
    notes: notes || ''
  };

  rooms.push(newRoom);
  saveData({ ...readData(), rooms });

  res.status(201).json(newRoom);
});

app.get('/api/guests', (req, res) => {
  const { guests } = readData();
  res.json(guests);
});

app.post('/api/guests', (req, res) => {
  const { guests } = readData();
  const { firstName, lastName, email, phone, nationality, vip } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName, and email are required.' });
  }

  const newGuest = {
    id: createId('guest'),
    firstName,
    lastName,
    email,
    phone: phone || '',
    nationality: nationality || '',
    vip: Boolean(vip)
  };

  guests.push(newGuest);
  saveData({ ...readData(), guests });

  res.status(201).json(newGuest);
});

app.get('/api/bookings', (req, res) => {
  const { bookings } = readData();
  res.json(bookings.sort((a, b) => new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn)));
});

app.post('/api/bookings', (req, res) => {
  const { rooms, guests, bookings } = readData();
  const { guestId, roomId, checkIn, checkOut, status } = req.body;

  if (!guestId || !roomId || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'guestId, roomId, checkIn, and checkOut are required.' });
  }

  const guest = guests.find((item) => item.id === guestId);
  const room = rooms.find((item) => item.id === roomId);

  if (!guest) {
    return res.status(404).json({ error: 'Guest not found.' });
  }

  if (!room) {
    return res.status(404).json({ error: 'Room not found.' });
  }

  const nights = calculateNights(checkIn, checkOut);
  const totalAmount = nights * Number(room.pricePerNight || 0);

  const booking = {
    id: createId('booking'),
    guestId: guest.id,
    roomId: room.id,
    roomNumber: room.roomNumber,
    guestName: `${guest.firstName} ${guest.lastName}`,
    checkIn,
    checkOut,
    nights,
    status: status || 'confirmed',
    totalAmount,
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);

  const updatedRooms = rooms.map((item) => {
    if (item.id !== roomId) return item;
    return { ...item, status: 'occupied' };
  });

  saveData({ rooms: updatedRooms, guests, bookings });
  res.status(201).json(booking);
});

app.put('/api/bookings/:id/checkin', (req, res) => {
  const { rooms, bookings } = readData();
  const bookingIndex = bookings.findIndex((booking) => booking.id === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  bookings[bookingIndex].status = 'checked-in';

  const updatedRooms = rooms.map((room) => {
    if (room.id === bookings[bookingIndex].roomId) {
      return { ...room, status: 'occupied' };
    }
    return room;
  });

  saveData({ rooms: updatedRooms, ...readData(), bookings });
  res.json(bookings[bookingIndex]);
});

app.put('/api/bookings/:id/checkout', (req, res) => {
  const { rooms, bookings } = readData();
  const bookingIndex = bookings.findIndex((booking) => booking.id === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  bookings[bookingIndex].status = 'completed';

  const updatedRooms = rooms.map((room) => {
    if (room.id === bookings[bookingIndex].roomId) {
      return { ...room, status: 'available' };
    }
    return room;
  });

  saveData({ rooms: updatedRooms, ...readData(), bookings });
  res.json(bookings[bookingIndex]);
});

app.delete('/api/bookings/:id', (req, res) => {
  const { rooms, bookings } = readData();
  const booking = bookings.find((item) => item.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const filteredBookings = bookings.filter((item) => item.id !== req.params.id);
  const updatedRooms = rooms.map((room) => {
    if (room.id === booking.roomId) {
      const activeMatch = filteredBookings.some((item) => item.roomId === room.id && ['confirmed', 'checked-in'].includes(item.status));
      return { ...room, status: activeMatch ? 'occupied' : 'available' };
    }
    return room;
  });

  saveData({ rooms: updatedRooms, ...readData(), bookings: filteredBookings });
  res.json({ message: 'Booking deleted successfully.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Hotel management system is running on http://localhost:${PORT}`);
});

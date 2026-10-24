* {
  box-sizing: border-box;
}

:root {
  --bg: #f6f7fb;
  --panel: #ffffff;
  --panel-alt: #eef3ff;
  --primary: #4c6fff;
  --primary-dark: #2c4de0;
  --text: #1c2438;
  --muted: #6c7891;
  --border: #e5eaf5;
  --success: #19b36b;
  --warning: #f5b14d;
  --danger: #e55d5d;
  --shadow: rgba(26, 33, 63, 0.08);
}

body {
  margin: 0;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #0f172a;
  color: #f8fbff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), #7aa2ff);
  font-weight: 700;
}

.brand h1 {
  margin: 0;
  font-size: 1.1rem;
}

.brand p {
  margin: 2px 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 14px;
  text-align: left;
  color: #ebf0ff;
  cursor: pointer;
  transition: 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
}

.sidebar-footer {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.sidebar-footer p,
.sidebar-footer span {
  margin: 0;
}

.main-content {
  flex: 1;
  padding: 28px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  color: var(--muted);
}

.topbar h2 {
  margin: 6px 0 0;
  font-size: 2rem;
}

.status-pill {
  background: rgba(25, 179, 107, 0.12);
  color: var(--success);
  border: 1px solid rgba(25, 179, 107, 0.22);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 600;
}

.tab-panel {
  display: none;
}

.tab-panel.active {
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 18px;
  margin-bottom: 20px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  box-shadow: var(--shadow);
}

.card-label {
  color: var(--muted);
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.card-subtext {
  font-size: 0.8rem;
  color: var(--muted);
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 20px;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.split {
  align-items: center;
}

.stack-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stack-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: var(--panel-alt);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
}

.stack-item strong {
  display: block;
  margin-bottom: 4px;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
}

.badge.confirmed {
  background: rgba(76, 111, 255, 0.12);
  color: var(--primary);
}

.badge.checked-in {
  background: rgba(25, 179, 107, 0.12);
  color: var(--success);
}

.badge.completed {
  background: rgba(108, 120, 145, 0.08);
  color: var(--muted);
}

.badge.available {
  background: rgba(25, 179, 107, 0.12);
  color: var(--success);
}

.badge.occupied {
  background: rgba(245, 177, 77, 0.12);
  color: #a76a00;
}

.badge.maintenance {
  background: rgba(229, 93, 93, 0.12);
  color: var(--danger);
}

.entry-form {
  padding: 18px;
  background: var(--panel-alt);
  border: 1px solid var(--border);
  border-radius: 14px;
  margin-bottom: 20px;
}

.hidden {
  display: none;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--muted);
  font-size: 0.82rem;
}

input,
select {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  color: var(--text);
}

.checkbox-wrap {
  display: flex;
  flex-direction: row !important;
  align-items: center;
  margin-top: 26px;
  gap: 10px;
}

.button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.button.primary {
  background: var(--primary);
  color: white;
}

.button.primary:hover {
  background: var(--primary-dark);
}

.button.secondary {
  background: rgba(76, 111, 255, 0.1);
  color: var(--primary);
}

.button.danger {
  background: rgba(229, 93, 93, 0.12);
  color: var(--danger);
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

th {
  color: var(--muted);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 22px 18px;
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .main-content {
    padding: 18px;
  }

  .chart-row {
    grid-template-columns: 1fr;
  }
}

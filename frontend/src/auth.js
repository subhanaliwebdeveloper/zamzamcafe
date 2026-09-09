const USERS_KEY = "zzc_users";
const SESSION_KEY = "zzc_session";

const defaultUsers = [
  { id: "admin-1", name: "Admin", email: "admin@zamzamcafe.com", password: "admin123", role: "ADMIN" }
];

function readUsers() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(USERS_KEY) || "null");
  } catch {
    saved = null;
  }
  if (!Array.isArray(saved)) saved = null;
  if (!saved) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return saved;
}

export function register(name, email, password, phone, address) {
  const users = readUsers();
  const normalized = email.trim().toLowerCase();
  if (users.some(u => u.email === normalized)) throw new Error("Email already registered.");
  const user = { id: crypto.randomUUID(), name: name.trim(), email: normalized, password, phone: phone.trim(), address: address.trim(), role: "CUSTOMER" };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const safe = { id: user.id, name: user.name, email: user.email, phone: user.phone || "", address: user.address || "", role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  return safe;
}

export function login(email, password) {
  const user = readUsers().find(u => u.email === email.trim().toLowerCase() && u.password === password);
  if (!user) throw new Error("Invalid email or password.");
  const safe = { id: user.id, name: user.name, email: user.email, phone: user.phone || "", address: user.address || "", role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  return safe;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session && typeof session === "object" ? session : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}
const db = require("../connect");
async function login(kode_unik) {
  try {
    if (!kode_unik) {
      return { success: false, message: "Kode unik wajib diisi" };
    }

    // 🔍 ambil data user
    const rows = await db.query(
      "SELECT * FROM users WHERE kode_unik = ?",
      [kode_unik]
    );

    if (rows.length === 0) {
      return { success: false, message: "Kode tidak ditemukan" };
    }

    const user = rows[0];

    // 🔥 update status online
    await db.query(
      "UPDATE users SET online = 'on' WHERE id = ?",
      [user.id]
    );

    return {
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        kode_unik: user.kode_unik,
        user: user.user,
        online: "on",
      },
    };

  } catch (err) {
    console.error("Login error:", err.message);
    return { success: false, message: "Server error" };
  }
}

// =====================
// 🔥 LOGOUT (NEW)
// =====================
async function logout(userId) {
  try {
    await db.query(
      "UPDATE users SET online = 'off' WHERE id = ?",
      [userId]
    );

    return { success: true };
  } catch (err) {
    console.error("Logout error:", err.message);
    return { success: false };
  }
}

module.exports = {
  login,
  logout,
};
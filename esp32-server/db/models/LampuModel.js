const db = require("../connect");

class LampuModel {

  // ======================
  // 🔥 UPDATE STATUS
  // ======================
  static async update(kode_unik, status = "off") {
    try {
      if (!kode_unik) {
        return { success: false, message: "kode_unik wajib" };
      }

      await db.query(
        "UPDATE lampu SET status = ? WHERE kode_unik = ?",
        [status, kode_unik]
      );

      return { success: true, status };

    } catch (err) {
      return { success: false, message: "DB error" };
    }
  }

  // ======================
  // 🔥 AMBIL STATUS
  // ======================
  static async lampuStatus(kode_unik) {
    try {
      const rows = await db.query(
        "SELECT id, status FROM lampu WHERE kode_unik = ?",
        [kode_unik]
      );

      const devices = {};

      rows.forEach(l => {
        devices["lampu_" + l.id] = (l.status === "on");
      });

      return {
        success: true,
        data: rows,
        devices
      };

    } catch (err) {
      return { success: false };
    }
  }
}

module.exports = LampuModel;
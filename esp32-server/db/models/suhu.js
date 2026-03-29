const db = require("../connect");

async function suhu(kode_unik, value){
    try {
        const query = `
            INSERT INTO suhu (kode_unik, value, created_at, updated_at)
            VALUES (?, ?, NOW(), NOW())
        `;

        await db.query(query, [kode_unik, value]);

    } catch (error) {
        console.error("❌ Error insert suhu:", error);
    }
}

module.exports = suhu;
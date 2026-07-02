const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(process.cwd(), "public");

app.use(express.static(publicDir));

app.get("/hady", (req, res) => {
    try {
        const keyword = (req.query.q || "").trim().toLowerCase();

        const files = fs.readdirSync(publicDir)
            .filter(file => file.toLowerCase().endsWith(".mp3"));

        const results = files
            .filter(file => {
                if (!keyword) return true;
                return file.toLowerCase().includes(keyword);
            })
            .map(file => ({
                judul: path.parse(file).name,
                link: `${req.protocol}://${req.get("host")}/${encodeURIComponent(file)}`
            }));

        res.json({
            status: true,
            total: results.length,
            result: results
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

// Halaman utama
app.get("/", (req, res) => {
    res.json({
        status: true,
        author: "Hady Zen'in",
        endpoint: "/hady?q=judul"
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan`);
});

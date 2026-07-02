const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "hady");

app.use(express.static(publicDir));

app.get("hady", (req, res) => {
    try {
        const files = fs.readdirSync(publicDir)
            .filter(file => file.toLowerCase().endsWith(".mp3"));

        if (!files.length) {
            return res.status(404).json({
                status: false,
                message: "Tidak ada file MP3."
            });
        }

        const protocol = req.protocol;
        const host = req.get("host");

        const data = files.map(file => ({
            judul: path.parse(file).name,
            link: `${protocol}://${host}/${encodeURIComponent(file)}`
        }));

        res.json({
            status: true,
            total: data.length,
            result: data
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan`);
});

const express = require("express");
const yts = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DOWNLOAD_DIR = path.join(__dirname, "downloads");

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

app.get("/hady", async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({
                status: false,
                message: "Parameter q wajib diisi"
            });
        }

        const search = await yts(keyword);

        if (!search.videos.length) {
            return res.status(404).json({
                status: false,
                message: "Video tidak ditemukan"
            });
        }

        const video = search.videos[0];

        const filename =
            video.title.replace(/[\\/:*?"<>|]/g, "") + ".mp3";

        const output = path.join(DOWNLOAD_DIR, filename);

        const stream = ytdl(video.url, {
            quality: "highestaudio",
            filter: "audioonly"
        });

        ffmpeg(stream)
            .audioBitrate(128)
            .format("mp3")
            .save(output)
            .on("end", () => {
                res.download(output, filename, () => {
                    fs.unlink(output, () => {});
                });
            })
            .on("error", (err) => {
                console.error(err);
                res.status(500).json({
                    status: false,
                    message: err.message
                });
            });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan`);
});

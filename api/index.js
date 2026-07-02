const YMusic = require("ytmusic-api");

const ytmusic = new YMusic();

let initialized = false;

async function init() {
  if (!initialized) {
    await ytmusic.initialize();
    initialized = true;
  }
}

module.exports = async (req, res) => {
  try {
    await init();

    const q = req.query.q || "Tidak akan pernah menyerahkanmu";

    const songs = await ytmusic.searchSongs(q);

    console.log("lagu:", songs);

    return res.status(200).json({
      query: q,
      songs
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

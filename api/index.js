const YTMusic = require("ytmusic-api");

const ytmusic = new YTMusic();

let initialized = false;

async function init() {
  if (!initialized) {
    await ytmusic.initalize();
    initialized = true;
  }
}

module.exports = async (req, res) => {
  try {
    await init();

    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        error: "Query 'q' wajib diisi"
      });
    }

    // pakai searchSongs sesuai permintaan kamu
    const songs = await ytmusic.searchSongs(q);

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

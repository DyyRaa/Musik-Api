const express = require("express")
const YTMusic = require("ytmusic-api")

const app = express()
const port = 3000

const ytmusic = new YTMusic()
let initialized = false

async function initYT() {
  if (!initialized) {
    await ytmusic.initialize()
    initialized = true
  }
}

app.get("/hady", async (req, res) => {
  try {
    const query = req.query.q

    if (!query) {
      return res.status(400).json({
        error: "Query parameter 'q' wajib diisi"
      })
    }

    await initYT()

    const results = await ytmusic.search(query)

    res.json({
      query,
      results
    })
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
})

app.listen(port, () => {
  console.log(`API berhasil`)
})

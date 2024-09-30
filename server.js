const express = require('express');
const { exec } = require('yt-dlp-exec');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle downloading
app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;
    const quality = req.body.quality || 'best'; // default quality

    if (!videoUrl) {
        return res.status(400).send('No URL provided.');
    }

    try {
        // Using yt-dlp to download the video
        const output = `downloads/video-${Date.now()}.mp4`;

        await exec(videoUrl, {
            format: quality,  // specify the quality (e.g., 'best', 'bestaudio')
            output: output
        });

        res.download(output, (err) => {
            if (err) {
                console.error("Error in downloading: ", err);
            }
            // Optionally delete the file after download
            // fs.unlinkSync(output);
        });

    } catch (err) {
        console.error('Error downloading video:', err);
        res.status(500).send('Failed to download video.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(express.static('public'));

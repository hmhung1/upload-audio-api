const express = require("express")
const multer = require("multer");
const {v4: uuidv4} = require("uuid")
const path = require("path");
const fs = require("fs")

const app = express();
const PORT = 3000;

function clearUploadsFolder() {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error("Lỗi đọc thư mục:", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(uploadDir, file);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error(`Lỗi xóa file ${file}:`, err);
                } else {
                    console.log(`Đã xóa: ${file}`);
                }
            });
        });
    });
}

setInterval(clearUploadsFolder, 10 * 60 * 1000);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.post("/upload", express.raw({ type: "audio/*", limit: "20mb" }), (req, res) => {
    if (!req.body || req.body.length === 0) {
        return res.status(400).json({ error: "File âm thanh trống hoặc không hợp lệ." });
    }

    const filename = uuidv4() + ".mp3";
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, req.body);

    res.json({ message: "Tải lên thành công!", filename });
});

app.get("/audio/:filename", (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File không tồn tại!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});

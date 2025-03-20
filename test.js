const fs = require("fs");
const axios = require("axios");

async function uploadAudioBuffer(filePath) {
    try {
        // Đọc file thành buffer
        const fileBuffer = fs.readFileSync(filePath);

        // Gửi request với buffer
        const response = await axios.post("http://localhost:3000/upload", fileBuffer, {
            headers: {
                "Content-Type": "audio/mpeg", // Hoặc loại file thích hợp
                "Content-Length": fileBuffer.length
            }
        });

        console.log("Kết quả:", response.data);
    } catch (error) {
        console.error("Lỗi upload:", error);
    }
}

// Gọi hàm upload với file cụ thể
uploadAudioBuffer("test.mp3");

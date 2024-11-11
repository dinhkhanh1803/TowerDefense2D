var audiosprite = require('audiosprite');
const fs = require('fs');
const path = require('path');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// Thư mục chứa các file âm thanh đầu vào
const inputDirectory = './assets/raw_sounds';
// Thư mục chứa các file âm thanh đầu ra
const outputDirectory = './assets/sounds';

// Đảm bảo thư mục đầu ra tồn tại
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }
  
// Lấy danh sách các thư mục con trong inputDirectory
const folders = fs.readdirSync(inputDirectory).filter(folder => {
    return fs.statSync(path.join(inputDirectory, folder)).isDirectory();
});
  
folders.forEach(folder => {
    // Đường dẫn thư mục con
    const folderPath = path.join(inputDirectory, folder);

    // Lấy danh sách các file âm thanh trong thư mục con
    const soundFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.mp3') || file.endsWith('.ogg'));

    // Nếu thư mục không có file âm thanh nào, bỏ qua
    if (soundFiles.length === 0) {
        console.log(`No audio files found in folder: ${folder}`);
        return;
    }

    // Tạo đường dẫn đầy đủ cho các file âm thanh
    const files = soundFiles.map(file => path.join(folderPath, file));

    // Cấu hình options cho audiosprite
    const opts = {
        output: path.join(outputDirectory, `${folder}_sounds`), // Tên file đầu ra dựa trên tên thư mục
        format: 'mp3,ogg,ac3,m4a,caf',  // Các định dạng để xuất
        autoplay: 'bg_loop',            // Tự động phát track 'bg_loop'
        silence: 1,                     // Thêm 1 giây khoảng lặng giữa các track
        gap: 1,                         // Mỗi phần bắt đầu từ giây đầy đủ
        export: 'mp3,ogg',              // Xuất ra các định dạng này
        bitrate: 128                    // Bitrate của file đầu ra
    };

    // Tạo sound sprite
    audiosprite(files, opts, function(err, obj) {
        if (err) {
            return console.error(`Error creating audiosprite for folder ${folder}:`, err);
        }

        // Thay thế tất cả các đường dẫn trong mảng resources để trỏ đến thư mục outputDirectory
        obj.resources = obj.resources.map(resource => `./sounds/${path.basename(resource)}`);

        // Lưu JSON metadata vào file với tên dựa trên tên thư mục
        fs.writeFileSync(path.join(outputDirectory, `${folder}_sounds.json`), JSON.stringify(obj, null, 2));

        console.log(`Generated audiosprite for folder ${folder}`);
    });
});
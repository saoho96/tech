/**
 * TechPulse App 图标生成器
 * 生成 PWA 需要的所有图标尺寸（纯 JS，无需依赖）
 * 运行: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// 简易 PNG 生成器（不依赖 canvas 库）
function createPNG(size, filename) {
    // 创建一个最小的有效 PNG 文件
    // 使用纯色 + 基础图形数据
    
    const width = size;
    const height = size;
    
    // PNG 文件头
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR chunk
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8;  // bit depth
    ihdrData[9] = 6;  // color type (RGBA)
    ihdrData[10] = 0; // compression
    ihdrData[11] = 0; // filter
    ihdrData[12] = 0; // interlace
    
    function crc32(buf) {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) {
            c = (c ^ buf[i]) & 0xFFFFFFFF;
            for (let j = 0; j < 8; j++) {
                c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0);
                c = c & 0xFFFFFFFF;
            }
        }
        return (c ^ 0xFFFFFFFF) >>> 0;
    }
    
    function makeChunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length, 0);
        const typeB = Buffer.from(type, 'ascii');
        const crcInput = Buffer.concat([typeB, data]);
        const crcVal = crc32(crcInput);
        const crcBuf = Buffer.alloc(4);
        crcBuf.writeUInt32BE(crcVal, 0);
        return Buffer.concat([len, typeB, data, crcBuf]);
    }
    
    const ihdr = makeChunk('IHDR', ihdrData);
    
    // IDAT chunk - 图像像素数据
    const rawData = [];
    const radius = Math.floor(size * 0.22);
    
    for (let y = 0; y < height; y++) {
        rawData.push(0); // filter: none
        for (let x = 0; x < width; x++) {
            // 计算圆角矩形内/外
            let inRect = true;
            
            // 圆角判断
            if (x < radius && y < radius) {
                inRect = Math.sqrt((x - radius)**2 + (y - radius)**2) <= radius;
            } else if (x >= width - radius && y < radius) {
                inRect = Math.sqrt((x - (width - radius))**2 + (y - radius)**2) <= radius;
            } else if (x < radius && y >= height - radius) {
                inRect = Math.sqrt((x - radius)**2 + (y - (height - radius))**2) <= radius;
            } else if (x >= width - radius && y >= height - radius) {
                inRect = Math.sqrt((x - (width - radius))**2 + (y - (height - radius))**2) <= radius;
            }
            
            if (inRect) {
                // 渐变色背景
                const t = x / width; // 0~1
                const r = Math.round(62 + t * (74 - 62));     // #3ECFB2 -> #4AB8E8
                const g = Math.round(207 + t * (184 - 207));
                const b = Math.round(178 + t * (232 - 178));
                
                // 检查是否在内部装饰圆圈内
                const cx = width / 2;
                const cy = height * 0.46;
                const cr = size * 0.3;
                const dist = Math.sqrt((x - cx)**2 + (y - cy)**2);
                
                if (dist <= cr) {
                    // 白色半透明叠加
                    const alpha = 0.18;
                    rawData.push(
                        Math.round(r + (255 - r) * alpha),
                        Math.round(g + (255 - g) * alpha),
                        Math.round(b + (255 - b) * alpha),
                        255
                    );
                } else {
                    rawData.push(r, g, b, 255);
                }
            } else {
                // 圆角矩形外：透明
                rawData.push(0, 0, 0, 0);
            }
        }
    }
    
    // zlib 压缩
    const zlib = require('zlib');
    const rawBuffer = Buffer.from(rawData);
    const compressed = zlib.deflateSync(rawBuffer);
    
    const idat = makeChunk('IDAT', compressed);
    
    // IEND chunk
    const iend = makeChunk('IEND', Buffer.alloc(0));
    
    // 组合完整 PNG
    return Buffer.concat([signature, ihdr, idat, iend]);
}

// 生成目录
const assetsDir = path.join(__dirname, 'assets');

// 确保目录存在
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// 生成三种尺寸的图标
const sizes = [
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
    { size: 180, name: 'apple-touch-icon.png' }
];

console.log('🎨 正在生成 TechPulse App 图标...\n');

sizes.forEach(({ size, name }) => {
    const png = createPNG(size, name);
    const filePath = path.join(assetsDir, name);
    fs.writeFileSync(filePath, png);
    console.log(`✅ ${name} (${size}x${size}) → ${filePath}`);
});

console.log('\n🎉 所有图标生成完成！');
console.log('\n请将 assets 文件夹一起上传到部署平台（Vercel / Cloudflare Pages 等）');

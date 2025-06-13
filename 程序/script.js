// 获取 localStorage 中的图片数据
function getImagesFromStorage() {
    return JSON.parse(localStorage.getItem('historyImages') || '[]');
}

// 保存图片到 localStorage
function saveImageToStorage(url) {
    const images = getImagesFromStorage();
    const newImage = {
        url: url,
        timestamp: new Date().getTime()
    };
    images.unshift(newImage); // 插入最前面
    localStorage.setItem('historyImages', JSON.stringify(images));
}

// 加载并渲染图片
function loadAndRenderImages() {
    const container = document.getElementById('container');
    container.innerHTML = ''; // 清空旧内容

    const images = getImagesFromStorage();

    images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'item';

        const dateStr = new Date(img.timestamp).toLocaleString();

        item.innerHTML = `
        <img src="${img.url}" alt="图片">
        <div class="info">上传时间：${dateStr}</div>
      `;

        container.appendChild(item);
    });
}

// 上传图片
function uploadImages() {
    const input = document.getElementById('imageInput');
    const files = input.files;

    if (!files.length) return alert("请选择至少一张图片");

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) continue; // 只接受图片文件

        const reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                saveImageToStorage(e.target.result); // 使用 base64 存储
            };
        })(file);

        reader.readAsDataURL(file);
    }

    // 重新加载图片以反映新添加的图片
    loadAndRenderImages();
}

// 初始化加载
window.onload = loadAndRenderImages;
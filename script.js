document.getElementById('generate').addEventListener('click', () => {
    const zip = new JSZip();

    // pack_manifest.jsonの作成
    const manifest = {
        "format_version": 2,
        "header": {
            "description": "全ブロックにアウトラインを追加",
            "name": "Outline Resource Pack",
            "uuid": generateUUID(),
            "version": [1, 0, 0],
            "min_engine_version": [1, 16, 0]
        },
        "modules": [
            {
                "description": "Outline Textures",
                "type": "resources",
                "uuid": generateUUID(),
                "version": [1, 0, 0]
            }
        ]
    };
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));

    // テクスチャ加工と追加
    const textureFolder = zip.folder("textures/blocks");
    
    // 例：ダミーで一つのテクスチャ追加（全ブロック対応は追加で処理）
    fetch('textures/blocks/stone.png')
        .then(res => res.blob())
        .then(blob => createOutlineTexture(blob))
        .then(outlinedBlob => {
            textureFolder.file("stone.png", outlinedBlob);
            
            // ZIP生成・ダウンロード
            zip.generateAsync({ type: "blob" }).then(content => {
                saveAs(content, "OutlineResourcePack.mcpack");
            });
        });

    // UUID生成関数
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 簡易アウトライン加工関数（実装の詳細は要追加）
    function createOutlineTexture(blob) {
        return new Promise(resolve => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // アウトライン加工（簡易的な例）
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                ctx.strokeRect(0, 0, img.width, img.height);

                canvas.toBlob(outlinedBlob => {
                    resolve(outlinedBlob);
                });
            };

            img.src = URL.createObjectURL(blob);
        });
    }
});
function splitArray(arr, size) {
    const result = [];
    
    for (var i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    
    return result;
}

function saveImage(nameLayer, count) {
    // Redimensiona a imagem
    app.activeDocument.resizeImage(null, null, 300, ResampleMethod.NEARESTNEIGHBOR);

    // Obtenha o caminho do arquivo .jsx atual
    var scriptFilePath = new File($.fileName).path;
    
    // Cria o caminho para a pasta "Imagens" (que deve estar na mesma pasta do arquivo .jsx)
    var imagesFolder = new Folder(scriptFilePath + "/Imagens");
    
    // Verifica se a pasta "Imagens" existe, caso contrário, cria
    if (!imagesFolder.exists) {
        imagesFolder.create();
    }

    // Define o caminho do arquivo de imagem a ser salvo
    var PATH_FILE = imagesFolder + "/" + nameLayer + '-' + count + ".png";

    // Configura as opções para exportar a imagem
    const opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false;
    opts.quality = 100;
    opts.compression = 0;
    opts.interlaced = false;

    const pngFile = new File(PATH_FILE);
    app.activeDocument.exportDocument(pngFile, ExportType.SAVEFORWEB, opts);
    count += 1;
}
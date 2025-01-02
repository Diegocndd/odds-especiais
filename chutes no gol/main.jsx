// @include "prototypes.jsx"

function getUserInput(promptText) {
    return prompt(promptText);
}

function readQuotationsFile(filePath) {
    var file = new File(filePath);
    if (!file.exists) {
        alert("Arquivo de odds não encontrado: " + filePath);
        return null;
    }
    file.open("r");
    var content = file.read();
    file.close();
    return content;
}

function parseQuotations(content, id, modalidade) {
    var targetSection = '#' + id.toString() + '##########################';
    var startIndex = content.indexOf(targetSection);

    if (startIndex === -1) {
        alert("Cliente não encontrado no arquivo: " + id);
        return null;
    }

    var endIndex = content.indexOf("#", startIndex + targetSection.length);
    if (endIndex === -1) endIndex = content.length;

    var section = content.substring(startIndex, endIndex);
    var modeKey = modalidade === "1" ? "[CHUTES NO GOL]" : "[ODDS ESPECIAIS]";
    var modeStart = section.indexOf(modeKey);

    if (modeStart === -1) {
        alert("Modalidade não encontrada no cliente " + id);
        return null;
    }

    var modeEnd = section.indexOf("[", modeStart + modeKey.length);
    if (modeEnd === -1) modeEnd = section.length;

    var modeContent = section.substring(modeStart + modeKey.length, modeEnd).trim();
    if (!modeContent) {
        alert("Não há dados disponíveis para a modalidade selecionada.");
        return [];
    }

    var lines = modeContent.split("\n");
    var parsedData = [];

    for (var i = 0; i < lines.length; i+=2) {
        var line = lines[i].trim();
        if (lines[i + 1].trim()) {
            parsedData.push({
                jogador: line.replace("*", ""),
                odd: lines[i + 1].trim()
            });
        }
    }

    return parsedData;
}

var id = getUserInput("Digite o código do cliente (exemplo: 93):");
var modalidade = getUserInput("Digite a modalidade (1 para Chutes no Gol, 2 para Odds Especiais):");

if (id && modalidade && (modalidade === "1" || modalidade === "2")) {
    var scriptPath = File($.fileName).path;
    var filePath = scriptPath + "/../extrator de odds/quotations.txt";
    
    var fileContent = readQuotationsFile(filePath);

    if (fileContent) {
        var result = parseQuotations(fileContent, id, modalidade);
        alert("Resultado: \n" + JSON.stringify(result, null, 2));
    }
} else {
    alert("Entrada inválida. Certifique-se de fornecer um cliente e uma modalidade válidos.");
}
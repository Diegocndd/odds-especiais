// @include "prototypes.jsx"
// @include "insert_data.jsx"
// @include "utils.jsx"

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

function parseQuotations(content, id, jogo) {
    var targetSection = '#' + id.toString() + '##########################';
    var startIndex = content.indexOf(targetSection);

    if (startIndex === -1) {
        alert("Cliente não encontrado no arquivo: " + id);
        return null;
    }

    var endIndex = content.indexOf("#", startIndex + targetSection.length);
    if (endIndex === -1) endIndex = content.length;

    var section = content.substring(startIndex, endIndex);

    var oddsContentStart = section.indexOf("[ODDS ESPECIAIS]");
    if (oddsContentStart === -1) {
        alert("Odds especiais não encontradas no cliente " + id);
        return null;
    }

    var oddsContentEnd = section.indexOf("#", oddsContentStart + "[ODDS ESPECIAIS]".length);
    if (oddsContentEnd === -1) oddsContentEnd = section.length;

    var oddsContent = section.substring(oddsContentStart + "[ODDS ESPECIAIS]".length, oddsContentEnd).trim();
    if (!oddsContent) {
        alert("Não há odds especiais disponíveis.");
        return [];
    }

    var specialOddsLines = oddsContent.split("\n");
    var specialOddsData = [];
    var currentGame = null;

    for (var i = 0; i < specialOddsLines.length; i++) {
        var line = specialOddsLines[i].trim();
        
        // Detecta o nome do jogo específico (começando com "->")
        if (line.startsWith("->")) {
            currentGame = line.substring(2).trim();
        } else if (line.includes("*") && currentGame) {
            if (currentGame.trim().toUpperCase() === jogo.trim().toUpperCase()) {
                specialOddsData.push({
                    aposta: line.replace("*", "").trim(),
                    odd: specialOddsLines[i + 1] ? specialOddsLines[i + 1].trim() : ''
                });
            }
        }
    }

    return specialOddsData;
}

var id = getUserInput("Digite o código do cliente (exemplo: 93):");
var jogo = getUserInput("Digite o nome do jogo (exemplo: Inter x Atlanta):");

if (id && jogo) {
    var scriptPath = File($.fileName).path;
    var filePath = scriptPath + "/../extrator de odds/quotations.txt";
    
    var fileContent = readQuotationsFile(filePath);

    if (fileContent) {
        var result = parseQuotations(fileContent, id, jogo);
        alert("Resultado: \n" + JSON.stringify(result, null, 2));
        inserirApostasEspeciais(id, result)
        alert("Execução finalizada ✅")
    }
} else {
    alert("Entrada inválida. Certifique-se de fornecer um cliente e uma modalidade válidos.");
}
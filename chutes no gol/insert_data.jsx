function inserirChutesNoGol(client, data) {
    var doc = app.activeDocument;

    doc.layerSets.getByName("CHUTES NO GOL")

    var chutesNoGolGroup = doc.layerSets.getByName("CHUTES NO GOL");
    var oddsEspeciaisGroup = doc.layerSets.getByName("APOSTAS ESPECIAIS");

    // for (var i = 0; i < doc.layerSets.length; i++) {
    //     if (doc.layerSets[i].name === "CHUTES NO GOL") {
    //         chutesNoGolGroup = doc.layerSets[i];
    //         break;
    //     }
    // }

    if (!chutesNoGolGroup) {
        alert('Grupo "CHUTES NO GOL" não encontrado!');
        return;
    }

    chutesNoGolGroup.visible = true
    oddsEspeciaisGroup.visible = false

    chutesNoGolGroup = chutesNoGolGroup.layerSets.getByName("APOSTAS")

    const qtdEstruturas = chutesNoGolGroup.layerSets.length

    var splittedData = splitArray(data, qtdEstruturas)

    for (var i = 0; i < splittedData.length; i++) {
    // for (var i = 0; i < 1; i++) {
        var currentData = splittedData[i]

        // torna todos os grupos invisiveis
        for (var j = 0; j < chutesNoGolGroup.layerSets.length; j++) {
            var group = chutesNoGolGroup.layerSets[j];
            group.visible = false
        }

        // acende os grupos que vão ser usados
        for (var j = 0; j < currentData.length; j++) {
            var group = chutesNoGolGroup.layerSets[j];
            group.visible = true
        }

        // insere os dados
        for (var j = 0; j < currentData.length; j++) {
            var group = chutesNoGolGroup.layerSets[j];

            var jogador = group.layers.getByName('TEXTO')
            jogador.textItem.contents = currentData[j].jogador.trim()

            var jogador = group.layers.getByName('ODD')
            jogador.textItem.contents = currentData[j].odd.toString().trim()
        }

        saveImage(client.toString(), i)
    }
}

function inserirApostasEspeciais(client, data) {
    var doc = app.activeDocument;

    doc.layerSets.getByName("APOSTAS ESPECIAIS")

    var chutesNoGolGroup = doc.layerSets.getByName("CHUTES NO GOL");
    var oddsEspeciaisGroup = doc.layerSets.getByName("APOSTAS ESPECIAIS");

    if (!oddsEspeciaisGroup) {
        alert('Grupo "APOSTAS ESPECIAIS" não encontrado!');
        return;
    }

    chutesNoGolGroup.visible = false
    oddsEspeciaisGroup.visible = true

    oddsEspeciaisGroup = oddsEspeciaisGroup.layerSets.getByName("APOSTAS")

    var qtdEstruturas = oddsEspeciaisGroup.layerSets.length

    var splittedData = splitArray(data, qtdEstruturas)

    for (var i = 0; i < splittedData.length; i++) {
    // for (var i = 0; i < 1; i++) {
        var currentData = splittedData[i]

        // torna todos os grupos invisiveis
        for (var j = 0; j < oddsEspeciaisGroup.layerSets.length; j++) {
            var group = oddsEspeciaisGroup.layerSets[j];
            group.visible = false
        }

        // acende os grupos que vão ser usados
        for (var j = 0; j < currentData.length; j++) {
            var group = oddsEspeciaisGroup.layerSets[j];
            group.visible = true
        }

        // insere os dados
        for (var j = 0; j < currentData.length; j++) {
            var group = oddsEspeciaisGroup.layerSets[j];

            var jogador = group.layers.getByName('TEXTO')
            jogador.textItem.contents = currentData[j].aposta.trim()

            var jogador = group.layers.getByName('ODD')
            jogador.textItem.contents = currentData[j].odd.toString().trim()
        }

        saveImage(client.toString(), i)
    }
}

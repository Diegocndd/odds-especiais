import time
import datetime
import re

from webdriver import Webdriver
from selenium.webdriver.common.by import By
from collections import defaultdict

def dayInPortuguese(day):
    return {
        'SUNDAY': 'DOMINGO',
        'MONDAY': 'SEGUNDA FEIRA',
        'TUESDAY': 'TERÇA FEIRA',
        'WEDNESDAY': 'QUARTA FEIRA',
        'THURSDAY': 'QUINTA FEIRA',
        'FRIDAY': 'SEXTA FEIRA',
        'SATURDAY': 'SÁBADO',
    }[str(day).upper()]

websites = {
    '93': 'https://jogabet.club/sistema_v2/usuarios/simulador/desktop/Campeonatos.aspx',
    '15': 'https://eurobet77-net.jogos.app/sistema_v2/usuarios/simulador/desktop/Campeonatos.aspx',
    '17': 'https://centralbet.club/sistema_v2/usuarios/simulador/desktop/Campeonatos.aspx',
    '98': 'https://betmais.app/sistema_v2/usuarios/simulador/desktop/Campeonatos.aspx',
}

def extract93(driver, todayOrTomorrow):
    f.write(f'\n#93##########################')
    URL = websites['93']
    driver.get(URL)
    time.sleep(3)

    cards = driver.find_elements(By.CLASS_NAME, 'cardItem')
    
    now = datetime.datetime.now() + datetime.timedelta(days=int(todayOrTomorrow))
    today = dayInPortuguese(now.strftime("%A"))

    if (len(today.split(' ')) > 1):
        newToday = today.split(' ')[0] + '-' + today.split(' ')[1]
    else:
        newToday = today

    for card in cards:
        try:
            if (card.text):
                if (str(newToday).upper() == str(card.text).upper()):
                    card.click()
                    break
        except:
            pass

    time.sleep(3)

    campeonatos = driver.execute_script("return document.getElementsByClassName('eventlist-country')")

    f.write("\n[CHUTES NO GOL]\n")

    for index, _ in enumerate(campeonatos):
        jogos = driver.execute_script(f"return document.getElementsByClassName('eventlist-country')[{index}].nextSibling.children")
        for jogo in jogos:
            teams = jogo.find_elements(By.CLASS_NAME, 'team')
            odds = jogo.find_elements(By.CLASS_NAME, 'odd')
            if ('CHUTES AO GOL' in teams[0].text.upper() or 'CHUTES NO GOL' in teams[0].text.upper()):
                f.write('* ' + teams[1].text + '\n')
                f.write(odds[0].text.replace(',', '.') + '\n')

    f.write("\n[ODDS ESPECIAIS]\n")

    odds_especiais = []

    for index, _ in enumerate(campeonatos):
        jogos = driver.execute_script(f"return document.getElementsByClassName('eventlist-country')[{index}].nextSibling.children")
        for jogo in jogos:
            teams = jogo.find_elements(By.CLASS_NAME, 'team')
            odds = jogo.find_elements(By.CLASS_NAME, 'odd')
            if ('ESCANTEIO' in teams[0].text.upper() or 'CARTÕES' in teams[0].text.upper() or 'CARTÃO' in teams[0].text.upper()):
                odds_especiais.append({
                    'jogo': teams[1].text,
                    'tipo': teams[0].text,
                    'odd': odds[0].text
                })

    result = defaultdict(list)

    for entry in odds_especiais:
        jogo = entry['jogo']
        result[jogo].append({'tipo': entry['tipo'], 'odd': entry['odd']})

    # Convertendo para um dicionário comum
    grouped_data = dict(result)

    for jogo, detalhes in grouped_data.items():
        f.write(f"-> {jogo}\n")
        for detalhe in detalhes:
            f.write(f"* {detalhe['tipo']}\n")
            f.write(f"{detalhe['odd'].replace(',', '.')}\n")

def extract(driver, todayOrTomorrow):
    for websiteIndex in websites:
        if websiteIndex == '93':
            extract93(driver, todayOrTomorrow)
            continue

        f.write(f'\n#{websiteIndex}##########################')
        URL = websites[websiteIndex]
        driver.get(URL)
        time.sleep(3)

        cards = driver.find_elements(By.CLASS_NAME, 'cardItem')
        
        now = datetime.datetime.now() + datetime.timedelta(days=int(todayOrTomorrow))
        today = dayInPortuguese(now.strftime("%A"))

        if (len(today.split(' ')) > 1):
            newToday = today.split(' ')[0] + '-' + today.split(' ')[1]
        else:
            newToday = today

        for card in cards:
            try:
                if (card.text):
                    if (str(newToday).upper() == str(card.text).upper()):
                        card.click()
                        break
            except:
                pass

        time.sleep(3)

        campeonatos = driver.execute_script("return document.getElementsByClassName('eventlist-country')")

        f.write("\n[CHUTES NO GOL]\n")

        for index, campeonato in enumerate(campeonatos):
            if "CHUTES NO GOL" in campeonato.text.upper() or "CHUTE NO GOL" in campeonato.text.upper() or "CHUTES AO GOL" in campeonato.text.upper():
                jogos = driver.execute_script(f"return document.getElementsByClassName('eventlist-country')[{index}].nextSibling.children")
                for jogo in jogos:
                    teams = jogo.find_elements(By.CLASS_NAME, 'team')
                    odds = jogo.find_elements(By.CLASS_NAME, 'odd')
                    f.write('* ' + teams[0].text + '\n')
                    f.write(odds[0].text.replace(',', '.') + '\n')
                    f.write('* ' + teams[1].text + '\n')
                    f.write(odds[2].text.replace(',', '.') + '\n')

        f.write("\n[ODDS ESPECIAIS]\n")

        for index, campeonato in enumerate(campeonatos):
            if "DIFERENCIADAS" in campeonato.text.upper() or "ESPECIAIS" in campeonato.text.upper():
                match = re.search(r'\b\w+\s+x\s+\w+\b', campeonato.text.split('\n')[0])
                jogos = driver.execute_script(f"return document.getElementsByClassName('eventlist-country')[{index}].nextSibling.children")
                if not match:
                    continue
                nome_jogo = match.group()

                f.write(f"-> {nome_jogo}\n")
                for jogo in jogos:
                    teams = jogo.find_elements(By.CLASS_NAME, 'team')
                    odds = jogo.find_elements(By.CLASS_NAME, 'odd')
                    f.write(f"* {teams[0].text}\n")
                    f.write(f"{odds[0].text.replace(',', '.')}\n")
                    f.write(f"* {teams[1].text}\n")
                    f.write(f"{odds[2].text.replace(',', '.')}\n")

# 0 para Hoje
# 1 para Amanhã
# 2 para Depois de Amanhã
todayOrTomorrow = input('Insira 0 para Hoje, 1 para Amanhã ou 2 para depois de amanhã: ')
while (int(todayOrTomorrow) > 2):
    todayOrTomorrow = input('\nPor favor, insira 1 para Hoje, 2 para Amanhã ou 3 para depois de amanhã:')

f = open("quotations.txt", "a", encoding="utf-8")

driver = Webdriver('.', disable_images=False).getDriver()
extract(driver, todayOrTomorrow)
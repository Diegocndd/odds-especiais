import time
import datetime

from webdriver import Webdriver
from selenium.webdriver.common.by import By

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
    '4': 'https://jogabet.club/sistema_v2/usuarios/simulador/desktop/Campeonatos.aspx' 
}

def extract(driver, todayOrTomorrow):
    for websiteIndex in websites:
        f.write(f'#{websiteIndex}##########################')
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
                print('')

        time.sleep(3)

        campeonatos = driver.execute_script("return document.getElementsByClassName('eventlist-country')")

        f.write("\n[CHUTES NO GOL]\n")

        for index, campeonato in enumerate(campeonatos):
            if "CHUTES NO GOL" in campeonato.text.upper() or "CHUTE NO GOL" in campeonato.text.upper() or "CHUTES AO GOL" in campeonato.text.upper():
                jogos = driver.execute_script(f"return document.getElementsByClassName('eventlist-country')[{index}].nextSibling.children")
                for jogo in jogos:
                    teams = jogo.find_elements(By.CLASS_NAME, 'team')
                    odds = jogo.find_elements(By.CLASS_NAME, 'odd')
                    f.write(teams[0].text + '\n')
                    f.write(odds[0].text + '\n')
                    f.write(teams[1].text + '\n')
                    f.write(odds[2].text + '\n')

# 0 para Hoje
# 1 para Amanhã
# 2 para Depois de Amanhã
todayOrTomorrow = input('Insira 0 para Hoje, 1 para Amanhã ou 2 para depois de amanhã: ')
while (int(todayOrTomorrow) > 2):
    todayOrTomorrow = input('\nPor favor, insira 1 para Hoje, 2 para Amanhã ou 3 para depois de amanhã:')

f = open("quotations.txt", "a", encoding="utf-8")

driver = Webdriver('.', disable_images=False).getDriver()
extract(driver, todayOrTomorrow)
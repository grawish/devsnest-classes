import os
import psycopg2
import json

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep, time, strftime

# set up options for the chromedriver
current_path = os.getcwd()
user_agent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36"
options = Options()

# Set the location of google chrome
GOOGLE_CHROME_LOCATION = os.getenv('GOOGLE_CHROME_LOCATION')
if GOOGLE_CHROME_LOCATION:
    options.binary_location = GOOGLE_CHROME_LOCATION

# set chrome driver properties
if not bool(os.getenv('RUNNING_DRIVER_LOCALLY', False)):
    options.add_argument("--headless")
options.add_argument("user-data-dir={}/driver_data".format(current_path))
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--start-maximized")
options.add_argument("--window-size=800,600")
options.add_argument('--user-agent={}'.format(user_agent))


def getLinks():
    # create chromedriver
    CHROME_DRIVER_LOCATION = os.getenv('CHROME_DRIVER_LOCATION')
    if CHROME_DRIVER_LOCATION:
        driver = webdriver.Chrome(executable_path=CHROME_DRIVER_LOCATION, options=options)
    else:
        driver = webdriver.Chrome(options=options)

    try:
        # open devsnest youtube channel's videos
        driver.get("https://www.youtube.com/channel/UCkxqJvZRzhM0oaBjbu3ZjFg/videos")
        sleep(2)

        # open the last video
        video = driver.find_element_by_id("thumbnail")
        video.click()
        sleep(5)

        # Get video details
        ylink = driver.current_url
        ytitle = driver.title
        print(ytitle)

        # check if video details already collected
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        cur = conn.cursor()
        sqlValues = {'ylink': ylink}
        sqlQuery = "SELECT * FROM classlinks WHERE ylink = %(ylink)s"
        cur.execute(sqlQuery, sqlValues)
        rows = cur.fetchall()
        if len(rows) > 0:
            conn.close()
            driver.close()
            print("Video Already Parsed")
            return

        # inject java script
        driver.execute_script(open("./script.js").read())

        # get links form javascript
        links = driver.execute_script("return window.getLinks()")
        print("Links obtained")

        # filter links
        for t in links:
            print(t)
            for l in links[t]:
                driver.get(l["url"])
                sleep(5)
                l["title"] = driver.title
                l["url"] = driver.current_url
                print(l)
            print("----- O -----")
            print()
        sleep(1)

        cur = conn.cursor()
        sqlValues = {'timestamp': str(int(time())), 'timestr': strftime("%Y-%m-%d %H:%M:%S"),
                     'ylink': ylink, 'ytitle': ytitle, 'links': json.dumps(links)}
        sqlQuery = "INSERT INTO classlinks (timestamp, timestr, ylink, ytitle, links) \
                    VALUES (%(timestamp)s, %(timestr)s, %(ylink)s, %(ytitle)s, %(links)s)"
        cur.execute(sqlQuery, sqlValues)
        conn.commit()
        conn.close()
    except Exception as e:
        print(e)

    # close the driver
    driver.close()
    print("Driver Closed")


if __name__ == "__main__":
    getLinks()
    print("Exiting...")

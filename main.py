import os
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
    options.binary_location = os.getenv('GOOGLE_CHROME_LOCATION')

# set chrome driver properties
if not bool(os.getenv('RUNNING_DRIVER_LOCALLY', False)):
    options.add_argument("--headless")
options.add_argument("user-data-dir={}/driver_data".format(current_path))
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--start-maximized")
options.add_argument("--window-size=800,600")
options.add_argument('--user-agent={}'.format(user_agent))


# trackInterval = os.getenv('DN_THA_TRACK_INTERVAL', 60 * 30)  # half an hour in seconds

def getLinks():
    startTime = time()
    print(startTime)
    print(strftime("%Y-%m-%d %H:%M:%S"))

    # create chromedriver
    CHROME_DRIVER_LOCATION = os.getenv('CHROME_DRIVER_LOCATION')
    if CHROME_DRIVER_LOCATION:
        driver = webdriver.Chrome(executable_path=CHROME_DRIVER_LOCATION, options=options)
    else:
        driver = webdriver.Chrome(options=options)

    # open devsnest youtube channel's videos
    driver.get("https://www.youtube.com/channel/UCkxqJvZRzhM0oaBjbu3ZjFg/videos")
    sleep(2)

    # open the last video
    video = driver.find_element_by_id("thumbnail")
    video.click()
    sleep(5)

    # inject java script
    driver.execute_script(open("../dn-yt-tha-tracker/script.js").read())

    # get links form javascript
    links = driver.execute_script("return window.getLinks()")

    # filter links
    for t in links:
        print(t)
        for l in links[t]:
            driver.get(l["href"])
            sleep(5)
            l["tile"] = driver.title
            l["href"] = driver.current_url
            print(l)
        print("----- O -----")
        print()
    sleep(1)

    # close the driver
    driver.close()


if __name__ == "__main__":
    getLinks()

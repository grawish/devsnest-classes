from main import getLinks
from time import sleep, time, strftime
import os

if __name__ == "__main__":
    trackInterval = int(os.getenv('DN_THA_TRACK_INTERVAL', 60 * 30))  # half an hour in seconds
    while True:
        while int(strftime("%H")) < 18 or int(strftime("%H")) > 22:
            sleep(1)
        startTime = time()
        getLinks()
        while time() < startTime + trackInterval:
            sleep(1)

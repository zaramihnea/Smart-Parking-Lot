import cv2
import imutils
import numpy as np
import pytesseract
import re
import sys


imagepath = sys.argv[1]
img = cv2.imread(imagepath)

# apply filters on image
cv2.imshow("image", img)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imshow("image2", gray)
gray = cv2.bilateralFilter(gray, 25, 25, 25)  # reduce noise + preserve edges
cv2.imshow("image3", gray)
edged = cv2.Canny(gray, 55, 200)  # filter for detecting contours
cv2.imshow("image4", edged)


# find contours after applying Canny filter
contur = cv2.findContours(edged.copy(), cv2.RETR_TREE,
                          cv2.CHAIN_APPROX_NONE)
contur = imutils.grab_contours(contur)
contur = sorted(contur, key=cv2.contourArea, reverse=True)[:10]
screenCnt = None
for c in contur:
    peri = cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, 0.018*peri, True)
    if (len(approx) == 4):
        screenCnt = approx
        break
if screenCnt is None:
    print("Error: no contour found")

# mask license plate area
mask = np.zeros(gray.shape, np.uint8)
new_image = cv2.drawContours(mask, [screenCnt], 0, 255, -1)
cv2.imshow("image5", new_image)
# apply mask to initial image
new_image = cv2.bitwise_and(img, img, mask=mask)
cv2.imshow("image6", new_image)
(x, y) = np.where(mask == 255)

(topx, topy) = (np.min(x), np.min(y))
(bottomx, bottomy) = (np.max(x), np.max(y))
Crop = gray[topx:bottomx+1, topy:bottomy+1]
Crop = cv2.add(Crop, np.array([-25.0]), Crop)
Crop = cv2.multiply(Crop, np.array([1.25]), Crop)
cv2.imshow("image7", Crop)

text_numar = pytesseract.image_to_string(
    Crop, config='--oem 3 -l eng --psm 7')

filtered_text = re.sub(r'[^A-Za-z0-9]+', '', text_numar)
print(filtered_text)
cv2.waitKey(0)
cv2.destroyAllWindows()
# 1, 2, 9, 12 - these dont work

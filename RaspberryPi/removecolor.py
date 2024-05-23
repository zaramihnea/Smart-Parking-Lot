from PIL import Image


def replace_non_gray_pixels(image):
    gray_threshold = 30

    width, height = image.size
    pixels = image.load()

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]

            if abs(r - g) < gray_threshold and abs(r - b) < gray_threshold and abs(g - b) < gray_threshold:
                pass
            elif r < 50 and g < 50 and b < 50:
                pixels[x, y] = (0, 0, 0)
            else:
                pixels[x, y] = (180, 180, 180)

    return image


input_image = Image.open("img7.jpg")
output_image = replace_non_gray_pixels(input_image)
output_image.save("output_image.jpg")

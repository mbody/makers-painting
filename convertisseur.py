from PIL import Image

entree = input("Notes : ")
entree = entree.replace("\n\t", "")
entree = entree.split(" ")

notes = [".", "3G" ,"4A", "4AS", "4B", "4C", "4CS", "4D", "4DS", "4E", "4F", "4FS", "4G", "AGS", "5A", "5B", "5C"]

images = ["", "./assets/herisson1.png",
    "./assets/herisson2.png",
    "./assets/champignon1.png",
    "./assets/champignon2.png",
    "./assets/champignon3.png",
    "./assets/ecureuil1.png",
    "./assets/ecureuil2.png",
    "./assets/hibou.png",
    "./assets/oiseau1.png",
    "./assets/oiseau2.png",
    "./assets/oiseau3.png",
    "./assets/oiseau4.png",
    "./assets/renard.png",
    "./assets/graines.png",
    "./assets/pomme.png",
    #"./assets/feuille.png",
    "./assets/baies.png",]

partition = []
for note in entree:
    partition.append(images[notes.index(note)])

# génération image

image_size = 150
image_finale = Image.new("RGBA", (image_size*len(partition), image_size*len(partition)), 0x00000000)

correspondances: dict[str,Image.Image] = {}
for image_path in images:
    if image_path == "":
        image = Image.new("RGBA", (image_size, image_size))
    else:
        image = Image.open(image_path, "r")
        image = image.crop(image.getbbox())
        image.thumbnail((image_size, image_size))
    correspondances[image_path] = image

j = 0
i2 = 0
for i, note in enumerate(partition):
    image = correspondances[note]
    bbox = image.getbbox()
    if bbox != None:
        image_finale.paste(image, ((i-i2)*image_size + image_size//2 - (bbox[2]-bbox[0])//2, j*image_size + image_size//2 - (bbox[3]-bbox[1])//2))
    else:
        j+=1
        i2=i+1
        
image_finale = image_finale.crop(image_finale.getbbox())
        
name = input("image name : ")

image_finale.save(name)
# sourcery skip: for-index-underscore
import pygame

disp = pygame.display.set_mode((800, 600))

size = 40
x,y = 400-size//2,300-size//2
color = (249, 61, 59)

clock = pygame.time.Clock()

run = True
while run:
    for event in pygame.event.get():
        pass

    # Move the square
    keys = pygame.key.get_pressed()
    if keys[pygame.K_w]:
        y -= 3
    if keys[pygame.K_s]:
        y += 3
    if keys[pygame.K_a]:
        x -= 3
    if keys[pygame.K_d]:
        x += 3

    # Clear the screen
    disp.fill((0, 0, 0))

    # Draw square
    pygame.draw.rect(disp, color, (x,y,size,size))

    pygame.display.update()

    clock.tick(120)

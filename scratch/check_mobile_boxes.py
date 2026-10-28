import cv2
import numpy as np

m_uiux = cv2.imread("docs/evidence/phase-46/mobile-ui-ux-item.png")
m_webdev = cv2.imread("docs/evidence/phase-46/mobile-web-dev-item.png")

print(f"m_uiux shape: {m_uiux.shape}")
print(f"m_webdev shape: {m_webdev.shape}")

# Find mobile preview box inside the item (has pure white background)
# Find white pixels (RGB > 250)
w1 = np.where((m_uiux[:, :, 0] > 250) & (m_uiux[:, :, 1] > 250) & (m_uiux[:, :, 2] > 250))
print(f"m_uiux white area: y in [{w1[0].min()}, {w1[0].max()}], x in [{w1[1].min()}, {w1[1].max()}]")
print(f"m_uiux white box width: {w1[1].max()-w1[1].min()+1}, height: {w1[0].max()-w1[0].min()+1}")

w2 = np.where((m_webdev[:, :, 0] > 250) & (m_webdev[:, :, 1] > 250) & (m_webdev[:, :, 2] > 250))
print(f"m_webdev white area: y in [{w2[0].min()}, {w2[0].max()}], x in [{w2[1].min()}, {w2[1].max()}]")
print(f"m_webdev white box width: {w2[1].max()-w2[1].min()+1}, height: {w2[0].max()-w2[0].min()+1}")

# Crop just the mobile preview boxes
cv2.imwrite("docs/evidence/phase-46/mobile-box-ui-ux.png", m_uiux[w1[0].min()-2:w1[0].max()+3, w1[1].min()-2:w1[1].max()+3])
cv2.imwrite("docs/evidence/phase-46/mobile-box-web-dev.png", m_webdev[w2[0].min()-2:w2[0].max()+3, w2[1].min()-2:w2[1].max()+3])
print("Saved mobile-box-ui-ux.png and mobile-box-web-dev.png")


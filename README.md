# SSD1309 OLED Extension for micro:bit

A MakeCode extension for driving 128x64 SSD1309 OLED displays over I²C.  
Tested on 2.42" OLED modules with 4-pin interface (VCC, GND, SDA, SCL).

<img width="250" height="300" alt="Bits4Bots Logo Registered" src="https://github.com/user-attachments/assets/577b4089-4517-49e3-8555-a530e5e59694" />


### Features
- Initialize OLED at address `0x3C` (decimal 60) or `0x3D` (decimal 61).
- Clear the display.
- Show text and numbers.
- **Scroll text block** for moving messages across the screen.

### Example (Python)

```python
import SSD1309_OLED

SSD1309_OLED.init(60)
SSD1309_OLED.clear()
SSD1309_OLED.scrollText("Hello from SSD1309!", 100)
```
## Wiring

VCC → 3.3V

GND → GND

SDA → P20


SCL → P19


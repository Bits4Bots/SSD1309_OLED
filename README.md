# SSD1309 OLED Extension for micro:bit

A MakeCode extension for driving 128x64 SSD1309 OLED displays over I²C.  
Tested on 2.42" OLED modules with 4-pin interface (VCC, GND, SDA, SCL).

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
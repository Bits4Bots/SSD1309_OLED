basic.forever(function () {
    // Set OLED I2C address using dropdown (0x3C = 60)
    SSD1309_OLED.setAddress(SSD1309_OLED.OLED_I2C_Address.addr_3C)

    // Initialize OLED at 128x64
    SSD1309_OLED.init(128, 64)

    // Clear the screen
    SSD1309_OLED.clear()

    // Show a test string
    SSD1309_OLED.writeString("SSD1309 OLED OK")
    basic.pause(2000)

    // Scroll text at 100 ms
    SSD1309_OLED.scrollText("Hello from Bits4Bots SSD1309 OLED!", 100)

    basic.pause(2000)
})

// SSD1309 OLED Extension for micro:bit
// Based on OLED12864_I2C but modified for SSD1309 with scroll support
//% color=#3af0e7 icon="\uf26c" block="SSD1309 OLED"
namespace SSD1309_OLED {
    let addr = 60 // default I2C address (0x3C)

    // --- Core Functions (init, clear, show text, etc.) ---
    //% block="initialize OLED at address %i2cAddr"
    export function init(i2cAddr: number) {
        addr = i2cAddr
        // Initialization sequence (same as SSD1306, works for SSD1309 too)
        // NOTE: replace with the init sequence from OLED12864_I2C
        let cmds = [
            0xAE, 0xD5, 0x80, 0xA8, 0x3F, 0xD3, 0x00,
            0x40, 0x8D, 0x14, 0x20, 0x00, 0xA1, 0xC8,
            0xDA, 0x12, 0x81, 0xCF, 0xD9, 0xF1, 0xDB,
            0x40, 0xA4, 0xA6, 0xAF
        ]
        for (let c of cmds) {
            command(c)
        }
    }

    function command(c: number) {
        pins.i2cWriteNumber(addr, c, NumberFormat.UInt16BE)
    }

    //% block="clear OLED"
    export function clear() {
        for (let page = 0; page < 8; page++) {
            command(0xB0 + page)
            command(0x00)
            command(0x10)
            for (let col = 0; col < 128; col++) {
                pins.i2cWriteNumber(addr, 0x40, NumberFormat.UInt8BE)
                pins.i2cWriteNumber(addr, 0x00, NumberFormat.UInt8BE)
            }
        }
    }

    //% block="show text %text at col %col row %row size %size"
    export function showString(col: number, row: number, text: string, size: number) {
        // Minimal demo: relies on font handling from OLED12864_I2C
        // You’ll need to copy the font table functions here
    }

    //% block="show number %num at col %col row %row size %size"
    export function showNumber(col: number, row: number, num: number, size: number) {
        showString(col, row, num.toString(), size)
    }

    // --- New Feature: Scroll Text ---
    //% block="scroll text %text with speed %delay ms"
    export function scrollText(text: string, delay: number) {
        let padded = text + "   "   // add spaces for wrap-around
        let width = padded.length * 8
        for (let x = 128; x >= -width; x--) {
            clear()
            let col = Math.floor(x / 8)
            showString(col, 0, padded, 1)
            basic.pause(delay)
        }
    }
}

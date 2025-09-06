//% color=#3af0e7 icon="\uf26c" block="SSD1309 OLED"
namespace SSD1309_OLED {
    let i2cAddr = 60   // default 0x3C
    let buf = pins.createBuffer(2)

    function cmd(c: number) {
        buf[0] = 0x00
        buf[1] = c
        pins.i2cWriteBuffer(i2cAddr, buf)
    }

    function dat(d: number) {
        buf[0] = 0x40
        buf[1] = d
        pins.i2cWriteBuffer(i2cAddr, buf)
    }

    // --- Initialization ---
    //% block="initialize OLED at address %addr"
    export function init(addr: number) {
        i2cAddr = addr
        cmd(0xAE)           // display off
        cmd(0x20)           // set memory mode
        cmd(0x00)           // horizontal addressing
        cmd(0xB0)           // set page
        cmd(0xC8)           // COM scan dec
        cmd(0x00)           // low column addr
        cmd(0x10)           // hi column addr
        cmd(0x40)           // start line addr
        cmd(0x81)           // contrast
        cmd(0xFF)
        cmd(0xA1)           // segment remap
        cmd(0xA6)           // normal display
        cmd(0xA8)           // multiplex
        cmd(0x3F)
        cmd(0xA4)           // resume to RAM
        cmd(0xD3)           // display offset
        cmd(0x00)
        cmd(0xD5)           // osc div
        cmd(0xF0)
        cmd(0xD9)           // precharge
        cmd(0x22)
        cmd(0xDA)           // com pins
        cmd(0x12)
        cmd(0xDB)           // vcomh
        cmd(0x20)
        cmd(0x8D)           // charge pump
        cmd(0x14)
        cmd(0xAF)           // display on
        clear()
    }

    // --- Clear screen ---
    //% block="clear OLED"
    export function clear() {
        for (let page = 0; page < 8; page++) {
            cmd(0xB0 + page)
            cmd(0x00)
            cmd(0x10)
            for (let col = 0; col < 128; col++) {
                dat(0x00)
            }
        }
    }

    // --- 5x8 Font Table ---
    const font: number[][] = [
        [0x00,0x00,0x00,0x00,0x00], // space
        [0x00,0x00,0x5F,0x00,0x00], // !
        [0x00,0x07,0x00,0x07,0x00], // "
        [0x14,0x7F,0x14,0x7F,0x14], // #
        [0x24,0x2A,0x7F,0x2A,0x12], // $
        [0x23,0x13,0x08,0x64,0x62], // %
        [0x36,0x49,0x55,0x22,0x50], // &
        [0x00,0x05,0x03,0x00,0x00], // '
        [0x00,0x1C,0x22,0x41,0x00], // (
        [0x00,0x41,0x22,0x1C,0x00], // )
        [0x14,0x08,0x3E,0x08,0x14], // *
        [0x08,0x08,0x3E,0x08,0x08], // +
        [0x00,0x50,0x30,0x00,0x00], // ,
        [0x08,0x08,0x08,0x08,0x08], // -
        [0x00,0x60,0x60,0x00,0x00], // .
        [0x20,0x10,0x08,0x04,0x02], // /
        // ... copy the full font table from OLED12864_I2C here (all ASCII chars) ...
    ]

    // --- Draw single char ---
    function drawChar(x: number, y: number, c: string) {
        let index = c.charCodeAt(0) - 32
        if (index < 0 || index >= font.length) return
        for (let i = 0; i < 5; i++) {
            let line = font[index][i]
            cmd(0xB0 + y)
            cmd(((x * 6 + i) & 0x0F))
            cmd(0x10 | (((x * 6 + i) >> 4) & 0x0F))
            dat(line)
        }
    }

    // --- Show string ---
    //% block="show string %text at col %col row %row size %size"
    export function showString(col: number, row: number, text: string, size: number) {
        for (let i = 0; i < text.length; i++) {
            drawChar(col + i, row, text.charAt(i))
        }
    }

    // --- Show number ---
    //% block="show number %num at col %col row %row size %size"
    export function showNumber(col: number, row: number, num: number, size: number) {
        showString(col, row, num.toString(), size)
    }

    // --- Scroll text ---
    //% block="scroll text %text with speed %delay ms"
    export function scrollText(text: string, delay: number) {
        let padded = text + "   "
        let width = padded.length
        for (let x = 16; x >= -width; x--) {
            clear()
            showString(x, 0, padded, 1)
            basic.pause(delay)
        }
    }
}


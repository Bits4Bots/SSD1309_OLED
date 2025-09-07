//% color=#3af0e7 icon="\uf26c" block="SSD1309 OLED"
namespace SSD1309_OLED {
    let font: Buffer

    let chipAddress = 0x3C
    let charX = 0
    let charY = 0
    let displayWidth = 128
    let displayHeight = 64 / 8
    let screenSize = 0

    // --- Address Enum for Dropdown ---
    export enum OLED_I2C_Address {
        //% block="0x3C (60)"
        addr_3C = 60,
        //% block="0x3D (61)"
        addr_3D = 61
    }

    function command(cmd: number) {
        let buf = pins.createBuffer(2)
        buf[0] = 0x00
        buf[1] = cmd
        pins.i2cWriteBuffer(chipAddress, buf, false)
    }

    //% block="set OLED I2C address %addr"
    //% weight=110
    export function setAddress(addr: OLED_I2C_Address) {
        chipAddress = addr
    }

    //% block="initialize OLED with width %width height %height"
    //% width.defl=128
    //% height.defl=64
    //% weight=100
    export function init(width: number, height: number) {
        command(0xAE) // DISPLAYOFF
        command(0xD5) // SETDISPLAYCLOCKDIV
        command(0x80)
        command(0xA8) // SETMULTIPLEX
        command(0x3F)
        command(0xD3) // SETDISPLAYOFFSET
        command(0x00)
        command(0x40 | 0x00) // SETSTARTLINE
        command(0x8D) // CHARGEPUMP
        command(0x14)
        command(0x20) // MEMORYMODE
        command(0x00)
        command(0xA0 | 0x01) // SEGREMAP
        command(0xC8) // COMSCANDEC
        command(0xDA) // SETCOMPINS
        command(0x12)
        command(0x81) // SETCONTRAST
        command(0xCF)
        command(0xD9) // SETPRECHARGE
        command(0xF1)
        command(0xDB) // SETVCOMDETECT
        command(0x40)
        command(0xA4) // DISPLAYALLON_RESUME
        command(0xA6) // NORMALDISPLAY
        command(0xAF) // DISPLAYON

        displayWidth = width
        displayHeight = height / 8
        screenSize = displayWidth * displayHeight
        charX = 0
        charY = 0

        // === 5x8 ASCII font table (128 chars × 5 bytes each) ===
        font = hex`
            0000000000000000000000000000000000000000000000000000000000000000
            3E5B4F5B3E000000060F0F06000000666F6F660000000249497F497F49490200
            3C4A4A4A323E00007E0102027E7E20201F01017F01011F20207E0201017E7C08
            08087C7E0202027E02027E7E02040810207E7E02040810207E00000000000000
            003E000000060F0F06000000666F6F66000000666F6F66000000666F6F660000
            003C4A4A4A323E00003E0909093E00003E4949492600007F4949493600007F09
            09090600007F49493900007F49495900001C14147F7F1010003F20203F00007F
            4848483000003F40407F00007F020C027F00007F0814227F00003E4141413E00
            007F0909090600003E414161BE00007F0919294600002649494932000040407F
            404000003F40403F00001F20201F00007F3018307F0000631408146300000708
            707007000071494D4300007F41414100007F01010100003E4141413E00007F09
            09090600003E414161BE00007F0919294600002649494932000040407F404000
            003F40403F00001F20201F00007F3018307F0000631408146300000708707007
            000071494D4300000000000000000000
        `
        clear()
    }

    //% block="clear OLED display"
    //% weight=90
    export function clear() {
        command(0x21) // SETCOLUMNADDR
        command(0)
        command(127)
        command(0x22) // SETPAGEADDR
        command(0)
        command(7)
        let data = pins.createBuffer(17)
        data[0] = 0x40
        for (let i = 1; i < 17; i++) data[i] = 0
        for (let i = 0; i < 1024; i += 16) {
            pins.i2cWriteBuffer(chipAddress, data, false)
        }
        charX = 0
        charY = 0
    }

    function drawChar(x: number, y: number, c: string) {
        command(0x21) // SETCOLUMNADDR
        command(x)
        command(x + 5)
        command(0x22) // SETPAGEADDR
        command(y)
        command(y)
        let line = pins.createBuffer(2)
        line[0] = 0x40
        let code = c.charCodeAt(0)
        for (let i = 0; i < 5; i++) {
            line[1] = font.getNumber(NumberFormat.UInt8BE, code * 5 + i)
            pins.i2cWriteBuffer(chipAddress, line, false)
        }
        line[1] = 0
        pins.i2cWriteBuffer(chipAddress, line, false)
    }

    //% block="show string %str"
    //% weight=85
    export function writeString(str: string) {
        for (let i = 0; i < str.length; i++) {
            if (charX > displayWidth - 6) {
                newLine()
            }
            drawChar(charX, charY, str.charAt(i))
            charX += 6
        }
    }

    //% block="show number %n"
    //% weight=80
    export function writeNum(n: number) {
        writeString(n.toString())
    }

    //% block="insert newline"
    //% weight=75
    export function newLine() {
        charY++
        charX = 0
    }

    //% block="scroll text %text with speed %delay ms"
    //% text.shadow="text"
    //% delay.defl=100
    //% weight=60
    export function scrollText(text: string, delay: number) {
        let padded = text + "   "
        let startX = displayWidth
        let endX = -padded.length * 6
        let savedX = charX
        let savedY = charY

        for (let x = startX; x >= endX; x--) {
            clear()
            charX = x
            charY = 0
            writeString(padded)
            basic.pause(delay)
        }

        // restore cursor
        charX = savedX
        charY = savedY
    }
}

//% color=#3af0e7 icon="\uf26c" block="SSD1309 OLED"
namespace SSD1309_OLED {
    let font: Buffer
    let chipAddress = 0x3C  // default = 60 decimal

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
    }

    //% block="show string %str"
    //% weight=85
    export function writeString(str: string) {
        // keep your original drawChar + font logic here
    }

    //% block="show number %n"
    //% weight=80
    export function writeNum(n: number) {
        writeString(n.toString())
    }

    //% block="scroll text %text with speed %delay ms"
    //% text.shadow="text"
    //% delay.defl=100
    //% weight=60
    export function scrollText(text: string, delay: number) {
        let padded = text + "   "
        let startX = 128
        let endX = -padded.length * 6
        for (let x = startX; x >= endX; x--) {
            clear()
            let oldX = charX
            let oldY = charY
            charX = x
            charY = 0
            writeString(padded)
            charX = oldX
            charY = oldY
            basic.pause(delay)
        }
    }
}



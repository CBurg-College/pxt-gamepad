//% color="#00CC00" icon="\uf1f9"
//% block="Gamepad"
//% block.loc.nl="Gamepad"
namespace Gamepad {

    export enum Joystick {
        //% block="none"
        //% block.loc.nl="geen"
        None,
        //% block="up"
        //% block.loc.nl="omhoog"
        Up,
        //% block="right up"
        //% block.loc.nl="rechts omhoog"
        UpRight,
        //% block="right"
        //% block.loc.nl="rechts"
        Right,
        //% block="right down"
        //% block.loc.nl="rechts omlaag"
        DownRight,
        //% block="down"
        //% block.loc.nl="omlaag"
        Down,
        //% block="left down"
        //% block.loc.nl="links omlaag"
        DownLeft,
        //% block="left"
        //% block.loc.nl="links"
        Left,
        //% block="left up"
        //% block.loc.nl="links omhoog"
        UpLeft
    }

    let JSANGLE = 0
    let JSPOWER = 0
    let JSDIR = Joystick.None

    export enum Power {
        //% block="Full power"
        //% block.loc.nl="volle kracht"
        Full,
        //% block="Half full power"
        //% block.loc.nl="halfvolle kracht"
        Halffull,
        //% block="Half power"
        //% block.loc.nl="halve kracht"
        Half,
        //% block="Low power"
        //% block.loc.nl="weinig kracht"
        HalfLow,
        //% block="without power"
        //% block.loc.nl="zonder kracht"
        Low
    }
    export enum Button {
        //% block="up"
        //% block.loc.nl="omhoog"
        Up, //P12
        //% block="down"
        //% block.loc.nl="omlaag"
        Down, //P15 
        //% block="left"
        //% block.loc.nl="links"
        Left, //P13
        //% block="right"
        //% block.loc.nl="rechts"
        Button4 //P14
    }

    export let BUTTONMAX = 4

    let PRESSED1 = false
    let PRESSED2 = false
    let PRESSED3 = false
    let PRESSED4 = false

    let joystickXHandler: handler
    let joystickNHandler: handler
    let joystickNEHandler: handler
    let joystickEHandler: handler
    let joystickSEHandler: handler
    let joystickSHandler: handler
    let joystickSWHandler: handler
    let joystickWHandler: handler
    let joystickNWHandler: handler

    let pressed1Handler: handler
    let pressed2Handler: handler
    let pressed3Handler: handler
    let pressed4Handler: handler

    let released1Handler: handler
    let released2Handler: handler
    let released3Handler: handler
    let released4Handler: handler

    export function handleJoystick(value: number) {
        JSPOWER = Math.floor(value / 1000)
        JSANGLE = value - JSPOWER * 1000
        let dir: Joystick

        if (JSPOWER) {
            if (JSANGLE > 338 || JSANGLE < 23) dir = Joystick.Up
            if (JSANGLE > 23 && JSANGLE < 68) dir = Joystick.UpRight
            if (JSANGLE > 68 && JSANGLE < 113) dir = Joystick.Right
            if (JSANGLE > 113 && JSANGLE < 158) dir = Joystick.DownRight
            if (JSANGLE > 158 && JSANGLE < 203) dir = Joystick.Down
            if (JSANGLE > 203 && JSANGLE < 248) dir = Joystick.DownLeft
            if (JSANGLE > 248 && JSANGLE < 293) dir = Joystick.Left
            if (JSANGLE > 293 && JSANGLE < 338) dir = Joystick.UpLeft
        }
        else
            dir = Joystick.None

        if (dir == JSDIR) return;
        JSDIR = dir

        if ((JSDIR == Joystick.None) && joystickXHandler)
            joystickXHandler()
        if ((JSDIR == Joystick.Up) && joystickNHandler)
            joystickNHandler()
        if ((JSDIR == Joystick.UpRight) && joystickNEHandler)
            joystickNEHandler()
        if ((JSDIR == Joystick.Right) && joystickEHandler)
            joystickEHandler()
        if ((JSDIR == Joystick.DownRight) && joystickSEHandler)
            joystickSEHandler()
        if ((JSDIR == Joystick.Down) && joystickSHandler)
            joystickSHandler()
        if ((JSDIR == Joystick.DownLeft) && joystickSWHandler)
            joystickSWHandler()
        if ((JSDIR == Joystick.Left) && joystickWHandler)
            joystickWHandler()
        if ((JSDIR == Joystick.UpLeft) && joystickNWHandler)
            joystickNWHandler()
    }

    export function handlePressed(button: Button) {
        switch (button) {
            case Button.Up: PRESSED1 = true; if (pressed1Handler) pressed1Handler(); break;
            case Button.Down: PRESSED2 = true; if (pressed2Handler) pressed2Handler(); break;
            case Button.Left: PRESSED3 = true; if (pressed3Handler) pressed3Handler(); break;
            case Button.Button4: PRESSED4 = true; if (pressed4Handler) pressed4Handler(); break;
        }
    }

    export function handleReleased(button: Button) {
        switch (button) {
            case Button.Up: PRESSED1 = false; if (released1Handler) released1Handler(); break;
            case Button.Down: PRESSED2 = false; if (released2Handler) released2Handler(); break;
            case Button.Left: PRESSED3 = false; if (released3Handler) released3Handler(); break;
            case Button.Button4: PRESSED4 = false; if (released4Handler) released4Handler(); break;
        }
    }

    radio.onReceivedNumber(function (value: number) {
        if (value >= 1000)
            handleJoystick(value - 1000)
        else {
            if (value >= BUTTONMAX)
                handleReleased(value - BUTTONMAX)
            else
                handlePressed(value)
        }
    })

    //% subcategory="Testen"
    //% block="%button is up"
    //% block.loc.nl="%button is losgelaten"
    export function isReleased(button: Button): boolean {
        switch (button) {
            case Button.Up: return !PRESSED1;
            case Button.Down: return !PRESSED2;
            case Button.Left: return !PRESSED3;
            case Button.Button4: return !PRESSED4;
        }
        return false;
    }

    //% subcategory="Testen"
    //% block="%button is down"
    //% block.loc.nl="%button is ingedrukt"
    export function isPressed(button: Button): boolean {
        switch (button) {
            case Button.Up: return PRESSED1;
            case Button.Down: return PRESSED2;
            case Button.Left: return PRESSED3;
            case Button.Button4: return PRESSED4;
        }
        return false;
    }

    //% subcategory="Testen"
    //% block="joystick-power"
    //% block.loc.nl="joystick-kracht"
    export function value(): number {
        return JSPOWER
    }

    //% subcategory="Testen"
    //% block="joystick Joystick"
    //% block.loc.nl="joystick-richting"
    export function joystick(): number {
        return JSANGLE
    }

    //% block="when %button is released"
    //% block.loc.nl="wanneer %button wordt losgelaten"
    export function onReleased(button: Button, code: () => void): void {
        switch (button) {
            case Button.Up: released1Handler = code; break;
            case Button.Down: released2Handler = code; break;
            case Button.Left: released3Handler = code; break;
            case Button.Button4: released4Handler = code; break;
        }
    }

    //% block="when %button is pressed"
    //% block.loc.nl="wanneer op %button wordt gedrukt"
    export function onPressed(button: Button, code: () => void): void {
        switch (button) {
            case Button.Up: pressed1Handler = code; break;
            case Button.Down: pressed2Handler = code; break;
            case Button.Left: pressed3Handler = code; break;
            case Button.Button4: pressed4Handler = code; break;
        }
    }

    //% block="when the joystick Joystick is %dir"
    //% block.loc.nl="wanneer de joystick richting %dir is"
    export function onJoystick(dir: Joystick, code: () => void): void {
        switch (dir) {
            case Joystick.None: joystickXHandler = code; break;
            case Joystick.Up: joystickNHandler = code; break;
            case Joystick.UpRight: joystickNEHandler = code; break;
            case Joystick.Right: joystickEHandler = code; break;
            case Joystick.DownRight: joystickSEHandler = code; break;
            case Joystick.Down: joystickSHandler = code; break;
            case Joystick.DownLeft: joystickSWHandler = code; break;
            case Joystick.Left: joystickWHandler = code; break;
            case Joystick.UpLeft: joystickNWHandler = code; break;
        }
    }

}

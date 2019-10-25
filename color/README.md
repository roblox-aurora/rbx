Color
=============
Library for manipulating colors


## isDark(color: Color3): boolean
Uses the YIQ equation to determine if the specified color is dark

## isLight(color: Color3): boolean
Opposite of `isDark`. Equivalent to `!isDark(color)`

## invert(color: Color3): Color3
Inverts the specified color

## greyscale(color: Color3): Color3)
Turns the color into greyscale

## toHex(color: Color3, uppercase?: boolean): string
Converts the color to a hexadecimal format (e.g. #FF00FF)

## fromHex(hex: string): Color3
Converts a hexadecimal string to a Color3 value.
Expects RRGGBB `#FF00FF` or RGB `#F0F` hex formats. `#` prefix is optional.

## gradient(colors: Array<Color3>, goal: number): Color3
Using an array of colours, gets the color in the gradient from the `goal`.

Example:

```ts
const gradient = [
	Color3.fromRGB(255, 0, 0),
	Color3.fromRGB(255, 255, 0),
];

const betweenRedAndYellow = Color.gradient(gradient, 0.5);
const moreRedThanYellow = Color.gradient(gradient, 0.25);
const moreYellowThanRed = Color.gradient(gradient, 0.75);
const red = Color.gradient(gradient, 0);
const yellow = Color.gradient(gradient, 1);
```


## fromUInt24(uint24: u24): Color3
Creates a colour from an unsigned integer

## toUInt24(color: Color3): u24
Turns a colour into an unsigned integer
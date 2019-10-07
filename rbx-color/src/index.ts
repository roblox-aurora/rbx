/**
 * Color Manipulation Library
 */
namespace Color {
	/**
	 * Lightens the colour by the specified percentage (0.0 - 1.0), 1.0 being 100% / white
	 * @param color The colour
	 * @param perc The percentage
	 */
	export function lighten(color: Color3, perc: number) {
		assert(perc <= 1 && perc >= 0);

		const r = math.min(1, color.r + color.r * perc);
		const g = math.min(1, color.g + color.g * perc);
		const b = math.min(1, color.b + color.b * perc);
		return new Color3(r, g, b);
	}

	/**
	 * Darkens the colour by the specified percentage (0.0 - 1.0), 1.0 being 100% / black
	 * @param color The colour
	 * @param perc The percentage
	 */
	export function darken(color: Color3, perc: number) {
		assert(perc <= 1 && perc >= 0);

		const r = math.max(0, color.r - color.r * perc);
		const g = math.max(0, color.g - color.g * perc);
		const b = math.max(0, color.b - color.b * perc);
		return new Color3(r, g, b);
	}

	/**
	 * Will return if this is a dark color
	 * @param color The color
	 */
	export function isDark(color: Color3) {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		const yiq = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
		return yiq < 128;
	}

	/**
	 * Inverts the color
	 * @param color The color
	 */
	export function invert(color: Color3) {
		return new Color3(1 - color.r, 1 - color.g, 1 - color.b);
	}

	/**
	 * Will return if this is a light colour
	 * @param color The color
	 */
	export function isLight(color: Color3) {
		return !isDark(color);
	}

	/**
	 * Convers the colour to greyscale
	 * @param color The color
	 */
	export function greyscale(color: Color3) {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		const val = color.r * 0.3 + color.g * 0.59 + color.b * 0.11;
		return new Color3(val, val, val);
	}

	/**
	 * Returns the colour in hexidecimal format
	 * @param color The colour
	 * @param upperCase Should it be formatted in uppercase?
	 */
	export function toHex(color: Color3, upperCase = false) {
		const r = color.r * 255;
		const g = color.g * 255;
		const b = color.b * 255;

		return (upperCase ? "#%.2X%.2X%.2X" : "#%.2x%.2x%.2x").format(r, g, b);
	}

	/**
	 * Creates a color from a hex string
	 * @param hexstr The hexidecimal string
	 */
	export function fromHex(hexstr: string): Color3 {
		if (hexstr.sub(0, 0) === "#") {
			hexstr = hexstr.sub(1);
		}

		if (hexstr.size() === 3) {
			// FFF
			return fromHex(
				hexstr.sub(0, 0).rep(2) +
					hexstr.sub(1, 1).rep(2) +
					hexstr.sub(2, 2).rep(2)
			);
		} else if (hexstr.size() === 6) {
			// FFFFFF
			const result = tonumber(hexstr, 16)!;
			if (typeIs(result, "number")) {
				return fromUInt24(result);
			} else {
				throw `Malformed Hexidecimal String`;
			}
		} else {
			throw `Invalid Hexidecimal Length of ${hexstr.size()} - Expected 3 or 6.`;
		}
	}

	/**
	 * Will return a colour in the gradient colour range specified by `val`
	 * @param colors The colour range
	 * @param val The value
	 */
	export function gradient(colors: Array<Color3>, val: number) {
		assert(val <= 1 && val >= 0);
		const toneCount = colors.size() - 1;
		const perc = (val % (1 / toneCount)) / (1 / toneCount);
		const which = math.floor(val / (1 / toneCount));
		const color1 = colors[which];
		const color2 = colors[which + 1];
		if (color2) {
			const rd = color2.r - color1.r;
			const gd = color2.g - color1.g;
			const bd = color2.b - color1.b;
			const newColor = new Color3(
				color1.r + rd * perc,
				color1.g + gd * perc,
				color1.b + bd * perc
			);
			return newColor;
		} else {
			return color1;
		}
	}

	/**
	 * Creates a colour from an integer
	 * @param uint24 The integer
	 */
	export function fromUInt24(uint24: number) {
		assert(
			uint24 >= 0x000000 && uint24 <= 0xffffff,
			"Expected UInt24 (Unsigned 24-bit Integer)"
		);
		assert(uint24 % 1 === 0, "Expected UInt24 (Unsigned 24-bit Integer)");
		return Color3.fromRGB(
			(uint24 & 0xff0000) >>> 16,
			(uint24 & 0x00ff00) >>> 8,
			(uint24 & 0x0000ff) >>> 0
		);
	}

	/**
	 * Converts the colour to an integer
	 * @param color The colour
	 */
	export function toUInt24(color: Color3) {
		const r = color.r * 255;
		const g = color.g * 255;
		const b = color.b * 255;

		return (r << 16) | (g << 8) | (b << 0);
	}
}

export = Color;

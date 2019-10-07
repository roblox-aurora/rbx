const Workspace = game.GetService("Workspace");
const UserInputService = game.GetService("UserInputService");
const GuiService = game.GetService("GuiService");

export const enum DeviceType {
	Desktop = "desktop",
	Mobile = "mobile",
	Console = "console",
	Tablet = "tablet",
	Unknown = "unknown"
}

export namespace Device {
	function gcd(a: number, b: number): number {
		if (b === 0) {
			return a;
		}

		return gcd(b, a % b);
	}

	/**
	 * Gets the viewport size
	 */
	export function GetViewportSize() {
		if (typeIs(Workspace.CurrentCamera, "Instance")) {
			return Workspace.CurrentCamera.ViewportSize;
		} else {
			return new Vector2();
		}
	}

	/**
	 * Gets the viewport size, subtracting the inset
	 */
	export function GetViewportSizeWithInset() {
		const [topLeft, bottomRight] = GuiService.GetGuiInset();
		const vpSize = GetViewportSize();
		return vpSize.sub(topLeft).sub(bottomRight);
	}

	/**
	 * Gets the aspect ratio of this device
	 * @rbxts client
	 */
	export function GetAspectRatio(): [number, number] {
		const vpSize = GetViewportSize();
		const result = gcd(vpSize.X, vpSize.Y);
		return [vpSize.X / result, vpSize.Y / result];
	}

	/**
	 * Gets the type of platform the user is on
	 *
	 * Results: `desktop`, `mobile`, `tablet`, `console`.
	 *
	 * @rbxts client
	 */
	export function GetPlatformType() {
		const hasGamepad = UserInputService.GamepadEnabled;
		const hasTouch = UserInputService.TouchEnabled;
		const hasKeyboard = UserInputService.KeyboardEnabled;

		if (hasGamepad && GuiService.IsTenFootInterface()) {
			return DeviceType.Console;
		} else if (hasTouch && !hasKeyboard) {
			const size = GetViewportSize();
			if (size.X >= 1023 && size.Y >= 767) {
				return DeviceType.Tablet;
			} else {
				return DeviceType.Mobile;
			}
		} else if (hasKeyboard) {
			return DeviceType.Desktop;
		} else {
			return DeviceType.Unknown;
		}
	}
}

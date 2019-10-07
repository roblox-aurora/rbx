const Workspace = game.GetService("Workspace");
const UserInputService = game.GetService("UserInputService");
const GuiService = game.GetService("GuiService");

export const enum PlatformType {
	Desktop = "desktop",
	Mobile = "mobile",
	Console = "console",
	Tablet = "tablet",
	Unknown = "unknown"
}

export namespace Platform {
	function getViewportSize() {
		return Workspace.CurrentCamera!.ViewportSize;
	}

	function gcd(a: number, b: number): number {
		if (b === 0) {
			return a;
		}

		return gcd(b, a % b);
	}

	/**
	 * Gets the aspect ratio of this device
	 * @rbxts client
	 */
	export function GetAspectRatio(): [number, number] {
		const vpSize = getViewportSize();
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
		// const mouseEnabled = UserInputService.MouseEnabled;

		if (hasGamepad && GuiService.IsTenFootInterface()) {
			return PlatformType.Console;
		} else if (hasTouch && !hasKeyboard) {
			const size = getViewportSize();
			if (size.X >= 1023 && size.Y >= 767) {
				return PlatformType.Tablet;
			} else {
				return PlatformType.Mobile;
			}
		} else if (hasKeyboard) {
			return PlatformType.Desktop;
		} else {
			return PlatformType.Unknown;
		}
	}
}

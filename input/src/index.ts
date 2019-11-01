import {
	Action,
	BindableGameAction,
	RobloxInputEnums,
	UserAction
} from "Action";

export namespace InputActions {
	const inputs = new Map<string, Action>();

	function _createAction(
		name: string,
		action: BindableGameAction,
		modifier?: Enum.ModifierKey,
		...keybindings: RobloxInputEnums
	) {
		const actionObject = new Action(name, action, modifier);
		inputs.set(name, actionObject);

		if (keybindings) {
			actionObject.Rebind(...keybindings);
		}

		return actionObject;
	}

	/**
	 * Creates an action
	 * @param name The name of the action
	 * @param action The action
	 * @param keybindings The key bindings
	 */
	export function Register(
		name: string,
		action: BindableGameAction,
		...keybindings: RobloxInputEnums
	): UserAction {
		return _createAction(name, action, undefined, ...keybindings);
	}

	/**
	 * Creates an action with a modifier
	 * @param name The name of the action
	 * @param action The action
	 * @param modifier The modifier key
	 * @param keybindings The keybindings
	 */
	export function RegisterWithModifier(
		name: string,
		action: BindableGameAction,
		modifier: Enum.ModifierKey,
		...keybindings: RobloxInputEnums
	): UserAction {
		return _createAction(name, action, modifier, ...keybindings);
	}

	/**
	 * Gets if the action exists
	 * @param name Then name of the action
	 */
	export function Has(name: string): boolean {
		return inputs.has(name);
	}

	/**
	 * Gets the action by the specified name
	 * @param name The name of the action
	 */
	export function Get(name: string): UserAction {
		const action = inputs.get(name);
		if (!action) {
			throw `Attempted to get undefined action '${name}'.`;
		}
		return action;
	}

	export function IsActive(name: string) {
		return inputs.has(name) && inputs.get(name)!.IsActive();
	}

	export function Unregister(name: string) {
		if (inputs.has(name)) {
			const input = inputs.get(name)!;
			input.Unbind();
			inputs.delete(name);
		}
	}
}

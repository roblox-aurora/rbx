import Signal from "@rbxts/signal";

const ContextActionService = game.GetService("ContextActionService");

type BindableGameAction = (
	actionName: string,
	inputState: Enum.UserInputState,
	inputObject: InputObject
) => void;

type RobloxInputEnums = Array<
	Enum.KeyCode | Enum.PlayerActions | Enum.UserInputType
>;

type ReadonlySignal<
	ConnectedFunctionSignature = () => void,
	Generic = false
> = Pick<Signal<ConnectedFunctionSignature, Generic>, "Connect" | "Wait">;

interface UserAction {
	/**
	 * Event handler for InputBegan
	 */
	readonly InputBegan: ReadonlySignal<
		(name: string, input: InputObject) => void
	>;

	/**
	 * Event handler for InputChanged
	 */
	readonly InputChanged: ReadonlySignal<
		(name: string, input: InputObject) => void
	>;

	/**
	 * Event handler for InputEnded
	 */
	readonly InputEnded: ReadonlySignal<
		(name: string, input: InputObject) => void
	>;

	/**
	 * Updates the keybindings of this action
	 * @param keybindings The keybindings
	 */
	Rebind(...keybindings: RobloxInputEnums): void;

	/**
	 * Sets a modifier key for this action
	 * @param modifierKey The modifier key
	 */
	SetModifierKey(modifierKey: Enum.ModifierKey | undefined): void;

	/**
	 * Returns whether or not this input action is active (down)
	 */
	IsActive(): boolean;

	/**
	 * Unbinds this action
	 */
	Unbind(): void;
}

class Action implements UserAction {
	private isBound = false;
	private boundTo: RobloxInputEnums = [];
	private isActive = false;
	private action: BindableGameAction;

	public readonly InputBegan = new Signal<
		(name: string, input: InputObject) => void
	>();
	public readonly InputChanged = new Signal<
		(name: string, input: InputObject) => void
	>();
	public readonly InputEnded = new Signal<
		(name: string, input: InputObject) => void
	>();

	constructor(
		private name: string,
		action: BindableGameAction,
		private modifierKey?: Enum.ModifierKey
	) {
		this.action = (
			_: string,
			state: Enum.UserInputState,
			input: InputObject
		) => {
			if (
				this.modifierKey === undefined ||
				input.IsModifierKeyDown(this.modifierKey)
			) {
				if (state === Enum.UserInputState.Begin) {
					this.InputBegan.Fire(name, input);
					this.isActive = true;
				} else if (state === Enum.UserInputState.Change) {
					this.InputChanged.Fire(name, input);
				} else if (state === Enum.UserInputState.End) {
					this.InputEnded.Fire(name, input);
					this.isActive = false;
				}

				action(name, state, input);
			}
		};
	}

	/**
	 * Gets the name of this action
	 */
	public GetName() {
		return this.name;
	}

	/**
	 * Gets whether or not this action is active (Enum.UserInputState.Begin)
	 */
	public IsActive() {
		return this.isActive;
	}

	/**
	 * Gets all the keybindings for this action
	 */
	public GetRobloxInputs() {
		return this.boundTo;
	}

	/**
	 * Sets a modifier key for this action
	 * @param modifierKey The modifier key
	 */
	public SetModifierKey(modifierKey: Enum.ModifierKey | undefined) {
		this.modifierKey = modifierKey;
	}

	/**
	 * Updates the keybindings of this action
	 * @param keybindings The keybindings
	 */
	public Rebind(...keybindings: RobloxInputEnums) {
		const { name, action } = this;
		if (this.isBound) {
			ContextActionService.UnbindAction(name);
		}

		ContextActionService.BindAction(name, action, false, ...keybindings);
		this.boundTo = keybindings;
		this.isBound = true;
	}

	public Unbind() {
		const { name, isBound } = this;
		if (isBound) {
			ContextActionService.UnbindAction(name);
		}
	}
}

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

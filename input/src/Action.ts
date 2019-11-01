import Signal from "@rbxts/signal";
const ContextActionService = game.GetService("ContextActionService");

export type RobloxInputEnums = Array<
	Enum.KeyCode | Enum.PlayerActions | Enum.UserInputType
>;

type ReadonlySignal<
	ConnectedFunctionSignature = () => void,
	Generic = false
> = Pick<Signal<ConnectedFunctionSignature, Generic>, "Connect" | "Wait">;

export type BindableGameAction = (
	actionName: string,
	inputState: Enum.UserInputState,
	inputObject: InputObject
) => void;

export interface UserAction {
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

export class Action implements UserAction {
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

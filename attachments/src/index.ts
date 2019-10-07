/**
 * Utility functions for Accessory objects & Attachments
 */
namespace Accessories {
	/**
	 * Welds two attachments together
	 * @param attach1 The first attachment
	 * @param attach2 The second attachment
	 */
	export function WeldAttachments(attach1: Attachment, attach2: Attachment) {
		const weld = new Instance("Weld");
		weld.Part0 = attach1.Parent as BasePart;
		weld.Part1 = attach2.Parent as BasePart;
		weld.C0 = attach1.CFrame;
		weld.C1 = attach2.CFrame;
		weld.Parent = attach1.Parent;
		return weld;
	}

	/**
	 * Finds the first attachment matching the specified name
	 * @param model The model to find the attachment in
	 * @param name The name of the attachment
	 */
	export function FindFirstMatchingAttachment(model: Model, name: string) {
		for (const child of model.GetDescendants()) {
			if (child.IsA("Attachment") && child.Name === name) {
				return child;
			}
		}

		return undefined;
	}

	/**
	 * Welds an accessory to a character
	 * @param character The character
	 * @param accessory The accessory
	 * @param handleName The handle
	 */
	export function WeldAccessory(
		character: Model,
		accessory: Accessory,
		handleName = "handle",
	) {
		assert(accessory.IsA("Accessory"));

		const handle = accessory.FindFirstChild(handleName);
		if (handle) {
			const accoutrementAttachment = handle.FindFirstChildOfClass(
				"Attachment",
			);
			if (accoutrementAttachment) {
				const characterAttachment = FindFirstMatchingAttachment(
					character,
					accoutrementAttachment.Name,
				);
				if (characterAttachment) {
					WeldAttachments(
						accoutrementAttachment,
						characterAttachment,
					);
					accessory.Parent = character;
					return accessory;
				} else {
					throw `Could not find matching '${accoutrementAttachment.Name}' attachment in character`;
				}
			} else {
				throw `Could not find attachment in handle '${handle}'`;
			}
		} else {
			throw `No handle detected.`;
		}
	}
}

export = Accessories;

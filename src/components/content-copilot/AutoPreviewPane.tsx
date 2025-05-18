import { useEffect } from "react";
import { usePaneRouter } from "sanity/desk";

export const AutoPreviewPane = () => {
	const {
		setView,
		duplicateCurrent,
		groupIndex,
		hasGroupSiblings,
		routerPanesState,
	} = usePaneRouter();

	useEffect(() => {
		// console.log("[AutoPreviewPane] Component mounted");
		// console.log("[AutoPreviewPane] Router state:", routerPanesState);
		// console.log("[AutoPreviewPane] Group index:", groupIndex);
		// console.log("[AutoPreviewPane] Has group siblings:", hasGroupSiblings);

		// Check if "contentCopilot" view is active
		const isContentCopilotActive = routerPanesState.some((group) =>
			group.some((pane) => {
				//console.log("[AutoPreviewPane] Checking pane:", pane.id, pane.params?.view);
				return pane.params?.view === "contentCopilot";
			})
		);

		//console.log("[AutoPreviewPane] Is Content Copilot active:", isContentCopilotActive);

		if (!isContentCopilotActive) {
			if (hasGroupSiblings) {
				//console.log("[AutoPreviewPane] Has siblings, group index:", groupIndex);
				if (groupIndex === 1) {
					//console.log("[AutoPreviewPane] Setting view to contentCopilot");
					setView("contentCopilot");
				}
			} else {
				//console.log("[AutoPreviewPane] No siblings, duplicating current pane");
				duplicateCurrent();
			}
		} else {
			//console.log("[AutoPreviewPane] Content Copilot already active, no action needed");
		}
		// Ignoring this because adding deps causes lots of loops
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}; 
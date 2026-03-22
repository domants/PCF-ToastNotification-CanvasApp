import { IInputs, IOutputs } from "./generated/ManifestTypes";
import {
  ToastNotificationComponent,
  IToastNotificationProps,
} from "./ToastNotificationComponent";
import * as React from "react";

const VALID_THEMES = ["light", "dark", "high-contrast", "transparent"] as const;
const VALID_INTENTS = ["info", "success", "warning", "error"] as const;
const VALID_POSITIONS = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
] as const;

export class ToastNotification implements ComponentFramework.ReactControl<
  IInputs,
  IOutputs
> {
  private _notifyOutputChanged: () => void;
  private _toastStatus = "";
  private _actionClicked = false;

  // stable callback references to avoid unnecessary React re-renders
  private _onStatusChange = (status: string) => {
    this._toastStatus = status;
    this._notifyOutputChanged();
  };

  private _onActionClicked = () => {
    this._actionClicked = true;
    this._notifyOutputChanged();
  };

  constructor() {
    // Empty
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
  ): void {
    this._notifyOutputChanged = notifyOutputChanged;
    context.mode.trackContainerResize(true);
  }

  public updateView(
    context: ComponentFramework.Context<IInputs>,
  ): React.ReactElement {
    const trigger = context.parameters.Trigger?.raw ?? 0;
    const title = context.parameters.Title?.raw ?? "Notification";
    const body = context.parameters.Body?.raw ?? "";
    const subtitle = context.parameters.Subtitle?.raw ?? "";
    const timeout = context.parameters.Timeout?.raw ?? 3000;
    const pauseOnHover = context.parameters.PauseOnHover?.raw ?? true;
    const pauseOnWindowBlur =
      context.parameters.PauseOnWindowBlur?.raw ?? false;
    const actionLabel = context.parameters.ActionLabel?.raw ?? "";
    const dismissLabel = context.parameters.DismissLabel?.raw ?? "Dismiss";

    const themeRaw = context.parameters.Theme?.raw ?? "light";
    const theme = (VALID_THEMES as readonly string[]).includes(themeRaw)
      ? themeRaw
      : "light";

    const intentRaw = context.parameters.Intent?.raw ?? "info";
    const intent = (VALID_INTENTS as readonly string[]).includes(intentRaw)
      ? intentRaw
      : "info";

    const positionRaw = context.parameters.Position?.raw ?? "bottom-end";
    const position = (VALID_POSITIONS as readonly string[]).includes(
      positionRaw,
    )
      ? positionRaw
      : "bottom-end";

    const props: IToastNotificationProps = {
      trigger,
      theme,
      title,
      body,
      subtitle,
      intent,
      position,
      timeout,
      pauseOnHover,
      pauseOnWindowBlur,
      actionLabel,
      dismissLabel,
      onStatusChange: this._onStatusChange,
      onActionClicked: this._onActionClicked,
    };

    return React.createElement(ToastNotificationComponent, props);
  }

  public getOutputs(): IOutputs {
    const outputs: IOutputs = {
      ToastStatus: this._toastStatus,
      ActionClicked: this._actionClicked,
    };
    // reset ActionClicked after it's been read by the framework
    if (this._actionClicked) {
      this._actionClicked = false;
    }
    return outputs;
  }

  public destroy(): void {
    // React handles cleanup
  }
}

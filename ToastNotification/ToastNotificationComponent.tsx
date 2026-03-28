import * as React from "react";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  teamsHighContrastTheme,
  Toaster,
  Toast,
  ToastTitle,
  ToastBody,
  ToastFooter,
  ToastTrigger,
  useToastController,
  useId,
  Link,
} from "@fluentui/react-components";
import type {
  Theme,
  ToastIntent,
  ToastPosition,
} from "@fluentui/react-components";

const transparentTheme: Theme = {
  ...webLightTheme,
  colorNeutralBackground1: "transparent",
  colorNeutralBackground2: "transparent",
  colorNeutralBackground3: "transparent",
  colorNeutralBackground4: "transparent",
  colorNeutralBackground5: "transparent",
  colorNeutralBackground6: "transparent",
};

const THEME_MAP: Record<string, Theme> = {
  light: webLightTheme,
  dark: webDarkTheme,
  "high-contrast": teamsHighContrastTheme,
  transparent: transparentTheme,
};

const PROGRESS_COLORS: Record<string, string> = {
  info: "#0078d4",
  success: "#0f7b0f",
  warning: "#9d5d00",
  error: "#bc2f32",
};

const PROGRESS_CSS = `
@keyframes toast-progress-shrink {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
.fui-Toast {
  position: relative;
  overflow: hidden;
}
.fui-Toast:hover .toast-progress-bar {
  animation-play-state: paused;
}
.fui-Toaster {
  padding: 0 !important;
  margin: 0 !important;
}
.fui-Toaster > .fui-ToastContainer:first-child {
  margin-top: 0 !important;
}
.fui-Toaster > div {
  animation-duration: 0.05s !important;
  transition-duration: 0.05s !important;
}
`;

export interface IToastNotificationProps {
  trigger: number;
  theme: string;
  title: string;
  body: string;
  subtitle: string;
  intent: ToastIntent;
  position: ToastPosition;
  paddingX: number;
  paddingY: number;
  timeout: number;
  pauseOnHover: boolean;
  actionLabel: string;
  dismissLabel: string;
  onStatusChange: (status: string) => void;
  onActionClicked: () => void;
  onTimerEnd: () => void;
}

export const ToastNotificationComponent: React.FC<IToastNotificationProps> = (
  props,
) => {
  const {
    trigger,
    theme,
    position,
    paddingX,
    paddingY,
    timeout,
    pauseOnHover,
  } = props;
  const resolvedTheme = THEME_MAP[theme] ?? webLightTheme;

  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const prevTriggerRef = React.useRef<number>(0);
  const manualDismissRef = React.useRef<boolean>(false);

  // Use a ref for all values captured inside dispatchToast to avoid stale closures
  const propsRef = React.useRef(props);
  propsRef.current = props;

  React.useEffect(() => {
    // Dispatch toast when trigger value changes (counter incremented)
    if (trigger !== prevTriggerRef.current && trigger > 0) {
      const cur = propsRef.current;
      manualDismissRef.current = false;

      // Build ToastTitle action: dismiss button if dismissLabel is set
      const dismissAction = cur.dismissLabel ? (
        <ToastTrigger>
          <Link
            onClick={() => {
              manualDismissRef.current = true;
            }}
          >
            {cur.dismissLabel}
          </Link>
        </ToastTrigger>
      ) : undefined;

      // Build action link: shown in title (if no dismiss) or footer (if both)
      const actionLink = cur.actionLabel ? (
        <Link onClick={() => propsRef.current.onActionClicked?.()}>
          {cur.actionLabel}
        </Link>
      ) : undefined;

      // If both are present, dismiss goes in title action, action link goes in footer
      const titleAction = dismissAction ?? actionLink;
      const showFooterAction = cur.dismissLabel && cur.actionLabel;

      dispatchToast(
        <Toast>
          <ToastTitle action={titleAction}>{cur.title}</ToastTitle>
          {cur.body ? (
            <ToastBody subtitle={cur.subtitle || undefined}>
              {cur.body}
            </ToastBody>
          ) : null}
          {showFooterAction ? (
            <ToastFooter>
              <Link onClick={() => propsRef.current.onActionClicked?.()}>
                {cur.actionLabel}
              </Link>
            </ToastFooter>
          ) : null}
          {cur.timeout > 0 ? (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
              }}
            >
              <div
                className="toast-progress-bar"
                style={{
                  height: "100%",
                  backgroundColor:
                    PROGRESS_COLORS[cur.intent] ?? PROGRESS_COLORS.info,
                  transformOrigin: "left",
                  animation: `toast-progress-shrink ${cur.timeout}ms linear forwards`,
                }}
              />
            </div>
          ) : null}
        </Toast>,
        {
          intent: cur.intent,
          position: cur.position,
          timeout: cur.timeout,
          pauseOnHover: cur.pauseOnHover,
          onStatusChange: (_e, data) => {
            propsRef.current.onStatusChange?.(data.status);
            if (data.status === "dismissed" && !manualDismissRef.current) {
              propsRef.current.onTimerEnd?.();
            }
          },
        },
      );
    }
    prevTriggerRef.current = trigger;
  }, [trigger, dispatchToast]);

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: paddingX,
    right: paddingX,
  };

  if (position.includes("top")) {
    containerStyle.top = paddingY;
  }

  if (position.includes("bottom")) {
    containerStyle.bottom = paddingY;
  }

  return (
    <FluentProvider
      theme={resolvedTheme}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        transform: "scale(1)",
        background: "transparent",
      }}
    >
      <style>{PROGRESS_CSS}</style>
      <Toaster
        toasterId={toasterId}
        inline
        position={position}
        offset={{
          horizontal: paddingX,
          vertical: paddingY,
        }}
        pauseOnHover={pauseOnHover}
        timeout={timeout}
      />
    </FluentProvider>
  );
};

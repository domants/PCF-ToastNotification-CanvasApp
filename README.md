# Toast Notification - PCF Control for Canvas Apps

A PowerApps Component Framework (PCF) virtual control that provides fully configurable toast notifications using Fluent UI v9. Built with React + TypeScript.

Features include configurable position, intent-based styling, auto-dismiss with a countdown progress bar, pause on hover, action links, and theme support.

---

## Installation

1. Import the solution from the `ToastNotificationSolution` folder into your Power Platform environment.
2. In your Canvas App, go to **Insert > Get more components > Code** and add **ToastNotification**.

---

## Canvas App Setup

### 1. Component Placement

Add the ToastNotification component to your screen and make it fill the entire screen so toasts can appear in any position:

| Property | Value           |
| -------- | --------------- |
| X        | `0`             |
| Y        | `0`             |
| Width    | `Parent.Width`  |
| Height   | `Parent.Height` |

### 2. Button OnSelect

Add a button and increment a counter variable on each click:

```
Set(varTrigger, varTrigger + 1)
```

### 3. Bind the Trigger Property

Set the component's **Trigger** property to the variable:

```
varTrigger
```

Every button click increments the counter, the control detects the change and dispatches a toast. No reset needed, works every time.

---

## Input Properties

| Property         | Type              | Default          | Description                                                                                              |
| ---------------- | ----------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| **Trigger**      | `Whole.None`      | `0`              | Increment to dispatch a toast (e.g. `Set(varTrigger, varTrigger + 1)`)                                   |
| **Title**        | `SingleLine.Text` | `"Notification"` | Toast title text                                                                                         |
| **Body**         | `SingleLine.Text` | `""`             | Toast body text (leave empty to omit)                                                                    |
| **Subtitle**     | `SingleLine.Text` | `""`             | Subtitle displayed below the body (leave empty to omit)                                                  |
| **Intent**       | `Enum`            | `"info"`         | Toast visual style: `info`, `success`, `warning`, `error`                                                |
| **Position**     | `Enum`            | `"bottom-end"`   | Where the toast appears on screen: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end` |
| **PaddingX**     | `Whole.None`      | `16`             | Horizontal padding (in pixels) between toast and container edge; `0` = flush to side                     |
| **PaddingY**     | `Whole.None`      | `16`             | Vertical padding (in pixels) between toast and container edge; `0` = flush to edge                       |
| **Theme**        | `Enum`            | `"transparent"`  | Fluent UI theme: `light`, `dark`, `high-contrast`, `transparent`                                         |
| **Timeout**      | `Whole.None`      | `3000`           | Auto-dismiss duration in milliseconds. Use `-1` for no auto-dismiss                                      |
| **PauseOnHover** | `TwoOptions`      | `true`           | Pause the dismiss timer when hovering over the toast                                                     |
| **ActionLabel**  | `SingleLine.Text` | `""`             | Label for an action link (leave empty to omit)                                                           |
| **DismissLabel** | `SingleLine.Text` | `"Dismiss"`      | Label for the dismiss link (leave empty to omit)                                                         |

### Position Options

| Value          | Description   |
| -------------- | ------------- |
| `top`          | Top center    |
| `top-start`    | Top left      |
| `top-end`      | Top right     |
| `bottom`       | Bottom center |
| `bottom-start` | Bottom left   |
| `bottom-end`   | Bottom right  |

### Theme Options

| Value           | Description                                              |
| --------------- | -------------------------------------------------------- |
| `transparent`   | Invisible background — your app background shows through |
| `light`         | Fluent UI light theme                                    |
| `dark`          | Fluent UI dark theme                                     |
| `high-contrast` | High contrast theme for accessibility                    |

---

## Output Properties

| Property          | Type              | Description                                                                        |
| ----------------- | ----------------- | ---------------------------------------------------------------------------------- |
| **ToastStatus**   | `SingleLine.Text` | Last toast lifecycle status: `queued`, `visible`, `dismissed`, `unmounted`         |
| **ActionClicked** | `TwoOptions`      | `true` when the user clicks the action link                                        |
| **OnTimerEnd**    | `TwoOptions`      | `true` when the toast auto-dismiss timer expires (does not fire on manual dismiss) |

---

## Examples

### Basic Success Toast

**Button OnSelect:**

```
Set(varTrigger, varTrigger + 1)
```

**Component Properties:**

| Property | Value                                          |
| -------- | ---------------------------------------------- |
| Trigger  | `varTrigger`                                   |
| Title    | `"Record Saved"`                               |
| Body     | `"Your changes have been saved successfully."` |
| Intent   | `success`                                      |

### Dynamic Toast with Variables

**Button OnSelect:**

```
Set(varTitle, "Upload Complete");
Set(varBody, "File has been uploaded.");
Set(varIntent, "success");
Set(varTrigger, varTrigger + 1)
```

**Component Properties:**

| Property | Value        |
| -------- | ------------ |
| Trigger  | `varTrigger` |
| Title    | `varTitle`   |
| Body     | `varBody`    |
| Intent   | `varIntent`  |

### Error Toast with Action Link

**Button OnSelect:**

```
Set(varTrigger, varTrigger + 1)
```

**Component Properties:**

| Property    | Value                                         |
| ----------- | --------------------------------------------- |
| Trigger     | `varTrigger`                                  |
| Title       | `"Save Failed"`                               |
| Body        | `"Unable to save changes. Please try again."` |
| Intent      | `error`                                       |
| ActionLabel | `"Retry"`                                     |
| Timeout     | `-1`                                          |

**React to the action click:**

```
If(ToastNotification.ActionClicked, Set(varTrigger, varTrigger + 1))
```

### Persistent Toast (No Auto-Dismiss)

| Property     | Value      |
| ------------ | ---------- |
| Timeout      | `-1`       |
| DismissLabel | `"Got it"` |

The toast stays on screen until the user clicks the dismiss link.

### Toast at Exact Corner (Flush Positioning)

**Component Properties:**

| Property | Value       |
| -------- | ----------- |
| Position | `top-start` |
| PaddingX | `0`         |
| PaddingY | `0`         |

With both padding values set to `0`, the toast will be positioned flush against the exact corner of the control without any gap.

### Trigger Action When Timer Ends

**Component OnChange event:**

```
If(ToastNotification1.OnTimerEnd,
  Notify("Toast auto-dismissed"; NotificationType.Information)
)
```

This fires only when the toast auto-dismisses after the timeout expires, not when the user manually dismisses it.

---

## Toast Lifecycle

Each toast goes through these statuses (available via `ToastStatus` output):

```
queued → visible → dismissed → unmounted
```

| Status      | Description                             |
| ----------- | --------------------------------------- |
| `queued`    | Toast is queued and waiting to be shown |
| `visible`   | Toast is visible on screen              |
| `dismissed` | Toast is animating out                  |
| `unmounted` | Toast has been removed from the DOM     |

---

## Progress Bar

Each toast displays a countdown progress bar at the bottom of the card that visually indicates the remaining time before auto-dismiss. The progress bar:

- Matches the intent color (blue for info, green for success, amber for warning, red for error)
- Pauses when hovering over the toast (if PauseOnHover is enabled)
- Is hidden when Timeout is set to `-1` (persistent toasts)

---

## Positioning and Padding Guide

### Flexible Positioning

Use the **Position** property to control where the toast appears:

- **Top positions** (`top`, `top-start`, `top-end`): Toast appears at the top of the screen
- **Bottom positions** (`bottom`, `bottom-start`, `bottom-end`): Toast appears at the bottom
- **Start/End**: Align left or right respectively

### Fine-Tuning Spacing with Padding

The **PaddingX** and **PaddingY** properties provide precise control over the gap between the toast and the container edges:

| Scenario        | PaddingX | PaddingY | Result                         |
| --------------- | -------- | -------- | ------------------------------ |
| Default spacing | `16`     | `16`     | 16px gap on all sides          |
| Flush to corner | `0`      | `0`      | Toast touches the exact corner |
| Wide margin     | `32`     | `32`     | Larger gap from edges          |
| Custom spacing  | `10`     | `20`     | Different X and Y spacing      |

**Pro Tip:** Set `PaddingY=0` for top positions to make the toast sit flush at the top edge, or `PaddingY=0` for bottom positions to sit flush at the bottom edge.

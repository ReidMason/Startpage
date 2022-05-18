export declare type State =
  | "default"
  | "danger"
  | "warning"
  | "success"
  | "grey"
  | "dark";

export declare type Variant = "default" | "outline" | "ghost";

export declare type Type = "button" | "reset" | "submit";

export declare type Styles = { [key in Variant]: StateStyles };

export declare type StateStyles = { [key in State]: string };

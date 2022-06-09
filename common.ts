import { Transition } from "framer-motion";
import { GeneralConfig } from "./services/server/config/types";

export const springTranstition: Transition = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

export const stiffSpringTransition: Transition = {
  type: "spring",
  stiffness: 700,
  damping: 40,
};

export const softSpringTransition: Transition = {
  type: "spring",
  bounce: 0.15,
};

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

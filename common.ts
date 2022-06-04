import { Transition } from "framer-motion";

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

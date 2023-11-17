"use client";

import React from "react";
import { Icon as IconifyIcon } from "@iconify/react";

interface IconProps {
  icon: string;
}

export default function Icon({ icon }: IconProps) {
  return <IconifyIcon icon={icon} />;
}

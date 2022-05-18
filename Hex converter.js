let colours = [
  "--colour-primary-900: #031226",
  "--colour-primary-800: #0a2243",
  "--colour-primary-700: #0e2e59",
  "--colour-primary-600: #0e3b78",
  "--colour-primary-500: #1d539b",
  "--colour-primary-400: #3973c2",
  "--colour-primary-300: #5996e6",
  "--colour-primary-200: #93c0fd",
  "--colour-primary-100: #c9dffe",
  "--colour-primary-50: #c9dffe",

  "--colour-green-900: #1e5115",
  "--colour-green-800: #2c6124",
  "--colour-green-700: #396f30",
  "--colour-green-600: #477e3e",
  "--colour-green-500: #609358",
  "--colour-green-400: #81ac7a",
  "--colour-green-300: #a4c79e",
  "--colour-green-200: #c2debe",
  "--colour-green-100: #ddeeda",
  "--colour-green-50: #f6faf6",

  "--colour-red-900: #7f1d1d",
  "--colour-red-800: #991b1b",
  "--colour-red-700: #b91c1c",
  "--colour-red-600: #dc2626",
  "--colour-red-500: #ef4444",
  "--colour-red-400: #f87171",
  "--colour-red-300: #fca5a5",
  "--colour-red-200: #fecaca",
  "--colour-red-100: #fee2e2",
  "--colour-red-50: #fff7ed",

  "--colour-yellow-900: #713f12",
  "--colour-yellow-800: #854d0e",
  "--colour-yellow-700: #a16207",
  "--colour-yellow-600: #ca8a04",
  "--colour-yellow-500: #eab308",
  "--colour-yellow-400: #facc15",
  "--colour-yellow-300: #fde047",
  "--colour-yellow-200: #fef08a",
  "--colour-yellow-100: #fef9c3",
  "--colour-yellow-50: #fefce8",

  "--colour-grey-900: #0f172a",
  "--colour-grey-800: #1e293b",
  "--colour-grey-700: #334155",
  "--colour-grey-600: #475569",
  "--colour-grey-500: #64748b",
  "--colour-grey-400: #94a3b8",
  "--colour-grey-300: #cbd5e1",
  "--colour-grey-200: #e2e8f0",
  "--colour-grey-100: #f1f5f9",
  "--colour-grey-50: #f8fafc",
];

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

var output = "";
colours.forEach((x) => {
  const [varName, hexCode] = x.split(" #", 2);
  const [r, g, b] = hexToRgb(`#${hexCode}`);
  output += `${varName} ${r} ${g} ${b};\n`;
  if (varName.includes("50:")) output += "\n";
});
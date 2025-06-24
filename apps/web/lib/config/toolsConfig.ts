
type ToolType = "single" | "multi" | "switchable";

export type Tool = {
  id: string;
  type: ToolType;
  icon?: string;
  children?: { id: string; icon: string }[];
  activeIndex?: number;
  icons?: { id: string; icon: string }[];
};

export const toolsConfig: Tool[] = [
  {
    id: "pointer",
    type: "single",
    icon: "MousePointer2",
  },
  {
    id: "text",
    type: "single",
    icon: "Type",
  },
  {
    id: "circle",
    type: "single",
    icon: "Circle",
  },
  {
    id: "rectangle",
    type: "single",
    icon: "Square",
  },
  {
    id: "shapes",
    type: "multi",
    icon: "Shapes",
    children: [
      { id: "rectangle", icon: "Square" },
      { id: "circle", icon: "Circle" },
      { id: "triangle", icon: "Triangle" },
    ],
  },
  {
    id: "pen",
    type: "switchable",
    activeIndex: 0,
    icons: [
      { id: "pen", icon: "Pen" },
      { id: "highlighter", icon: "Highlighter" },
    ],
  },
];
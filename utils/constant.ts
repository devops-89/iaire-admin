import { CATEGORY } from "./enum";

export const BATCH_TABLE_TABS = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Research",
    value: CATEGORY.RESEARCH,
  },
  {
    label: "Innovation",
    value: CATEGORY.INNOVATION,
  },
  {
    label: "Entrepreneurship",
    value: CATEGORY.ENTREPRENEURSHIP,
  },
];

export const BATCH_TABLE_HEADER = [
  "Id",
  "Name",
  "Start Date",
  "End Date",
  "Status",
  "Category",
  "Actions",
];

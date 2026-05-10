import { CATEGORY, USER_ROLES } from "./enum";

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

export const ROLES = [
  {
    label: "Student",
    value: USER_ROLES.STUDENT,
  },
  {
    label: "Mentor",
    value: USER_ROLES.MENTOR,
  },
  {
    label: "Institution",
    value: USER_ROLES.INSTITUTION,
  },
];

export const CATEGORY_DATA = [
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

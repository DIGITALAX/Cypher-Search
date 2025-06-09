import { ChangeEvent } from "react";

export type DropDownProps = {
  title: string;
  hashtag?: boolean;
  reverse?: boolean;
  value: string;
  onChange: (e: ChangeEvent) => void;
  openDropDown: boolean;
  setOpenDropDown: () => void;
  dropDownValues: string[];
  onDropDownChoose: (e: string) => void;
};

export type ImageDropDownProps = {
  title: string;
  cover?: boolean;
  rounded?: boolean;
  reverse?: boolean;
  value: string;
  onChange: (e: ChangeEvent) => void;
  openDropDown: boolean;
  setOpenDropDown: () => void;
  dropDownValues: string[][];
  onDropDownChoose: (e: string) => void;
};

export enum Indexar {
  Inactive = "inactive",
  Success = "suc",
  Indexando = "ind",
}

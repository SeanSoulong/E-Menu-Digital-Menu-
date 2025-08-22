import { babyProducts } from "./baby";
import { kitchenProducts } from "./kitchen";
import { clothesProducts } from "./clothes";
import { foodProducts } from "./food";
import { householdProducts } from "./household";
import { healthProducts } from "./health";

export const products = [
  ...babyProducts,
  ...kitchenProducts,
  ...clothesProducts,
  ...foodProducts,
  ...householdProducts,
  ...healthProducts,
];

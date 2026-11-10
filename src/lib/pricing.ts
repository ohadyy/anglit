import { getProduct, loyaltyPrice, type Product } from "@/content/pricingCopy";
import type { ProductId } from "@/lib/enums";

// The one place that decides what a product costs a given buyer. The checkout API charges
// exactly this, and the pricing and checkout pages show exactly this.

const COURSE = getProduct("course")!;

/** Anyone who already paid for something other than the seminar gets the loyalty price on the seminar */
export const isLoyalCustomer = (owned: readonly ProductId[]) => owned.length > 0 && !owned.includes("course");

export function coursePrice(loyal: boolean) {
  const listIls = COURSE.priceIls;
  return { listIls, priceIls: loyal ? loyaltyPrice(listIls) : listIls, loyal };
}

export function priceFor(product: Product, owned: readonly ProductId[]) {
  if (product.id === "course") return coursePrice(isLoyalCustomer(owned));
  return { listIls: product.priceIls, priceIls: product.priceIls, loyal: false };
}

/** Percent off the crossed-out list price, rounded down so the page never claims more than it gives */
export const discountPercent = (product: Product) =>
  product.listPriceIls ? Math.floor((1 - product.priceIls / product.listPriceIls) * 100) : 0;

export const courseProduct = COURSE;

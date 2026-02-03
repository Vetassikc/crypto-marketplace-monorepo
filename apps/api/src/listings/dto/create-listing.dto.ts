export class CreateListingDto {
  title: string;
  description?: string;
  price: string; // Decimal passed as string
  currency?: string;
  images?: string[];
  sellerId: string;
}

export class UpdateListingDto {
  title?: string;
  description?: string;
  price?: string;
  images?: string[];
  status?: string; // Should be part of schema? Listing status (active/sold) isn't in schema yet, maybe add later.
}

// Resolves the image shown for a car.
//
// When an imagin.studio license key is configured (IMAGIN_CUSTOMER_KEY) AND the
// car has imaginMake / imaginModel set, we render a clean studio side-profile
// (angle 21 = pure side view on white, the "Budget" look). Otherwise we fall
// back to the photo stored on the car (uploaded or seeded), so the site always
// shows something even with no key.
//
// Docs: https://imagin.studio  — getImage params: make, modelFamily, modelYear,
// angle, paintDescription, width, fileType, zoomType.

export type ResolvableCar = {
  image: string;
  imaginMake?: string | null;
  imaginModel?: string | null;
  year?: number | null;
};

export function imaginEnabled(): boolean {
  return !!process.env.IMAGIN_CUSTOMER_KEY;
}

export function resolveCarImage(car: ResolvableCar): string {
  const key = process.env.IMAGIN_CUSTOMER_KEY;
  if (!key || !car.imaginMake || !car.imaginModel) return car.image;

  const params = new URLSearchParams({
    customer: key,
    make: car.imaginMake,
    modelFamily: car.imaginModel,
    angle: process.env.IMAGIN_ANGLE || "21", // 21 = side profile
    width: "1100",
    fileType: "png",
    zoomType: "fullscreen",
  });
  if (car.year) params.set("modelYear", String(car.year));
  // Optional: force a single paint colour for a uniform fleet look.
  if (process.env.IMAGIN_PAINT) params.set("paintDescription", process.env.IMAGIN_PAINT);

  return `https://cdn.imagin.studio/getImage?${params.toString()}`;
}

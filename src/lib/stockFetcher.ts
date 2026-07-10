import { db, isConfigured } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Queries the inventory_items collection for available stock count of a vehicle/variant/color.
 * If database is not configured or queries fail, falls back to returning 1 to avoid blocking sales.
 */
export async function getLiveStockCount(
  vehicleName: string,
  variantName: string,
  colorName: string
): Promise<number> {
  if (!isConfigured) {
    try {
      const local = localStorage.getItem("lt_inventory_items");
      if (local) {
        const items = JSON.parse(local) as Array<{
          vehicle: string;
          variant: string;
          color: string;
          status: string;
        }>;
        const matching = items.filter(
          (item) =>
            item.vehicle.toLowerCase() === vehicleName.toLowerCase() &&
            item.variant.toLowerCase() === variantName.toLowerCase() &&
            item.color.toLowerCase() === colorName.toLowerCase() &&
            item.status === "Available"
        );
        return matching.length;
      }
    } catch (e) {
      console.error("LocalStorage stock count read error:", e);
    }
    return 1;
  }

  try {
    const q = query(
      collection(db, "inventory_items"),
      where("vehicle", "==", vehicleName),
      where("variant", "==", variantName),
      where("color", "==", colorName),
      where("status", "==", "Available")
    );
    const snap = await getDocs(q);
    return snap.size;
  } catch (error) {
    console.error("Firestore live stock count query failed, falling back to 1:", error);
    return 1;
  }
}

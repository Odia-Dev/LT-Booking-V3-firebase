import { db, isConfigured } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export interface StockMovementLog {
  id?: string;
  vin: string;
  oldStatus: string;
  newStatus: string;
  user: string;
  reason: string;
  bookingId: string | null;
  timestamp: string;
}

export async function logStockMovement(
  vin: string,
  oldStatus: string,
  newStatus: string,
  user: string,
  reason: string,
  bookingId?: string
): Promise<void> {
  const logEntry = {
    vin,
    oldStatus,
    newStatus,
    user,
    reason,
    bookingId: bookingId || null,
    timestamp: new Date().toISOString(),
  };

  if (isConfigured) {
    try {
      await addDoc(collection(db, "inventoryMovements"), logEntry);
    } catch (error) {
      console.error("Error logging stock movement to Firestore:", error);
    }
  } else {
    try {
      const local = localStorage.getItem("lt_inventory_movements");
      const logs = local ? JSON.parse(local) : [];
      logs.push({ id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, ...logEntry });
      localStorage.setItem("lt_inventory_movements", JSON.stringify(logs));
    } catch (error) {
      console.error("Error logging stock movement to LocalStorage:", error);
    }
  }
}

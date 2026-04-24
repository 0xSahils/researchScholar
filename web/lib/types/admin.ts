export type OrderStatus =
  | "pending"
  | "in_progress"
  | "revision"
  | "delivered"
  | "completed"
  | "cancelled";

export type PaymentStatus = "paid" | "pending" | "partial" | "refunded";

export type ServiceType =
  | "Synopsis"
  | "Research Paper"
  | "Term Paper"
  | "Dissertation"
  | "Thesis"
  | "Scopus Publication";

export interface AdminOrder {
  id: string;
  orderNo: string;
  customerName: string;
  customerEmail: string;
  service: ServiceType;
  topic: string;
  deadline: string; // ISO date string
  createdAt: string; // ISO date string
  status: OrderStatus;
  price: number;
  paymentStatus: PaymentStatus;
  requirements?: string;
  notes?: string;
  deliveredFile?: string;
}

export interface AdminPayment {
  id: string;
  orderId: string;
  orderNo: string;
  customerName: string;
  amount: number;
  paidOn: string; // ISO date string
  method: "UPI" | "Card" | "Net Banking" | "Wallet";
  status: PaymentStatus;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  institution?: string;
  joinedAt: string; // ISO date string
  totalOrders: number;
  totalSpent: number;
  orderIds: string[];
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalEarnings: number;
  pendingPayments: number;
  totalCustomers: number;
}

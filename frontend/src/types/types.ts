export interface Account {
  id: string;
  name: string;
  balance: string;
  currency: string;
}

export interface TransferRequest {
  fromId: string;
  toId: string;
  amount: number;
  reference: string;
}

export interface JournalEntry {
  id: string;
  amount: number;
  account: {
    balance: number;
    currency: string;
    id: string;
    name: string;
  };
  type: "DEBIT" | "CREDIT";
  transactionReference: string;
  createdAt: string;
}

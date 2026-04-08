import { useEffect, useState } from "react";
import axios from "axios";
import {
  type Account,
  type TransferRequest,
  type JournalEntry,
} from "./types/types";
import { Landmark, Wallet, RefreshCcw } from "lucide-react";

const API_BASE = "http://localhost:8080/api/v1/ledger";

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<string>("");
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<JournalEntry[]>([]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Processing...");

    const payload: TransferRequest = {
      fromId: fromId,
      toId: toId,
      amount: parseFloat(amount),
      reference: "Web Transfer",
    };

    try {
      await axios.post(`${API_BASE}/transfer`, payload);
      setStatus("Success! Money moved.");
      setAmount("");
      loadData();
    } catch (err: any) {
      setStatus(`Error: ${err.response?.data?.message || "Transfer failed"}`);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [accRes, transRes] = await Promise.all([
        axios.get<Account[]>(`${API_BASE}/accounts`),
        axios.get<JournalEntry[]>(`${API_BASE}/transactions`),
      ]);
      setAccounts(accRes.data);
      setTransactions(transRes.data.slice(0, 5));
    } catch (err) {
      console.error("Backend unreachable. Is Spring Boot running?", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans'>
      <div className='max-w-4xl mx-auto'>
        <header className='flex justify-between items-center mb-12'>
          <h1 className='text-2xl font-bold tracking-tight uppercase'>
            Sentinel <span className='text-indigo-500'>Ledger</span>
          </h1>
          <button
            onClick={loadData}
            className='p-2 hover:bg-zinc-800 rounded-full transition'>
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {/* Dashboard */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className='bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-indigo-500/50 transition'>
              <div className='flex justify-between items-start mb-4'>
                <div className='p-2 bg-zinc-800 rounded-lg'>
                  {acc.name.includes("BANK") ? (
                    <Landmark className='text-indigo-400' />
                  ) : (
                    <Wallet className='text-emerald-400' />
                  )}
                </div>
                <span className='text-xs font-mono text-zinc-500 uppercase'>
                  {acc.currency}
                </span>
              </div>
              <h2 className='text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-1'>
                {acc.name}
              </h2>
              <p className='text-4xl font-bold tracking-tighter'>
                {new Intl.NumberFormat("en-GB").format(acc.balance)}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Transfer */}
        <section className='mt-12 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl'>
          <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
            <RefreshCcw size={20} className='text-indigo-500' /> Quick Transfer
          </h3>

          <form
            onSubmit={handleTransfer}
            className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <select
              className='bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none'
              onChange={(e) => setFromId(e.target.value)}
              required>
              <option value=''>Source Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>

            <select
              className='bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none'
              onChange={(e) => setToId(e.target.value)}
              required>
              <option value=''>Destination Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>

            <input
              type='number'
              placeholder='Amount'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='bg-zinc-800 border border-zinc-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none'
              required
            />

            <button
              type='submit'
              className='md:col-span-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98]'>
              Execute Transaction
            </button>
          </form>

          {status && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                status.includes("Error") ? "text-red-400" : "text-emerald-400"
              }`}>
              {status}
            </p>
          )}
        </section>

        {/* Transaction history */}
        <section className='mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl'>
          <div className='p-6 border-b border-zinc-800 bg-zinc-900/50'>
            <h3 className='text-lg font-bold'>Transaction History</h3>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='bg-zinc-800/50 text-zinc-400 uppercase text-[10px] tracking-widest'>
                <tr>
                  <th className='px-6 py-4'>Account ID</th>
                  <th className='px-6 py-4'>Type</th>
                  <th className='px-6 py-4 text-right'>Amount</th>
                  <th className='px-6 py-4'>Reference</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-800'>
                {transactions.map((t) => (
                  <tr key={t.id} className='hover:bg-zinc-800/30 transition'>
                    <td className='px-6 py-4 font-mono text-xs text-zinc-500'>
                      {t.account.id}
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          t.amount < 0
                            ? "bg-red-500/10 text-red-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                        {t.amount < 0 ? "DEBIT" : "CREDIT"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${
                        t.amount < 0 ? "text-red-400" : "text-emerald-400"
                      }`}>
                      {new Intl.NumberFormat("en-GB").format(t.amount)}
                    </td>
                    <td className='px-6 py-4 text-zinc-400'>
                      {t.transactionReference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

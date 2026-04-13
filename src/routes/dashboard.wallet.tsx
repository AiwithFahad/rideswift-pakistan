import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const Route = createFileRoute('/dashboard/wallet')({
  component: WalletPage,
});

function WalletPage() {
  const { currentUser, transactions, addMoney } = useAppStore();
  const [amount, setAmount] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  if (!currentUser) return null;

  const handleAdd = () => {
    const val = parseInt(amount);
    if (val > 0) { addMoney(val); setAmount(''); setShowAdd(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>

      {/* Balance card */}
      <div className="gradient-green rounded-2xl p-8 text-primary-foreground mb-8">
        <p className="text-sm opacity-80 mb-1">Available Balance</p>
        <p className="text-4xl font-bold">PKR {currentUser.walletBalance.toLocaleString()}</p>
        <Button variant="accent" size="sm" className="mt-4" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4" /> Add Money
        </Button>
      </div>

      {showAdd && (
        <div className="bg-card rounded-xl border border-border p-5 mb-6 flex gap-3">
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount (PKR)" className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <Button variant="hero" onClick={handleAdd}>Add</Button>
        </div>
      )}

      {/* Quick amounts */}
      <div className="flex gap-2 mb-8">
        {[500, 1000, 2000, 5000].map(a => (
          <button key={a} onClick={() => addMoney(a)} className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium transition-all">
            +PKR {a}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <h2 className="font-semibold mb-4">Transaction History</h2>
      <div className="space-y-2">
        {transactions.map(t => (
          <div key={t.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'credit' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                {t.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-primary" /> : <ArrowUpRight className="w-4 h-4 text-destructive" />}
              </div>
              <div>
                <p className="text-sm font-medium">{t.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <span className={`font-semibold text-sm ${t.type === 'credit' ? 'text-primary' : 'text-destructive'}`}>
              {t.type === 'credit' ? '+' : '-'}PKR {t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

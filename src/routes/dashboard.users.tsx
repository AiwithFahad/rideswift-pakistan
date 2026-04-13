import { createFileRoute } from '@tanstack/react-router';
import { User, Shield } from 'lucide-react';

export const Route = createFileRoute('/dashboard/users')({
  component: UsersPage,
});

function UsersPage() {
  const users = [
    { id: 'u1', name: 'Ahmed Khan', email: 'user@demo.com', role: 'user', status: 'Active' },
    { id: 'd1', name: 'Bilal Hussain', email: 'driver@demo.com', role: 'driver', status: 'Active' },
    { id: 'a1', name: 'Sara Admin', email: 'admin@demo.com', role: 'admin', status: 'Active' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-4 h-4 text-primary" /></div>
                    <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-md bg-secondary text-xs capitalize font-medium">{u.role}</span></td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

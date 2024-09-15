'use client'
import { useEffect, useState } from 'react';
import { Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { disconnectOAuth } from '../../action';
import { Card } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';



export default function ConnectedAcc() {

    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [oauthAccounts, setOauthAccounts] = useState<{ provider: string }[]>([]);
   

  useEffect(() => {
    const getUserData = async () => {
      if (!session) return;

      try {
        const data = await fetch('/api/user').then((res) => res.json());
        if (session?.user?.email !== data.userData.email) {
          redirect('/login');
        }

       
        setOauthAccounts(data.userData.oauthAccounts);
       
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, [session]);

  const handleDisconnectOAuth = async (provider: string) => {
    setLoading(true);
    try {
      disconnectOAuth(session?.user?.id as string, provider)      
      setOauthAccounts((prev) => prev.filter((acc) => acc.provider !== provider));
      toast.success('Account disconnected successfully');
    } catch (error) {
      toast.error('Error disconnecting OAuth');
      console.error('Error disconnecting OAuth:', error);
    } finally {
      setLoading(false);
    }
  }

    return (
        <Card className="mb-12 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <User className="mr-3 text-purple-600" /> Connected Accounts
        </h2>
        {oauthAccounts.length > 0 && (
          <div className="space-y-4">
            {oauthAccounts.map((account) => (
              <div
                key={account.provider}
                className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0"
              >
                <span className="text-gray-700">{account.provider}</span>
                <span className="text-gray-400 font-semibold md:ml-4">{session?.user?.email}</span>
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleDisconnectOAuth(account.provider)
                  }
                  disabled={oauthAccounts.length === 1 || loading}
                  className="mt-2 md:mt-0 md:ml-2"
                >
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
}
import { useWallet } from '../contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Auth = () => {
  const { publicKey, connect, disconnect } = useWallet();

  // Function to shorten the wallet address for display
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div>
      {publicKey ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Connected as:</span>
                <Badge variant="outline" className="font-mono">
                  {shortenAddress(publicKey)}
                </Badge>
              </div>
              <Button
                onClick={disconnect}
                variant="outline"
                className="w-full"
              >
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={connect}
          variant="default"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-secondary font-medium rounded-md"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default Auth; 
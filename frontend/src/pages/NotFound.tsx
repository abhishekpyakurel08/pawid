import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <EmptyState
        icon={<AlertTriangle className="w-10 h-10 text-amber-golden" />}
        title="404 — Page Not Found"
        description="The page or PawID resource you are looking for does not exist or has been moved."
        action={
          <Link to="/">
            <Button variant="primary" size="md" className="font-bold">
              Return to Home Page
            </Button>
          </Link>
        }
      />
    </div>
  );
}

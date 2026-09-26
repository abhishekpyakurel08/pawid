import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../lib/validation';
import { Logo } from '../components/common/Logo';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setErrorMsg('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 bg-white border border-forest-100 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <Logo size="lg" showTagline={true} />
          <h2 className="text-xl font-extrabold text-forest-900 pt-2">
            Admin & Volunteer Portal
          </h2>
          <p className="text-xs text-slate-500">
            Sign in with authorized credentials to manage community dogs and health records.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-bold border border-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@pawid.org"
            {...register('email')}
            error={errors.email?.message as string}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message as string}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-bold shadow"
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Protected JWT Authorization
          </p>
          <Link to="/" className="text-forest-900 font-bold hover:underline block mt-2">
            ← Return to Public Website
          </Link>
        </div>
      </Card>
    </div>
  );
}

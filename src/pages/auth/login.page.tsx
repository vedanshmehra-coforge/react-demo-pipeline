import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { FormField } from '@shared/components/form-fields/form-field';
import { ROUTES } from '@shared/constants/routes';
import { MOCK_USER } from '@shared/mock/mock-user';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(4, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((s) => s.setUser);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: 'admin', password: 'admin' },
  });

  const onSubmit = async (_values: LoginFormValues) => {
    // Mock login — no backend call yet
    setUser(MOCK_USER);
    navigate(from, { replace: true });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Sign in</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter any credentials to access the system.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          label="Username"
          htmlFor="username"
          error={errors.username?.message}
          required
        >
          <Input
            id="username"
            autoComplete="username"
            placeholder="e.g. admin"
            error={!!errors.username}
            {...register('username')}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="any password"
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <p className="text-xs text-gray-400">
          Demo: any username / password works
        </p>

        <Button type="submit" className="w-full mt-2" loading={isSubmitting}>
          Sign In
        </Button>
      </form>
    </div>
  );
};

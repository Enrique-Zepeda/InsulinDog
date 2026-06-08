import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearAuthFeedback } from "@/features/auth/slices/authSlice";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/schemas/forgotPasswordSchema";
import { forgotPassword } from "../thunks";

export function useForgotPasswordForm() {
  const dispatch = useAppDispatch();

  const { isLoading, error, successMessage } = useAppSelector((state) => state.auth);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    dispatch(clearAuthFeedback());

    try {
      await dispatch(forgotPassword(values)).unwrap();
      form.reset();
    } catch {
      // El error global ya viene desde Redux.
    }
  };

  return {
    form,
    isLoading,
    error,
    successMessage,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

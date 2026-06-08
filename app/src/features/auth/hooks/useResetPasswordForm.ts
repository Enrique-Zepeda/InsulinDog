import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearAuthFeedback } from "@/features/auth/slices/authSlice";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/features/auth/schemas/resetPasswordSchema";
import { resetPassword } from "../thunks";

export function useResetPasswordForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error, successMessage } = useAppSelector((state) => state.auth);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    dispatch(clearAuthFeedback());

    try {
      await dispatch(
        resetPassword({
          password: values.password,
        }),
      ).unwrap();

      form.reset();

      setTimeout(() => {
        navigate(PATHS.LOGIN);
      }, 1200);
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

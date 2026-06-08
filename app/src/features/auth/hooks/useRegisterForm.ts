import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearAuthFeedback } from "@/features/auth/slices/authSlice";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/registerSchema";
import { registerUser } from "../thunks";

export function useRegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error, successMessage } = useAppSelector((state) => state.auth);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    dispatch(clearAuthFeedback());

    try {
      const result = await dispatch(
        registerUser({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      ).unwrap();

      form.reset();

      if (result.hasSession) {
        navigate(PATHS.HOME);
      }
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

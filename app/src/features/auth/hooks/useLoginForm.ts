import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearAuthFeedback } from "@/features/auth/slices/authSlice";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/loginSchema";
import { loginUser } from "../thunks";

export function useLoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useAppSelector((state) => state.auth);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(clearAuthFeedback());

    try {
      const result = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        }),
      ).unwrap();

      if (result.hasSession) {
        form.reset();
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
    onSubmit: form.handleSubmit(onSubmit),
  };
}

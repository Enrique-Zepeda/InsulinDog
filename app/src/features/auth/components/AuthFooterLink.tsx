import { Link } from "react-router-dom";

type AuthFooterLinkProps = {
  text: string;
  linkText: string;
  to: string;
};

export function AuthFooterLink({ text, linkText, to }: AuthFooterLinkProps) {
  return (
    <p className="mt-6 text-center text-sm text-zinc-500">
      {text}{" "}
      <Link to={to} className="font-medium text-zinc-900">
        {linkText}
      </Link>
    </p>
  );
}

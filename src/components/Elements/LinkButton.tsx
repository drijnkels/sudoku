import Button from "@/components/Form/Button";
import Link from "next/link";
import React from "react";

type LinkButtonProps = {
  href: string;
  target?: '_self' | '_blank';
  variant?: 'primary' | 'secondary' | 'plain' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode
}

export default function LinkButton({href, target = '_self', variant = 'primary', fullWidth = true, children}: LinkButtonProps){
  return (
    <Link href={href} target={target} className={`${fullWidth ? 'w-full h-fit' : 'w-fit h-fit'}`}>
      <Button type='button' variant={variant}>{children}</Button>
    </Link>
  )
}
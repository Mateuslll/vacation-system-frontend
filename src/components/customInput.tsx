import { cn } from "@/lib/utils"
import { ComponentProps } from "react"

interface InputRootProps extends ComponentProps<"div"> {
  error?: boolean
}
export function InputRoot({ error = false, className, ...props }: InputRootProps) {
  return (
    <div
      data-error={error}
      className={cn(`group bg-gray-800 h-12 border border-gray-600 text-white rounded-xl px-4 flex items-center gap-2 focus-within:border-gray-100 data-[error=true]:border-danger `, className)}
      {...props}
    />
  )
}



export function InputField({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(`flex-1 outline-0 placeholder:text-white`, className)}
      {...props}
    />
  )
}
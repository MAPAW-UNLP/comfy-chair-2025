"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleGroupProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
  type?: "single"
}

interface ToggleGroupItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

const ToggleGroupContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <ToggleGroupContext.Provider value={{ value, onValueChange }}>
        <div
          ref={ref}
          className={cn("inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50", className)}
          role="group"
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroup.displayName = "ToggleGroup"

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext)
    if (!context) {
      throw new Error("ToggleGroupItem must be used within a ToggleGroup")
    }
    
    const { value: groupValue, onValueChange } = context
    const isSelected = groupValue === value

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
          "min-h-[44px] min-w-[80px]", // Mobile-friendly touch targets
          isSelected
            ? "bg-white text-gray-900 shadow-sm border border-gray-200"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/50",
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }
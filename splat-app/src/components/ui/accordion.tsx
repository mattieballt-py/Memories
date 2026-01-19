"use client"

import * as React from "react"

type AccordionContextValue = {
  type: "single" | "multiple"
  value: string | string[]
  onValueChange: (value: string) => void
  collapsible?: boolean
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)
const AccordionItemContext = React.createContext<string | null>(null)

interface AccordionProps {
  type: "single" | "multiple"
  collapsible?: boolean
  className?: string
  children: React.ReactNode
  defaultValue?: string
}

export function Accordion({ type, collapsible, className = "", children, defaultValue }: AccordionProps) {
  const [value, setValue] = React.useState<string | string[]>(
    type === "single" ? (defaultValue || "") : []
  )

  const onValueChange = (itemValue: string) => {
    if (type === "single") {
      setValue(value === itemValue && collapsible ? "" : itemValue)
    } else {
      const currentValues = value as string[]
      if (currentValues.includes(itemValue)) {
        setValue(currentValues.filter(v => v !== itemValue))
      } else {
        setValue([...currentValues, itemValue])
      }
    }
  }

  return (
    <AccordionContext.Provider value={{ type, value, onValueChange, collapsible }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function AccordionItem({ value, className = "", children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div data-state={value} className={className}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps {
  className?: string
  children: React.ReactNode
}

export function AccordionTrigger({ className = "", children }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  const itemElement = React.useContext(AccordionItemContext)

  if (!context || !itemElement) return null

  const isOpen = context.type === "single"
    ? context.value === itemElement
    : (context.value as string[]).includes(itemElement)

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between ${className}`}
      onClick={() => context.onValueChange(itemElement)}
    >
      {children}
      <svg
        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

interface AccordionContentProps {
  className?: string
  children: React.ReactNode
}

export function AccordionContent({ className = "", children }: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  const itemElement = React.useContext(AccordionItemContext)

  if (!context || !itemElement) return null

  const isOpen = context.type === "single"
    ? context.value === itemElement
    : (context.value as string[]).includes(itemElement)

  if (!isOpen) return null

  return (
    <div className={`overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

// Tremor Tooltip [v0.0.2]

import * as React from 'react'
import * as TooltipPrimitives from '@radix-ui/react-tooltip'
import Markdown from 'react-markdown'

import { cn } from '@/lib/utils'

interface TooltipProps {
  content: React.ReactNode | string
  children: React.ReactNode
  delayDuration?: number
  defaultOpen?: boolean
  open?: boolean
  onClick?: () => void
  onOpenChange?: (open: boolean) => void
  triggerAsChild?: boolean
  isMarkdownContent?: boolean
  withUnderline?: boolean
  side?: 'bottom' | 'left' | 'top' | 'right'
  showArrow?: boolean
  className?: string
}

type TooltipContentProps = Omit<
  TooltipProps,
  | 'content'
  | 'delayDuration'
  | 'defaultOpen'
  | 'open'
  | 'onClick'
  | 'onOpenChange'
  | 'triggerAsChild'
>

type TooltipProviderProps = Pick<
  TooltipProps,
  'open' | 'defaultOpen' | 'onOpenChange' | 'delayDuration' | 'children'
>

const TooltipProvider = TooltipPrimitives.Provider

const TooltipTrigger = TooltipPrimitives.Trigger

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitives.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitives.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-50 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitives.Content.displayName

/**
 * simply use this component if the tooltip content is simple
 * and doesn't need any additional configuration
 */
const Tooltip = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitives.Content>,
  TooltipProps
>(
  (
    {
      children,
      content,
      delayDuration,
      defaultOpen,
      open,
      onClick,
      onOpenChange,
      triggerAsChild = false,
      isMarkdownContent = false,
      withUnderline,
      className,
      ...props
    }: TooltipProps,
    forwardedRef
  ) => {
    return (
      <TooltipPrimitives.Root
        delayDuration={delayDuration}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        <TooltipTrigger onClick={onClick} asChild={triggerAsChild}>
          {withUnderline ? (
            <span className='underline decoration-zinc-600 decoration-dashed underline-offset-2'>
              {children}
            </span>
          ) : (
            children
          )}
        </TooltipTrigger>
        <TooltipContent ref={forwardedRef} className={className} {...props}>
          {isMarkdownContent ? (
            <Markdown
              components={{
                a: ({ children }) => (
                  <a className="text-emerald-400 hover:underline" target="_blank">
                    {children}
                  </a>
                )
              }}
            >
              {content as string}
            </Markdown>
          ) : (
            content
          )}
        </TooltipContent>
      </TooltipPrimitives.Root>
    )
  }
)

Tooltip.displayName = 'Tooltip'

export {
  Tooltip,
  TooltipContent,
  type TooltipProps,
  TooltipProvider,
  TooltipTrigger
}

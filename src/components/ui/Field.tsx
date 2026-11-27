import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/* ==========================================================================
   Form fields with label, hint and inline error wired up for assistive tech
   (aria-invalid + aria-describedby). Validation lives with the form; these
   components only render state. Errors aren't announced inline because the
   form's error summary announces them once.
   ========================================================================== */

const CONTROL =
  "block w-full rounded-field border-2 bg-white px-4 text-[1.0625rem] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-ink-faint hover:border-ink-faint focus:border-tide focus:shadow-[0_0_0_4px_rgb(27_106_100/0.16)] focus:outline-none";

function describe(id: string, hint?: ReactNode, error?: string) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return { hintId, errorId, describedBy: [errorId, hintId].filter(Boolean).join(" ") || undefined };
}

export function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-small font-bold text-error">
      <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

interface ShellProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
}

type TextFieldProps = ShellProps & Omit<ComponentProps<"input">, "className">;

export function TextField({ label, hint, error, optional, className, id: idProp, ...rest }: TextFieldProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const { hintId, errorId, describedBy } = describe(id, hint, error);
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-display text-[1.0625rem] font-semibold">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-faint">(optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="mt-1 text-small text-ink-faint">
          {hint}
        </p>
      )}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(CONTROL, "mt-2 h-13 min-h-[3.25rem]", error ? "border-error" : "border-line-strong/70")}
        {...rest}
      />
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}

type TextAreaProps = ShellProps & Omit<ComponentProps<"textarea">, "className"> & { count?: { value: number; max: number } };

export function TextArea({ label, hint, error, optional, className, id: idProp, count, ...rest }: TextAreaProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const { hintId, errorId, describedBy } = describe(id, hint, error);
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="block font-display text-[1.0625rem] font-semibold">
          {label}
          {optional && <span className="ml-1.5 font-normal text-ink-faint">(optional)</span>}
        </label>
        {count && (
          <span className={cn("text-tiny whitespace-nowrap", count.value > count.max ? "font-bold text-error" : "text-ink-faint")}>
            {count.value} / {count.max}
          </span>
        )}
      </div>
      {hint && (
        <p id={hintId} className="mt-1 text-small text-ink-faint">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(CONTROL, "mt-2 min-h-32 resize-y py-3 leading-relaxed", error ? "border-error" : "border-line-strong/70")}
        {...rest}
      />
      {error && <FieldError id={errorId} message={error} />}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Radio groups drawn as cards or pills. Native radios underneath, so arrow
   keys, labels and screen readers all behave as expected.
   -------------------------------------------------------------------------- */

export interface Choice {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  icon?: ReactNode;
}

export function ChoiceGroup({
  name,
  legend,
  hint,
  choices,
  value,
  onChange,
  error,
  variant = "card",
  columns = "sm:grid-cols-2",
  className,
  legendClassName,
  id,
}: {
  name: string;
  legend: ReactNode;
  hint?: ReactNode;
  choices: Choice[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  variant?: "card" | "pill";
  columns?: string;
  className?: string;
  legendClassName?: string;
  id?: string;
}) {
  const auto = useId();
  const base = id ?? auto;
  const { hintId, errorId, describedBy } = describe(base, hint, error);
  return (
    <fieldset id={base} className={className} aria-describedby={describedBy} tabIndex={-1}>
      <legend className={cn("font-display text-[1.0625rem] font-semibold", legendClassName)}>{legend}</legend>
      {hint && (
        <p id={hintId} className="mt-1 text-small text-ink-faint">
          {hint}
        </p>
      )}
      <div className={cn("mt-3 gap-3", variant === "pill" ? "flex flex-wrap" : cn("grid", columns))}>
        {choices.map((choice) => {
          const checked = value === choice.value;
          return (
            <label
              key={choice.value}
              data-ripple
              className={cn(
                "relative flex cursor-pointer items-center gap-3.5 border-2 bg-white transition-[border-color,background-color,box-shadow] duration-200 has-[:focus-visible]:shadow-[0_0_0_4px_rgb(27_106_100/0.22)]",
                variant === "card" ? "rounded-card px-4 py-3.5" : "min-h-12 rounded-full px-5 py-2.5",
                checked ? "border-tide bg-foam" : error ? "border-error/60 hover:border-error" : "border-line hover:border-ink-faint",
              )}
            >
              <input
                type="radio"
                name={name}
                value={choice.value}
                checked={checked}
                onChange={() => onChange(choice.value)}
                aria-invalid={error ? true : undefined}
                className="peer sr-only"
              />
              {choice.icon && (
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full transition-colors",
                    checked ? "bg-tide text-white" : "bg-seaglass text-tide",
                  )}
                >
                  {choice.icon}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[1.0625rem] leading-snug font-semibold">{choice.label}</span>
                {choice.description && <span className="block text-small text-ink-soft">{choice.description}</span>}
              </span>
              {choice.aside && <span className="shrink-0 text-right">{choice.aside}</span>}
              {variant === "card" && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors",
                    checked ? "border-tide bg-tide text-white" : "border-line-strong/60 bg-white text-transparent",
                  )}
                >
                  <Icon name="check" size={14} strokeWidth={3} />
                </span>
              )}
            </label>
          );
        })}
      </div>
      {error && <FieldError id={errorId} message={error} />}
    </fieldset>
  );
}

export function Checkbox({
  label,
  description,
  checked,
  onChange,
  className,
}: {
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors peer-focus-visible:shadow-[0_0_0_4px_rgb(27_106_100/0.22)]",
          checked ? "border-tide bg-tide text-white" : "border-line-strong bg-white text-transparent",
        )}
      >
        <Icon name="check" size={15} strokeWidth={3} />
      </span>
      <span>
        <span className="block font-display text-[1.0625rem] font-semibold">{label}</span>
        {description && <span className="block text-small text-ink-soft">{description}</span>}
      </span>
    </label>
  );
}

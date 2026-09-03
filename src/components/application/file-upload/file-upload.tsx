"use client";

import * as React from "react";
import { FileIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/base/buttons/button";
import { Progress } from "@/components/application/progress/progress";

export type FileUploadVariant = "dropzone" | "button";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  /** 0–100. Renders a progress bar while below 100. */
  progress?: number;
  error?: string;
}

export interface FileUploadProps {
  variant?: FileUploadVariant;
  /** Mirrors the native `accept` attribute, e.g. `"image/*,.pdf"`. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Maximum size per file, in bytes. Oversized files are rejected. */
  maxSize?: number;
  onFilesSelected?: (files: File[]) => void;
  onFileRemove?: (id: string) => void;
  /** Files to list under the control — drive this from your upload state. */
  files?: UploadedFile[];
  hint?: React.ReactNode;
  label?: string;
  className?: string;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  variant = "dropzone",
  accept,
  multiple = false,
  disabled = false,
  maxSize,
  onFilesSelected,
  onFileRemove,
  files = [],
  hint,
  label,
  className,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [rejected, setRejected] = React.useState<string | null>(null);

  const accept_ = accept;

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);

    const tooLarge = maxSize
      ? incoming.filter((file) => file.size > maxSize)
      : [];
    const accepted = maxSize
      ? incoming.filter((file) => file.size <= maxSize)
      : incoming;

    setRejected(
      tooLarge.length > 0
        ? `${tooLarge.map((f) => f.name).join(", ")} exceeds the ${formatFileSize(maxSize!)} limit.`
        : null,
    );

    if (accepted.length > 0) onFilesSelected?.(accepted);
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept_}
      multiple={multiple}
      disabled={disabled}
      className="sr-only"
      onChange={(event) => {
        handleFiles(event.target.files);
        // Reset so picking the same file twice still fires a change event.
        event.target.value = "";
      }}
    />
  );

  const fileList = (files.length > 0 || rejected) && (
    <div className="flex flex-col gap-2">
      {rejected && (
        <p role="alert" className="text-sm text-fg-error">
          {rejected}
        </p>
      )}

      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border bg-bg-primary p-3.5",
            file.error ? "border-border-error" : "border-border-primary",
          )}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-bg-secondary text-fg-tertiary">
            <FileIcon className="size-4" />
          </span>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-sm font-medium text-fg-primary">
              {file.name}
            </p>
            <p
              className={cn(
                "text-xs",
                file.error ? "text-fg-error" : "text-fg-tertiary",
              )}
            >
              {file.error ?? formatFileSize(file.size)}
            </p>
            {file.progress !== undefined && file.progress < 100 && !file.error && (
              <Progress value={file.progress} size="sm" className="mt-1" />
            )}
          </div>

          {onFileRemove && (
            <button
              type="button"
              onClick={() => onFileRemove(file.id)}
              aria-label={`Remove ${file.name}`}
              className={cn(
                "grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-fg-tertiary transition-colors",
                "hover:bg-bg-secondary hover:text-fg-error",
                "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
              )}
            >
              <Trash2Icon className="size-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  if (variant === "button") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {label && (
          <span className="text-sm font-medium text-fg-secondary">{label}</span>
        )}
        <div className="flex items-center gap-3">
          {hiddenInput}
          <Button
            variant="secondary"
            onClick={openPicker}
            disabled={disabled}
            iconLeading={<UploadCloudIcon />}
          >
            Upload {multiple ? "files" : "file"}
          </Button>
          {hint && <span className="text-sm text-fg-tertiary">{hint}</span>}
        </div>
        {fileList}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && (
        <span className="text-sm font-medium text-fg-secondary">{label}</span>
      )}

      {hiddenInput}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-label={label ?? "Upload files"}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled) handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
          "focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none",
          isDragging
            ? "border-border-brand bg-bg-brand"
            : "border-border-primary bg-bg-primary hover:border-border-brand hover:bg-bg-secondary",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <span className="grid size-10 place-items-center rounded-full border border-border-secondary bg-bg-secondary text-fg-tertiary">
          <UploadCloudIcon className="size-5" />
        </span>

        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-fg-secondary">
            <span className="font-semibold text-fg-brand">Click to upload</span>{" "}
            or drag and drop
          </p>
          {hint && <p className="text-xs text-fg-tertiary">{hint}</p>}
        </div>
      </div>

      {fileList}
    </div>
  );
}

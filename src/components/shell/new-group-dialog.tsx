"use client";

import * as React from "react";

import { Button, Input, Modal, ModalClose } from "@/components";
import { WandIcon } from "@/components/auth/auth-primitives";

/*
 * New-group dialog from the WizKraft Figma left menu (file
 * DTfOUMmRzfz8munYZnMkr7, node 32:4556): a 600px panel on the pill ground with
 * a single required field and a Cancel / Create group pair.
 */
export function NewGroupDialog({
  open,
  onOpenChange,
  existingNames,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Used to reject a duplicate before it is created. */
  existingNames: string[];
  onCreate: (name: string) => void;
}) {
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const close = (next: boolean) => {
    if (!next) {
      setName("");
      setError(null);
    }
    onOpenChange(next);
  };

  const submit = () => {
    const value = name.trim();
    if (!value) {
      setError("Give the group a name");
      return;
    }
    if (existingNames.some((n) => n.toLowerCase() === value.toLowerCase())) {
      setError("A group with that name already exists");
      return;
    }
    onCreate(value);
    close(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={close}
      size="lg"
      title="New Group"
      className="bg-sidebar"
      footer={
        <>
          <ModalClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </ModalClose>
          <Button type="submit" form="new-group-form" iconLeading={<WandIcon />}>
            Create group
          </Button>
        </>
      }
    >
      <form
        id="new-group-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Input
          label="Group name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. Internal tools"
          autoFocus
          isInvalid={Boolean(error)}
          errorMessage={error ?? undefined}
        />
      </form>
    </Modal>
  );
}

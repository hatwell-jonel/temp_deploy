"use client";

import * as React from "react";

type DialogContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DialogContext = React.createContext<DialogContextType>({
  open: false,
  setOpen: () => {},
});

function useDialog() {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error("Dialog must be used within Dialog Provider");
  }
  return context;
}

export { DialogContext, useDialog };

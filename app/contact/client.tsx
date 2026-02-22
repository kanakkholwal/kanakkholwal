"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";




export function BookACallForm() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "book-a-call" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <Cal
      namespace="book-a-call"
      calLink="kanakkholwal/book-a-call"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{
        theme: resolvedTheme === "dark" ? "dark" : "light",
        layout: "month_view",
      }}
    />
  );
}

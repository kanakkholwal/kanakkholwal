import Cal, { getCalApi } from "@calcom/embed-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const NAMESPACE = "book-a-call";

export default function BookACallForm() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    getCalApi({ namespace: NAMESPACE }).then((cal) => {
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    });
  }, []);

  return (
    <Cal
      namespace={NAMESPACE}
      calLink="kanakkholwal/book-a-call"
      className="size-full overflow-auto"
      config={{ theme: resolvedTheme === "dark" ? "dark" : "light", layout: "month_view" }}
    />
  );
}

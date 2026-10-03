import { StatusFrame } from "@/components/extras/status-frame";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/site/link";

export default function NotFound() {
  return (
    <StatusFrame
      code="404."
      actions={
        <>
          <ButtonLink href="/" variant="dark">
            <Icon name="home" />
            Home
          </ButtonLink>
          <ButtonLink href="/projects" variant="outline">
            <Icon name="rocket" />
            Projects
          </ButtonLink>
        </>
      }
    >
      <p>This page doesn't exist, or it moved somewhere I forgot to point to.</p>
    </StatusFrame>
  );
}

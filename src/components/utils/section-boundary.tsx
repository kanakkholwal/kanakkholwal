import { Component, type ErrorInfo, type ReactNode } from "react";
import type { IconType } from "@/components/icons";
import { type EmptyGhost, StatsEmpty } from "@/components/stats/stats-empty";

type Props = { name: string; icon: IconType; ghost?: EmptyGhost; children: ReactNode };
type State = { failed: boolean };

/** Isolates one section: a third-party or async failure shows an empty state there, not a crashed page. */
export class SectionBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[section:${this.props.name}]`, error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const { name, icon, ghost } = this.props;
    return (
      <StatsEmpty
        icon={icon}
        ghost={ghost}
        title={`${name} couldn't load`}
        description="Something went wrong on this section only. The rest of the page is fine."
        retry={() => this.setState({ failed: false })}
      />
    );
  }
}

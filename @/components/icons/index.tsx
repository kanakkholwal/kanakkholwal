import { cn } from "@/lib/utils";
import { FaEdge, FaFirefoxBrowser, FaSafari } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiCaldotcom } from "react-icons/si";

import { DownloadCloud } from "lucide-react";
import { BsStars } from "react-icons/bs";
import {
  PiArrowClockwiseDuotone,
  PiArrowCounterClockwiseDuotone,
  PiArrowLeftDuotone,
  PiArrowRightDuotone,
  PiArrowUpDuotone,
  PiArrowUpRightDuotone,
  PiArticleDuotone,
  PiBookOpenDuotone,
  PiBookmarkSimpleDuotone,
  PiBrowserDuotone,
  PiCalendarBlankDuotone,
  PiCalendarDuotone,
  PiCameraDuotone,
  PiChartBarDuotone,
  PiChartLineUpDuotone,
  PiCheckBold, // Best fit for candlestick
  PiCheckCircleDuotone, // Best fit for copy-check
  PiCircleDuotone, // Fit for Dot/Circle
  PiCircleNotchDuotone, // Fit for loader
  PiClipboardTextDuotone,
  PiClockAfternoonDuotone,
  PiCodeDuotone,
  PiCommandDuotone,
  PiConfettiDuotone,
  PiCopyDuotone,
  PiCpuDuotone,
  PiDeviceMobileDuotone,
  PiDevicesDuotone,
  PiDotsThreeVerticalDuotone,
  PiEyeDuotone,
  PiFacebookLogoDuotone,
  PiFileDocDuotone,
  PiFolderOpenDuotone,
  PiGameControllerDuotone,
  PiGithubLogoDuotone,
  PiGlobeDuotone,
  PiGoogleChromeLogoDuotone,
  PiGoogleLogoDuotone,
  PiHeartDuotone,
  PiInfinityDuotone,
  PiInstagramLogoDuotone,
  PiLayoutDuotone,
  PiLightningDuotone,
  PiLinkedinLogoDuotone,
  PiListDuotone, // For TOC
  PiLockKeyDuotone,
  PiMagnifyingGlassDuotone,
  PiMailboxDuotone,
  PiMediumLogoDuotone,
  PiMicrophoneStageDuotone, // For Podcast
  PiMonitorDuotone,
  PiMoonDuotone,
  PiPackageDuotone,
  PiPaletteDuotone,
  PiPaperPlaneRightDuotone, // For Send/Share
  PiPencilSimpleDuotone,
  PiPhoneDuotone,
  PiPlusCircleDuotone,
  PiPlusDuotone,
  PiPushPinDuotone,
  PiPushPinSlashDuotone,
  PiQuestionDuotone,
  PiRocketLaunchDuotone,
  PiScrollDuotone, // Fit for History/Experiences
  PiShareNetworkDuotone, // Fit for Share
  PiShieldCheckDuotone,
  PiSlidersHorizontalDuotone,
  PiSparkleDuotone,
  PiSunDuotone,
  PiTerminalWindowDuotone,
  PiTextAlignLeftDuotone,
  PiTrashDuotone,
  PiTrendUpDuotone,
  PiTwitterLogoDuotone,
  PiUserSoundDuotone,
  PiUsersDuotone,
  PiWarningCircleDuotone,
  PiWaveTriangleDuotone,
  PiXDuotone,
  PiXLogoDuotone, // For New Twitter (X)
  PiYoutubeLogoDuotone,
} from "react-icons/pi";
import { GiBubbles } from "react-icons/gi";
import z from "zod";

export const IconComponentCollection = {
  // --- General UI ---
  activity: PiWaveTriangleDuotone,
  barchart: PiChartBarDuotone,
  book: PiBookOpenDuotone,
  trash: PiTrashDuotone,
  calendar: PiCalendarBlankDuotone,
  sparkles: PiSparkleDuotone,
  code: PiCodeDuotone,
  dot: PiCircleDuotone,
  eye: PiEyeDuotone,
  camera: PiCameraDuotone,
  gamepad2: PiGameControllerDuotone,
  palette: PiPaletteDuotone,
  zap: PiLightningDuotone,
  cpu: PiCpuDuotone,
  globe: PiGlobeDuotone,
  share: PiShareNetworkDuotone,
  lock: PiLockKeyDuotone,
  pencil: PiPencilSimpleDuotone,
  command: PiCommandDuotone,
  search: PiMagnifyingGlassDuotone,
  pin: PiPushPinDuotone,
  "pin-off": PiPushPinSlashDuotone,
  "trend-up": PiTrendUpDuotone,
  X: PiXDuotone,
  "align-left": PiTextAlignLeftDuotone,
  toc: PiListDuotone,
  "chart-bar-big": PiChartBarDuotone,
  "chart-candlestick": PiChartLineUpDuotone,
  "ellipsis-vertical": PiDotsThreeVerticalDuotone,
  layout: PiLayoutDuotone,
  default: PiLayoutDuotone,
  unknown: PiQuestionDuotone,
  "sliders-horizontal": PiSlidersHorizontalDuotone,
  "circle-check": PiCheckCircleDuotone,
  "rotate-ccw": PiArrowCounterClockwiseDuotone,
  "rotate-cw": PiArrowClockwiseDuotone,
  "check:bold": PiCheckBold,
  "person-speaking": PiUserSoundDuotone,
  infinity: PiInfinityDuotone,
  list: PiListDuotone,

  // --- Content & Media ---
  articles: PiArticleDuotone,
  experiences: PiScrollDuotone, // Represents history/scroll
  podcast: PiMicrophoneStageDuotone,
  heart: PiHeartDuotone,
  "heart-empty": PiHeartDuotone, // Phosphor Duotone style is consistent
  "folder-open": PiFolderOpenDuotone,
  // --- Devices & Browsers ---
  safari: FaSafari, // No Phosphor equivalent
  chrome: PiGoogleChromeLogoDuotone,
  firefox: FaFirefoxBrowser, // No Phosphor equivalent
  edge: FaEdge, // No Phosphor equivalent
  browser: PiBrowserDuotone,
  monitor: PiMonitorDuotone,
  smartphone: PiDeviceMobileDuotone,
  "monitor-smartphone": PiDevicesDuotone,
  website: PiGlobeDuotone,
  clock: PiClockAfternoonDuotone,

  // --- Actions ---
  copy: PiCopyDuotone,
  plus: PiPlusDuotone,
  rocket: PiRocketLaunchDuotone,
  plus_circle: PiPlusCircleDuotone,
  "copy-check": PiClipboardTextDuotone, // Closer metaphor for "copied text"
  send: PiPaperPlaneRightDuotone,
  bookmark: PiBookmarkSimpleDuotone,
  "bookmark-check": PiCheckCircleDuotone,
  "cal.com": SiCaldotcom,
  cal: PiCalendarDuotone,

  // --- Social & Communication ---
  facebook: PiFacebookLogoDuotone,
  youtube: PiYoutubeLogoDuotone,
  github: PiGithubLogoDuotone,
  instagram: PiInstagramLogoDuotone,
  linkedin: PiLinkedinLogoDuotone,
  mail: PiMailboxDuotone,
  phone: PiPhoneDuotone,
  shield: PiShieldCheckDuotone,
  terminal: PiTerminalWindowDuotone,
  twitter: PiXLogoDuotone,
  medium: PiMediumLogoDuotone,
  "twitter-bird": PiTwitterLogoDuotone,
  google: PiGoogleLogoDuotone,
  "google:colored": FcGoogle,
  package: PiPackageDuotone,
  users: PiUsersDuotone,
  docs: PiFileDocDuotone,
  // --- Navigation & Status ---
  "arrow-up-right": PiArrowUpRightDuotone,
  "arrow-right": PiArrowRightDuotone,
  "arrow-left": PiArrowLeftDuotone,
  "arrow-up": PiArrowUpDuotone,
  "loader-circle": PiCircleNotchDuotone,
  "alert-circle": PiWarningCircleDuotone,
  download: DownloadCloud,
  // bodies
  moon: PiMoonDuotone,
  sun: PiSunDuotone,
  stars: PiSparkleDuotone,
  "stars:bs": BsStars,
  bubbles: GiBubbles,
  confetti: PiConfettiDuotone,
} as const;
export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export type IconNode = React.ReactElement<React.SVGProps<SVGSVGElement>>;

export type IconComponentType = {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
export type IconType = keyof typeof IconComponentCollection;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconType;
  className?: string;
}

export const iconZodSchema = z.enum(Object.keys(IconComponentCollection));

export function Icon({
  name,
  className,
}: IconProps): React.ReactElement | null {
  const Icon = IconComponentCollection[name];
  if (!Icon) {
    return null;
  }
  return <Icon className={cn("inline-block", className)} />;
}

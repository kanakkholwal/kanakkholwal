import { cn } from "@/lib/utils";
import {
  FaEdge,
  FaFirefoxBrowser,
  FaSafari,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
  PiCameraDuotone,
  PiChartBarDuotone,
  PiChartLineUpDuotone, PiCheckBold, // Best fit for candlestick
  PiCheckCircleDuotone, // Best fit for copy-check
  PiCircleDuotone, // Fit for Dot/Circle
  PiCircleNotchDuotone, // Fit for loader
  PiClipboardTextDuotone,
  PiClockAfternoonDuotone,
  PiCodeDuotone,
  PiCommandDuotone,
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
  PiYoutubeLogoDuotone
} from "react-icons/pi";

export type IconComponentType = {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const IconComponent = {
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
  "infinity": PiInfinityDuotone,
  "list": PiListDuotone,

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
  "google": PiGoogleLogoDuotone,
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

  // bodies
  moon: PiMoonDuotone,
  sun: PiSunDuotone

} as const;

export type IconType = keyof typeof IconComponent;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconType;
  className?: string;
}

export function Icon({
  name,
  className,
}: IconProps): React.ReactElement | null {
  const Icon = IconComponent[name];
  if (!Icon) {
    return null;
  }
  return <Icon className={cn("inline-block", className)} />;
}
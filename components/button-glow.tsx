import { GlowEffect } from "@/components/motion-primitives/glow-effect";
import { ArrowRight } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";

type GlowEffectButtonProps = {
  name: string;
  icon: IconName;
};

export function GlowEffectButton({ name, icon }: GlowEffectButtonProps) {
  return (
    <div className="relative">
      <GlowEffect
        colors={["#720E9E", "#9E0E86", "#B833FF", "#33FFE0"]}
        mode="colorShift"
        blur="soft"
        duration={3}
        scale={0.9}
      />
      <button className="relative inline-flex items-center gap-1 rounded-4xl bg-foreground px-4 py-2 text-sm text-zinc-50 outline outline-1 outline-[#fff2f21f]">
        <DynamicIcon name={icon} className="m-auto size-5" />
        {name}
      </button>
    </div>
  );
}

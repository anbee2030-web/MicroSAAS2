import { StudioFrame } from "@/components/studio/studio-frame";
import { StudioProvider } from "@/components/studio/studio-provider";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider>
      <StudioFrame>{children}</StudioFrame>
    </StudioProvider>
  );
}

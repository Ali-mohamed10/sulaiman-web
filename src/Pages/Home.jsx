import LandingPage from "../common/LandingPage";
import OurTools from "../common/OurTools";
import CtaSection from "../common/CtaSection";
export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <LandingPage />
      <OurTools />
      <CtaSection />
    </div>
  );
}

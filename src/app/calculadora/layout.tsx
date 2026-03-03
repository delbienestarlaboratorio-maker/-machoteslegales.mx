import AdBannerWrapper from '@/components/ads/AdBannerWrapper';
import FAQSection from '@/components/FAQSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import TrustBadges from '@/components/TrustBadges';
import ContactLawyerCTA from '@/components/abogados/ContactLawyerCTA';

export default function CalculadorasLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
                <div className="max-w-3xl mx-auto">
                    <TrustBadges />
                </div>

                {/* Ad en medio de la página de calculadora */}
                <div className="mt-8">
                    <AdBannerWrapper format="horizontal" />
                </div>

                <TestimonialsSection />

                <section className="mt-8">
                    <ContactLawyerCTA />
                </section>

                <FAQSection />

                {/* Ad al final de la página */}
                <div className="mt-8">
                    <AdBannerWrapper format="horizontal" />
                </div>
            </div>
        </>
    );
}

import Image from 'next/image';
import Link from 'next/link';

export default function CurrentFocus() {
  return (
    <section className="bg-gray-50 px-8">
      <h1 className="text-4xl font-bold mb-12 text-center text-green-700">
        OUR CURRENT FOCUS
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="relative w-full h-56">
            <Image
              src="/images/Mentoring01-2.webp"
              alt="Students participating in STEM and educational opportunities"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              priority
            />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-orange-600 mb-3">
              Educational Opportunities
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Evergreen Education Foundation supports STEM education and
              literacy in rural China through partnerships with organizations
              such as Li Geng Sheng and Peking University. Programs include the
              Future City competition, STEM challenges, rural household book
              corners, and summer robotics workshops. Our efforts enhance
              learning opportunities for students and teachers while fostering
              innovation, problem-solving, and literacy development.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="relative w-full h-56">
            <Image
              src="/images/FamilyStory01-3.webp"
              alt="Family Story Initiative preserving family legacies"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-orange-600 mb-3">
              Family Story Initiative
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Evergreen Family Story Initiative aims to preserve family
              legacies and strengthen inter-generational bonds by connecting
              students and young adults with their elders through recorded
              interviews. Personal stories, family histories, and cultural
              traditions are captured while ensuring privacy and long-term
              preservation — fostering storytelling as a living, evolving legacy
              for future generations. Click
              <Link className="text-orange-700 underline" href="/oral-history">
                {' '}
                here
              </Link>{' '}
              to learn more.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <div className="relative w-full h-56">
            <Image
              src="/images/EarlyChildhook01-2.webp"
              alt="Young children participating in early childhood programs"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-orange-600 mb-3">
              0–6 Early Childhood Project
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Evergreen Education Foundation funds parenting and play centers in
              Yunnan, China, to enhance early learning for rural children (ages
              0–6). The project supports local parenting centers, trains village
              teachers, and establishes parents’ committees to plan and conduct
              development programs that strengthen community-based education.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

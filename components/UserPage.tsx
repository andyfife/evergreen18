import Image from 'next/image';
import Link from 'next/link';

export default function CurrentFocus() {
  return (
    <section className="bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-bold mb-12 text-center text-orange-600">
        USER PAGE
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        <div className="relative w-full h-56">
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
      </div>
    </section>
  );
}

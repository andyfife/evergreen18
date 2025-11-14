import UserCTA from '@/components/UserCTA';
import { Suspense } from 'react';
export default async function Page() {
  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <section>
        <h1 className="text-4xl text-orange-400 font-bold mb-6">Get Started</h1>

        <h2 className="text-2xl font-semibold mb-4">
          Preparation Process: Check List
        </h2>

        <div className="space-y-6">
          {/* Preparation Steps */}
          <div>
            <div className="ml-6 text-gray-700 leading-relaxed bg-blue-50 p-4 rounded">
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Select a family member to interview:</strong> Explain
                  the purpose of the interview and obtain his/her consent.
                </li>
                <li>
                  <strong>Master the Recording Equipment:</strong> Practice
                  using the audio/video recording devices to ensure smooth
                  operation during the interview.
                </li>
                <li>
                  <strong>Plan the Interview Location:</strong> Choose a quiet
                  setting with minimal background noise, check acoustics, and
                  ensure you have access to electrical outlets if needed.
                </li>
              </ul>
            </div>
          </div>

          {/* Interview Process */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Interview Process</h3>
            <div className="ml-6 text-gray-700 leading-relaxed bg-blue-50 p-4 rounded space-y-4">
              <div>
                <strong>Pre-Interview Meeting:</strong> This meeting is a chance
                to explain the project, address any questions, and discuss the
                highlights of their life that they would like to share. You will
                also reassure them that they have full control over who has
                access to the interview.
              </div>

              <div>
                <strong>The Interview: Recording Introduction:</strong> Start
                every interview with a recorded introduction: “This is [your
                name] interviewing [narrator’s name] for the EEF Family Stories
                Project. Today is [date] and we are [location]. This interview
                is being recorded using a [name/model of recorder]. Shall we
                begin?”
              </div>

              <div>
                <strong>Use Questions as a Guide:</strong>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  <li>
                    <em>Factual:</em> “Where were you born? What year did you
                    come to California?”
                  </li>
                  <li>
                    <em>Descriptive:</em> “Describe your living quarters in the
                    refugee camp.”
                  </li>
                  <li>
                    <em>Reflective:</em> “Looking back on your career, how do
                    you feel about your influence on students?”
                  </li>
                  <li>
                    <em>Follow-Up:</em> “Could you elaborate more on your
                    grandmother’s garden?”
                  </li>
                  <li>
                    <em>Two Sentence Question:</em> “You mentioned that your
                    sister contracted polio. How did her illness affect your
                    family?”
                  </li>
                </ul>
              </div>

              <div>
                <strong>Respect Boundaries:</strong> If the interviewee is
                uncomfortable with a topic, don’t press. Keep the space
                respectful and sensitive to emotional or physical needs.
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <Suspense
            fallback={
              <div className="ml-6 text-gray-700 leading-relaxed bg-blue-50 p-4 rounded">
                {/* small skeleton or placeholder */}
                <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-64 bg-gray-200 rounded" />
              </div>
            }
          >
            <UserCTA />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

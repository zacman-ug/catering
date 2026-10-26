import { useCallback, useState } from 'react';
import Hero from '../components/ui/Hero.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import CourseCard from '../components/ui/CourseCard.jsx';
import EnrollmentForm from '../components/forms/EnrollmentForm.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { useApi, useFormSubmit } from '../hooks/useApi.js';
import { api } from '../services/api.js';
import { scrollToSectionWhenReady } from '../utils/scrollToSection.js';

export default function SchoolPage() {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const fetchCourses = useCallback(() => api.getCoursesAvailability(), []);
  const { data: courses, loading } = useApi(fetchCourses);
  const { submit, loading: submitting, success, error } = useFormSubmit(api.createEnrollment);

  return (
    <>
      <Hero
        title="Godwin Cooking School"
        subtitle="Hands-on culinary training from Chef Godwin Marvin. Learn professional techniques, food safety, and large-scale catering skills."
        ctaLabel="Enroll Now"
        ctaLink="/school#enroll-form"
      />

      <section id="courses" className="scroll-target py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Available Courses"
            subtitle="Regular intakes throughout the year. Limited seats per class for personalized attention."
          />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(courses || []).map((c) => (
                <CourseCard
                  key={c.id}
                  title={c.title}
                  description={c.description}
                  duration={c.duration}
                  level={c.level}
                  priceUgx={c.price_ugx}
                  seatsRemaining={c.seats_remaining}
                  startDate={c.start_date}
                  onEnroll={() => {
                    setSelectedCourseId(c.id);
                    scrollToSectionWhenReady('enroll-form');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="enroll-form" className="scroll-target py-16 md:py-20 section-band-warm">
        <div className="max-w-xl mx-auto px-4">
          <SectionHeading title="Enroll Now" subtitle="Fill in your details and we'll get back to you with intake dates." />
          <div className="surface-card p-6 md:p-8">
            <EnrollmentForm
              courses={courses || []}
              preselectedCourseId={selectedCourseId}
              onSubmit={submit}
              loading={submitting}
              success={success}
              error={error}
            />
          </div>
        </div>
      </section>
    </>
  );
}

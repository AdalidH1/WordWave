import { FeedWrapper } from '@/components/feed-wrapper'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { Header } from './header'
import { UserProgress } from '@/components/user-progress'
import { redirect } from "next/navigation";
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress, getUserSubscription } from '../../../../db/queries';
import { Unit } from './unit';
import { lessons, units as unitsSchema } from '../../../../db/schema'
import { Promo } from '@/components/promo';
import { Quests } from '@/components/quests';

const DashboardPage = async () => {
  const userProgressData = getUserProgress()
  const unitsData = getUnits()
  const courseProgressData = getCourseProgress()
  const lessonPercentageData = getLessonPercentage()
  const userSubsriptionData = getUserSubscription()

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubsription
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubsriptionData
  ])

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses")
  }

  if (!courseProgress) {
    redirect("/courses")
  }

  const isPro = !!userSubsription?.isActive

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress 
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts} 
          points={userProgress.points}
          hasActiveSubscription={isPro} />
          {!isPro && (
            <Promo />
          )}
          <Quests 
            points={userProgress.points}
          />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className='mb-10'>
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress.activeLesson as
                | (typeof lessons.$inferSelect & {
                    unit: typeof unitsSchema.$inferSelect;
                  })
                | undefined}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}

export default DashboardPage
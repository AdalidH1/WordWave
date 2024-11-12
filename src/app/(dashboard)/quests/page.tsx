import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "../../../../db/queries";
import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Promo } from "@/components/promo";
import { quests } from "../../../../constants";


const QuestsPage = async () => {

    const userProgressData = getUserProgress()
    const userSubsriptionData = getUserSubscription()


    const [
        userProgress,
        userSubsription,
    ] = await Promise.all([
        userProgressData,
        userSubsriptionData,
    ])

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses")
    }

    const isPro = !!userSubsription?.isActive
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={isPro}
                />
                {!isPro && (
                    <Promo />
                )}
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image
                        src={"/target.svg"}
                        alt="target"
                        height={90}
                        width={90}
                    />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Quests
                    </h1>
                    <p className="text-gray-500 text-center text-lg mb-6">
                        Complete quests by earning points.
                    </p>
                    <ul className=" w-full">
                        {quests.map((quest) => {
                            const progress = (userProgress.points / quest.value) * 100

                            return (
                                <div
                                    className="flex items-center w-full p-4 gap-x-4"
                                    key={quest.title}
                                >
                                    <Image
                                        src={"/thunder.svg"}
                                        alt="points"
                                        width={60}
                                        height={60}
                                    />
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <p className="text-slate-700 text-xl font-bold">
                                            {quest.title}
                                        </p>
                                        <Progress value={progress} className="h-3" />
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </FeedWrapper>
        </div>
    );
}

export default QuestsPage;
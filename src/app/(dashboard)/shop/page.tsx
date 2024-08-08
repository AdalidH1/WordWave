import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "../../../../db/queries";
import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import Image from "next/image";
import { Items } from "./items";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const ShopPage = async () => {

    const userProgressData = getUserProgress()
    const userSubsriptionData = getUserSubscription()
    const [
        userProgress,
        userSubsription
    ] = await Promise.all([
        userProgressData,
        userSubsriptionData
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
                <Quests points={userProgress.points} />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image 
                     src={"/shop.svg"}
                     alt="Shop"
                     height={90}
                     width={90}
                    />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Shop
                    </h1>
                    <p className="text-gray-500 text-center text-lg mb-6">
                        Spend your points on cool stuff.
                    </p>
                    <Items 
                     hearts={userProgress.hearts}
                     points={userProgress.points}
                     hasActiveSubscription={!!userSubsription?.isActive}
                    />
                </div>
            </FeedWrapper>
        </div>
     );
}
 
export default ShopPage;
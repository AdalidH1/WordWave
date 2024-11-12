"use server"

import {auth, currentUser} from "@clerk/nextjs/server"
import { stripe } from "@/libs/stripe";
import { absoluteUrl } from "@/libs/utils";
import { getUserSubscription } from "../db/queries";

const returnUrl = absoluteUrl("/shop")

export const createStripeUrl = async () => {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user ) throw new Error("Unauthorized")

    const userSubscription = await getUserSubscription()

    if (userSubscription && userSubscription.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: returnUrl
        })

        return {
            data: stripeSession.url
        }
    }
    const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "MXN",
                    product_data: {
                        name: "Wordwave VIP",
                        description: "Unlimited hearts"
                    },
                    unit_amount: 20000,
                    recurring: {
                        interval: "month"
                    }
                }
            }
        ],
        metadata: {
            userId,
        },
        success_url: returnUrl,
        cancel_url: returnUrl
    })
    return { data: stripeSession.url }
}

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { toastNotify } from '../../../../Helper';
import { orderSummaryProps } from '../Order/orderSummaryProps';
import { apiResponse, cartItemModel } from '../../../../Interfaces';
import { useCreateOrderMutation } from '../../../../apis/orderApi';
import { SD_Status } from '../../../../Utility/SD';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ data, userInput }: orderSummaryProps) =>
{
    const stripe = useStripe();
    const elements = useElements();
    const[createOrder] = useCreateOrderMutation();
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) =>
    {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements)
        {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsProcessing(true)

        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "https://example.com/order/123/complete",
            },
            redirect: "if_required",
        });

        if (result.error)
        {
            // Show error to your customer (for example, payment details incomplete)
           toastNotify("An unexpected error occurred.", "error")
           setIsProcessing(false)
        } else
        {
            let grandTotal = 0;
            let totalItems = 0;
            const orderDetailsDTO: any = [];
            data.cartItems?.forEach((item: cartItemModel) =>
            {
                const tempOrderDetail: any = {};
                tempOrderDetail["menuItemId"] = item.menuItem?.id;
                tempOrderDetail["quantity"] = item.quantity;
                tempOrderDetail["itemName"] = item.menuItem?.name;
                tempOrderDetail["price"] = item.menuItem?.price;
                orderDetailsDTO.push(tempOrderDetail);
                grandTotal += item.quantity! * item.menuItem?.price!;
                totalItems += item.quantity!;
            });


            const response: apiResponse = await createOrder({
                pickupName: userInput.name,
                pickupPhoneNumber: userInput.phoneNumber,
                pickupEmail: userInput.email,
                totalItems: totalItems,
                orderTotal: grandTotal,
                orderDetailsDTO: orderDetailsDTO,
                stripePaymentIntentID: data.stripePaymentIntentId,
                applicationUserId: data.userId,
                status:
                    result.paymentIntent.status === "succeeded"
                        ? SD_Status.CONFIRMED
                        : SD_Status.PENDING,
            });

            if (response)
            {
                if (response.data?.result.status === SD_Status.CONFIRMED)
                {
                    navigate(
                        `/order/orderConfirmed/${response.data.result.orderHeaderId}`
                    );
                } else
                {
                    navigate("/failed");
                }
            }

        }

        setIsProcessing(false);
    };


    return (
        <form onSubmit={handleSubmit} style={{ background: " #FF4433", paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", paddingBottom: "20px", border: "5px solid #FFBF00", borderRadius: "10px"}}>
            <PaymentElement />
            <button
                disabled={!stripe || isProcessing}
                className="btn mt-5 w-100"
                style={{ background: "#FFBF00", border: "5px solid #FF4433", borderRadius: "10px" }}
            >
                <span id="button-text">
                    {isProcessing ? "Processing ... " : "Submit Order"}
                </span>
            </button>
        </form>
    );
};

export default PaymentForm;
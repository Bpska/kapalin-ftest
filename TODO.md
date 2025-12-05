# Task: Modify Cart and Payment Flow

## Objective
Update the cart page so that clicking "Buy Now" navigates directly to the payment page, where customers can fill in their shipping details and proceed with payment.

## Steps
- [ ] Update Cart.tsx: Change navigation from '/checkout' to '/payment'
- [ ] Update Payment.tsx: Integrate shipping address form from Checkout.tsx
- [ ] Test the new flow: Cart → Payment (with address form and payment options)

## Files to Modify
- src/pages/Cart.tsx
- src/pages/Payment.tsx

## Notes
- Keep authentication check in Cart.tsx
- Store address data in sessionStorage as before
- Ensure form validation and error handling

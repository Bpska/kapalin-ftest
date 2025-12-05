-- Add INSERT policy for order_items
CREATE POLICY "Users can insert their own order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM orders WHERE id = order_id
  )
);
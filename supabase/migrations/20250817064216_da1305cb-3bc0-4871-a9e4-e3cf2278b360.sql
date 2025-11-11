-- Update the book's image_url to use the correct local import
UPDATE public.books 
SET image_url = NULL
WHERE title = 'Bhagavad Gita - Ancient Wisdom for Young Minds';
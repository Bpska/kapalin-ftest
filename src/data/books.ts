import { Book } from '@/contexts/CartContext';
import bookKrishna from '@/assets/book-krishna.jpg';
import bookChanakya from '@/assets/book-chanakya.jpg';
import bookGita from '@/assets/book-gita.jpg';
import bookHanuman from '@/assets/book-hanuman.jpg';

export const booksData: Book[] = [
  {
    id: '1',
    title: 'The Young Krishna\'s Adventures',
    description: 'Delightful tales of young Krishna\'s playful wisdom and divine love.',
    price: 299,
    image: bookKrishna,
    about: 'Join young Krishna as he embarks on magical adventures filled with wisdom, love, and joy. These beautifully illustrated stories bring ancient tales to life for modern children, teaching valuable lessons about friendship, courage, and the power of love through Krishna\'s enchanting escapades.',
    samplePages: [bookKrishna, bookKrishna, bookKrishna] // In a real app, these would be actual page images
  },
  {
    id: '2',
    title: 'Chanakya\'s Smart Tales',
    description: 'Clever stories teaching life lessons through Chanakya\'s wisdom.',
    price: 349,
    image: bookChanakya,
    about: 'Discover the timeless wisdom of Chanakya through engaging stories that teach children about intelligence, strategy, and making smart choices. Each tale is carefully crafted to impart valuable life lessons while entertaining young minds with clever plots and memorable characters.',
    samplePages: [bookChanakya, bookChanakya, bookChanakya]
  },
  {
    id: '3',
    title: 'Gita\'s Wisdom Stories',
    description: 'Simple stories from the Bhagavad Gita for young hearts and minds.',
    price: 399,
    image: bookGita,
    about: 'Experience the profound teachings of the Bhagavad Gita through child-friendly stories that focus on dharma, duty, and devotion. These tales help children understand important concepts like right and wrong, the importance of doing one\'s best, and finding inner peace through beautiful narratives.',
    samplePages: [bookGita, bookGita, bookGita]
  },
  {
    id: '4',
    title: 'Tales of Hanuman\'s Courage',
    description: 'Inspiring stories of bravery, devotion, and strength from Hanuman.',
    price: 329,
    image: bookHanuman,
    about: 'Follow Hanuman\'s incredible journey of courage and devotion through stories that inspire children to be brave, helpful, and kind. These tales showcase how even the biggest challenges can be overcome with determination, faith, and a good heart.',
    samplePages: [bookHanuman, bookHanuman, bookHanuman]
  }
];
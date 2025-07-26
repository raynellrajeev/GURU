# GURU

GURU is an AI-powered yoga chatbot that provides personalized guidance on asanas, meditation, and wellness. It leverages advanced natural language processing and embeddings to assist users in their yoga journey, helping them find balance, flexibility, and mindfulness anytime, anywhere.

## Features

- **Personalized Yoga Guidance**: Get tailored advice on yoga poses and practices based on your needs.
- **Meditation Support**: Receive guidance on meditation techniques to enhance your mental well-being.
- **Wellness Tips**: Access tips and information on maintaining a healthy lifestyle through yoga.
- **Interactive Chat**: Engage in a conversational interface that makes learning about yoga easy and enjoyable.
- **Source References**: Provides sources for responses to ensure transparency and reliability.
- **Real-Time Streaming**: Supports real-time response streaming for a seamless user experience.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Vercel AI SDK**: Simplifies AI integration for building conversational interfaces.
- **Pinecone**: A vector database for efficient similarity search and embeddings storage.
- **LangChain**: For document loading and text splitting.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **React Markdown**: For rendering markdown content in the chat interface.

## Installation

To get started with GURU, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/guru.git
   cd guru
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_pinecone_index_name
   PINECONE_ENVIRONMENT=your_pinecone_environment
   ```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## API Endpoints

- **Chat API**: Handles user queries and generates responses using embeddings and context.
  - File: [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts)
- **Store API**: Processes and stores document embeddings in Pinecone.
  - File: [`src/app/api/store/route.ts`](src/app/api/store/route.ts)

## Deployment

To deploy GURU, follow these steps:

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

3. Alternatively, deploy on platforms like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Vercel AI SDK Documentation](https://vercel.com/docs/ai) - Learn how to integrate AI into your applications.
- [Pinecone Documentation](https://docs.pinecone.io/) - Learn about vector databases and similarity search.
- [LangChain Documentation](https://docs.langchain.com/) - Learn about text processing and embeddings.

## Usage

Simply type your questions or prompts related to yoga in the chat interface, and GURU will provide you with responses based on its training and the context you provide.


## Contributing

Contributions are welcome! If you have ideas or improvements, feel free to open an issue or submit a pull request.

## License

This project is Open Source.

## Acknowledgments

- Special thanks to Dr.S.N Kumar and Dr.A.Jaiganesh, the authors of the book "Yoga Mudras for Physical and Mental Healthcare" for inspiring this project.

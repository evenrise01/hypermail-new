import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getEmbeddings(text: string) {
    const clean_text = text.replace(/\n/g,' ')
  try {
    // Create model instance for embeddings
    const model = genAI.getGenerativeModel({
      model: "text-embedding-004", // Using the newer embedding model
    });

    // Generate embeddings from the text
    const result = await model.embedContent(clean_text);
    
    const embedding = result.embedding;
    return embedding.values;

  } catch (error) {
    console.error("Error calling Gemini embeddings API:", error);
    throw error;
  }
}

// console.log((await getEmbeddings('Hello world')).length)

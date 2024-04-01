"use client"
import { ChangeEvent, useState, FormEvent } from "react"

export default function Home() {
   // State to manage the uploaded image and OpenAI API response
  const [ image, setImage ] = useState<string>("");
  const [ openAIResponse, setOpenAIResponse ] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Handle changes when a file is selected
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if(event.target.files === null) {
      window.alert("No image selected. Choose an image.")
      return;
    }
     // Get the selected file
    const file = event.target.files[0];

    // Convert the file to a base64 string
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    // Set the base64 string as the image
    reader.onload = () => {
      if(typeof reader.result === "string") {
        setImage(reader.result);
      }
    }

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setError("Error reading file. Please try again.");
  }

  }
  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    // Check if an image is uploaded
    if (image === "") {
      alert("Upload an image.");
      return;
    }
  
    try {
      // Make a POST request to the image analysis API
      const response = await fetch("api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image,
        }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      // Handle streaming text response from OpenAI API
      const reader = response.body?.getReader();
      setOpenAIResponse("");
  
      while (true) {
        const { done, value } = await reader?.read() || {};
  
        // Check if the response is done
        if (done) {
          break;
        }
  
        // Update the OpenAI response
        if (value) {
          var currentChunk = new TextDecoder().decode(value);
          setOpenAIResponse((prev) => prev + currentChunk);
        }
      }
    } catch (error) {
      console.error("Error during API request:", error);
  
      // Handle errors
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        alert("Failed to connect to the server. Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  }
  
  // Render the component
  return (
    <div className="min-h-screen flex items-center justify-center text-md">
      <div className='bg-white w-full max-w-2xl rounded-lg shadow-md p-8 text-black'>
      <h1 className='text-xl font-bold mb-4'>Image Analyzer V1.0 - Bryam Loaiza</h1>
        <h2 className='text-xl font-bold mb-4'>Uploaded Image</h2>
        { image !== "" ?
          <div className="mb-4 overflow-hidden">
            <img 
              src={image}
              className="w-full object-contain max-h-72"
            />
          </div>
        :
        <div className="mb-4 p-8 text-center">
          <p>Once you upload an image, you will see it here.</p>
        </div>
        }
        

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='flex flex-col mb-6'>
            <input
              type="file"
              className="text-sm border rounded-lg cursor-pointer"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          
          <div className='flex justify-center'>
            <button type="submit" className='p-2 bg-black rounded-md mb-4 text-white'>
              Get Image Description!
            </button>
          </div> 

        </form>

        {openAIResponse !== "" ?
        <div className="border-t border-gray-300 pt-4">
          <h2 className="text-xl font-bold mb-2">AI Response</h2>
          <p>{openAIResponse}</p>
        </div>
        :
        null
        }
        

      </div>
    </div>
  )
}

# PDF Highlighter 

## Project Overview

This project is a PDF viewer and keyword search application developed as part of the Adanomad Tech Consulting Challenge. It allows users to upload PDF documents, view them in a web browser, search for keywords, and highlight matching text.

## Challenge Notes - Hilus Keay

I chose to upload the PDF into the database using sqlite locally.

I based my implementation on the pre-existing Highlight database table.
My experience in full stack development has been with Svelte, so all of what I implemented was learned in the process of doing, and so there's likely much room for improvement.

This task reminded me very much of work I did for a previous co-op. It was at this previous co-op that I really developed my skill of "reverse engineering" a functioning product, to understand how it functions, and then use that understanding to implement new features.

I started by doing a CTRL-shift-F for highlight, which quickly led me to the api/get and api/update, as well as the relevant calls in App.tsx, HighlightStorage.ts, sqliteUtils.ts, supabase.ts and types.ts. I spent around an hour looking through these functions to understand how they worked together, and taking notes on where a pdf feature would need to be. 

After I felt I had a solid idea for my approach, I started writing my code.
- I knew I needed to add some new things: pdf type,  pdfStorage.ts file, 
- I also knew that I would need to add my SQLite code to the sqliteUtils file.
    - This code would save and process the pdf files for saving to the database
    - supabase would also have code for these calls.
- App.tsx would call my apis

Because I'm more familiar with svelte, it took a bit of time for me to debug and tweak my approach to work within Node (apparently FileReaders don't work within Node, but Buffers do, that took a bit of googling), but in the end I was able to get the feature implemented!

***One Bug I was unable to solve before the submission time, was that my implementation only saves files to the database when they are in the project directory. ***

***I did some more research into the problem I'm facing, and it turns out it's a limitation of my approach. From what I understand, I used Node's fs module to read the pdf data, but the browser can't provide fs with the full filepath it needs to work. I found a few different approaches online that would probably work better, and if I wasn't in school I'd invest the time implementing them before the deadline, because I thoroughly enjoyed this exercise. ***

***I've decided to submit what I have, because I'm proud of how much of the new framework I was able to learn in the short period of time I used, and also that I was able to see the pdfs appear in my DB Browser application. ***

***If this were a real task assigned to me on co-op, I would have continued to work at getting the feature to work, and tried the alternate approaches I found online, and if needed a few ideas I had myself (Formdata approach according to the internet, but I realized after that I could also have saved the images that the app makes anyway).  ***

***Thank you again!***

I thoroughly enjoyed this programming exercise, and if I had more time, I would do more research on refining the code I wrote, and would love to tackle the other features proposed.

## Features

- PDF document upload and display
- Page navigation (next, previous, jump to specific page)
- Zoom in/out functionality
- Document information display (total pages, current page)
- Keyword search across the entire PDF
- Text highlighting for search matches
- Sidebar for search results and navigation
- Responsive design for various screen sizes
- Persistent storage of highlights using SQLite or Supabase

## Technologies Used

- Next.js
- React 
- TypeScript
- react-pdf library for PDF rendering
- Tailwind CSS for stylinge
- SQLite for local highlight storage
- Supabase for cloud-based highlight storage (optional)

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the development server: `pnpm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/page.js`: Main entry point of the application
- `app/components/`: React components for various parts of the application
- `app/utils/`: Utility functions for PDF processing and highlight storage
- `app/styles/`: CSS files for styling
- `app/api/`: API routes for handling highlight operations

## Key Components

- `App.tsx`: Core application component
- `PdfViewer.tsx`: Handles PDF rendering and navigation
- `KeywordSearch.tsx`: Manages keyword search functionality
- `HighlightPopup.tsx`: Displays information about highlighted text
- `Sidebar.tsx`: Shows search results and navigation options
- `highlightStorage.ts`: Manages highlight storage operations
- `sqliteUtils.ts`: Handles SQLite database operations

## Features

- Has a highlight storage system supporting both SQLite and Supabase
- API routes for creating, retrieving, updating, and deleting highlights
- User authentication and document permissions (currently disabled)
- Export/import as JSON functionality for highlights
- Scroll the sidebar highlighted area into view across different PDFs. 


## Future Improvements

- Implement annotation tools (e.g., freehand drawing, text notes)
- Add support for multiple document search
- Pre-process batch PDFs for quicker highlights
- Enhance mobile responsiveness for better small-screen experience
- Optimize performance for large PDF files
- Upload the PDF into the database.

## License

[MIT License](https://opensource.org/licenses/MIT)

## Acknowledgements

- [Next.js](https://nextjs.org/) for the React framework
- [SQLite](https://www.sqlite.org/) for local database storage
- [Supabase](https://supabase.io/) for cloud database capabilities
- [react-pdf](https://github.com/wojtekmaj/react-pdf) for PDF rendering capabilities
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework

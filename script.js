let btn = document.querySelector(".submit-btn");

async function getAIResponse(prompt) {
    const output = document.getElementById("output");
    output.textContent = "Generating your Itinerary Plan...";

    try {
        const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDRZiqK3EFuVDuYCnR9iXgYhWHjWUP2hmE",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                {
                    parts: [{ text: `${prompt} 
                    Create a detailed 3-day, 3-night itinerary with the following format:

                    
                    - Make top heading BOLD and add a line after the top heading line [important]
                    - Add two blank space line after each day visit completion [very important]
                    - Use clear section headers for each day
                    - Include morning, afternoon, and evening activities
                    - Specify exact timings, locations, and durations
                    - List accommodation details
                    - Add travel/transport information between locations
                    - Keep it around 200 words

                    - If location name is not valid, please suggest to enter a correct location name
                    - If given locations is not possible to visit within the deadline, provide response the given locations are not possible to visit at the given 3 days of time interval, and then provide how to visit some of the location within the given time
                        

                    Format it as a clean text document with proper indentation and structure.` }],
                },
                ],
            }),
            }
        );

        const data = await res.json();
        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (result) {
            output.innerHTML = marked.parse(result);
        } else {
            output.textContent = "No response received";
        }
        console.log(result);
    } 
    catch (err) {
        console.error(err);
        output.textContent = "Error occurred";
    }
}


// handle form data, and preventing default behaviour of the form
let tripForm = document.querySelector("#trip-form");
let input = document.querySelector("input");
tripForm.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log(input.value);

    getAIResponse(input.value);
})



// function to download PDF using jsPDF library
// function downloadPDF() {
//     // get the output element content
//     const output = document.getElementById("output");
//     const content = output.innerText || output.textContent;
    
//     // create new jsPDF instance
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF();
    
//     // set font size
//     doc.setFontSize(12);

//     // adding text wrap
//     const splitText = doc.splitTextToSize(content, 180); // 180 is the max width
//     doc.text(splitText, 15, 15);

//     // set content to the pdf doc file
//     // doc.text(content, 15, 15);
    
//     // save the pdf
//     // doc.save("travel-itinerary.pdf");

//     // Prompt user for file name
//     let fileName = prompt("Enter a name for your PDF file:", "travel-itinerary");
//     if (!fileName) {
//         fileName = "document"; // fallback name
//     }

//     // Save the PDF with user-defined name
//     doc.save(fileName + ".pdf");
// }


function downloadPDF() {
    const output = document.getElementById("output");
    let content = output.innerText || output.textContent;

    // 🔹 Remove extra blank lines (multiple \n)
    content = content
        .split('\n')                  // split into lines
        .map(line => line.trim())     // trim each line
        .filter(line => line !== "")  // remove empty lines
        .join('\n');                  // join back

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    doc.setFontSize(11);
    const lineHeight = 6;
    const marginLeft = 15;
    const marginTop = 15;
    const pageHeight = doc.internal.pageSize.height;

    const lines = doc.splitTextToSize(content, 180); // width = 180mm
    let y = marginTop;

    lines.forEach((line) => {
        if (y + lineHeight > pageHeight - marginTop) {
            doc.addPage();
            y = marginTop;
        }
        doc.text(line, marginLeft, y);
        y += lineHeight;
    });

    // 🔹 Prompt for filename
    let fileName = prompt("Enter a name for your PDF file:", "travel-itinerary");
    if (!fileName) fileName = "document";
    doc.save(fileName + ".pdf");
}

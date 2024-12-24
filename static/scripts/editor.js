const content = document.getElementById('content');
// const filename = document.getElementById('title');
const titlebtn = document.getElementById('titleBtn');
const title = document.getElementById('title');
let tf = true

function editTitle() {
    if (tf) {
        title.contentEditable = true;
        titlebtn.textContent = "Set";
        tf = false;
    }
    else {
        const element = document.getElementById("start");
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: "smooth" // Optional for smooth scrolling
            });
        }
        title.contentEditable = false;
        titlebtn.textContent = "Edit Title";
        tf = true;
    }
}

function formatDoc(cmd, value = null) {
    if (value) {
        document.execCommand(cmd, false, value);
    } else {
        document.execCommand(cmd);  
    }
}

// function fileHandle(value) {
//     console.log("firstone works");
//     if (value === 'new') {
//         content.innerHTML = '';
//         filename.textContent = 'untitled';
//     } else if (value === 'txt') {
//         const blob = new Blob([content.innerText])
//         const url = URL.createObjectURL(blob)
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `${filename.textContent}.txt`;
//         link.click();
//     } else if (value === 'pdf') {
//         html2pdf(content).save(filename.textContent);
//     }
//     closePopup();
//     console.log(closePopup());
// }   

function changeFont(font) {
    const content = document.getElementById('content');
    const contentChildren = content.querySelectorAll('*');
    content.style.fontFamily = font;
    contentChildren.forEach(element => {
        element.style.fontFamily = font;
    });
}

// const content = document.getElementById('content');
let filenameInput = title.textContent;

function fileHandle(value) {
    console.log(filenameInput);

    // Temporarily set text color to black for saving
    const originalColor = content.style.color;
    content.style.color = 'black';

    if (value === 'new') {
        content.innerHTML = '';
        filenameInput = 'untitled';
        content.style.color = originalColor; // Restore the original color
    } else if (value === 'txt') {
        const blob = new Blob([content.innerText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filenameInput.replace(/[<>:"/\\|?*]+/g, '')}.txt`;
        link.click();
        URL.revokeObjectURL(url)
        content.style.color = originalColor;
    } else if (value === 'pdf') {
        const sanitizedFilename = filenameInput.replace(/[<>:"/\\|?*]+/g, '');
        const opt = {
            filename: `${sanitizedFilename}.pdf`,
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
        };

        html2pdf()
            .set(opt)
            .from(content)
            .save()
            .then(() => {
                // Restore the original text color after saving
                content.style.color = originalColor;
            });
    }

    // Ensure closePopup is defined or remove this line if unnecessary
    if (typeof closePopup === 'function') {
        closePopup();
    }
}


// Function to trigger file input for loading
function loadFile() {
    const fileInput = document.getElementById('file-input');
    fileInput.click(); // Trigger file input when button is clicked
}

// Function to handle file loading
function handleFileLoad(event) {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") { // Ensure it's a .txt file
        const reader = new FileReader();
        reader.onload = function (e) {
            content.innerText = e.target.result; // Set the file content in editor
            filename.value = file.name.replace(".txt", ""); // Set filename without extension
        };
        reader.readAsText(file); // Read file as text
    } else {
        alert("Please upload a valid .txt file.");
    }
}

// POPUP
// Function to show the popup with a custom message
function showPopup(message, id) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');


    popupMessage.textContent = message; // Set the message in the popup
    popup.style.display = 'flex'; // Show the popup

    const popupclose = document.getElementById('closePopupButton');
    popupclose.style.visibility = 'visible';
    switch (id) {
        case 0:
            break;
        case 1:
            const savediv = document.querySelector(".popupdiv")
            savediv.style.visibility = 'visible';
            break;
        default:
            break;
    }


    // if(id == 0){

    // }
    // else if(id == 1){
    // 	const savediv = document.querySelector(".popupdiv")
    // 	savediv.style.visibility = 'visible';
    // }

}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // Hide the popup
}

function cook() {
    // GETTING DATA 
    const data = document.getElementById("content").innerText;
    const words = data.split(" ");
    const last30Words = words.slice(-30).join(" ");
    const genre = document.getElementById("genre-selector");
    var value = genre.value;

    // Additional data to send along with the story
    const additionalData = value;

    // REQUEST
    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            story: last30Words,
            extraInfo: additionalData // Adding additional data
        })
    })
        .then(response => response.json())
        .then(data => {
            // Process the server response
            let generatedStory = data.message;
            const words = generatedStory.split(" ");
            generatedStory = words.slice(2).join(" ");

            choicediv(generatedStory, "storyClass", content);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("content").innerText += "An error occurred!";
        });
}


function choicediv(story_output, classname, targetdiv) {
    const existingContent = targetdiv.innerText;

    const existingWords = existingContent.split(" ");
    const storyWords = story_output.split(" ");

    let divergenceIndex = 0;
    while (divergenceIndex < storyWords.length && existingWords.includes(storyWords[divergenceIndex])) {
        divergenceIndex++;
    }

    let uniqueStoryPart = storyWords.slice(divergenceIndex).join(" ");

    const newDiv = document.createElement("div");
    uniqueStoryPart = story_output // for new mistral
    newDiv.textContent = uniqueStoryPart;
    newDiv.classList.add(classname.replace('.', '')); // Add CSS class without the period

    // Create the button to add content to the main story
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Add to story"; //
    

    // Event listener for button to append content and remove the div
    deleteButton.addEventListener("click", function () {
        targetdiv.textContent += " " + uniqueStoryPart; // Append only the unique part
        newDiv.remove();
    });

    const removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove"; // Using innerHTML to prevent text addition

    // Event listener for button to append content and remove the div
    removeButton.addEventListener("click", function () {
        newDiv.remove();
    });

    // Append button to the new div and add new div to container
    newDiv.appendChild(deleteButton);
    newDiv.appendChild(removeButton);
    document.querySelector('.container').appendChild(newDiv)
    
    updateWordCount();
}

let darkmode = localStorage.getItem('darkmode')
const themeswitch = document.getElementById('check')

const enableDarkmode = () =>{
    // document.querySelector(".toggle").style.backgroundColor = "#710071"
    // document.querySelector(".icon").src = "../static/images/iconwhite.png"
    // document.getElementById("ol").querySelector("path").style.fill = '#664a5e';
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () =>{
    // document.querySelector(".toggle").style.backgroundColor = "wheat"
    // document.querySelector(".icon").src = "../static/images/icon.png"
    // document.getElementById("ol").querySelector("path").style.fill = 'black';
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', 'null')
}

if (darkmode === 'active') enableDarkmode()

themeswitch.addEventListener("click", ()=>{
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})

const wordCountDisplay = document.getElementById("wordcount");

function countWords() {
    const text = content.textContent;
    console.log(text)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
}

// Update word count display
function updateWordCount() {
    wordCountDisplay.innerText = countWords();
}

// Add an event listener to update the word count as the user types
content.addEventListener('input', updateWordCount);
content.addEventListener('click', updateWordCount);
content.addEventListener('added', updateWordCount);
// Initialize the word count on page load
updateWordCount();

function publishStory() {
    const title = document.getElementById('title').textContent.trim();
    const author = document.getElementById('author-name') ? document.getElementById('author-name').textContent.trim() : "Anonymous";
    const story = document.getElementById('content').innerHTML.trim(); // Use innerHTML for formatting

    const params = new URLSearchParams({ title, author, story });
    window.location.href = `/publish?${params.toString()}`;
}

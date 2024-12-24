function saveToDB() {
    const title = document.getElementById('story-title').textContent.trim();
    const author = document.getElementById('story-author').textContent.trim();
    const story = document.getElementById('story-content').innerHTML.trim();

    fetch('/publish', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, story })
    })
    .then(response => response.json())
    .then(result => {
        alert(result.message);
    })
    .catch(error => console.error('Error:', error));
}
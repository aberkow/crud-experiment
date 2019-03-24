const fallbackEditor = document.querySelector('#fallback-editor');
const form = document.querySelector('form[id$="-form"]');

const quill = new Quill('#editor', {
  theme: 'snow'
});

if (quill) {
  fallbackEditor.remove();
}

form.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  
  const id = form.getAttribute('data-postID')
  const postTitle = document.querySelector('#post-title').value
  const postContent = quill.getText()

  await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        postTitle,
        postContent
      }
    })
  })
    .then(res => {

      const message = document.querySelector('.message')
      
      if (!res.ok) {
        message.innerText = 'Something went wrong'
      }

      message.innerText = 'Post Updated'

    })
    .catch(err => {
      console.log(err, 'err');
    })
})
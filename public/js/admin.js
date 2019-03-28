const fallbackEditor = document.querySelector('#fallback-editor');
const form = document.querySelector('form[id$="-form"]');

const quill = new Quill('#editor', {
  theme: 'snow'
});

if (quill) {
  fallbackEditor.remove();
}

// set the value of the hidden input as people type into the editor.
// this is probably really insecure so I need a different way of handling this.
quill.on('text-change', () => {
  const hidden = document.querySelector('[name=editor]')
  hidden.value = quill.root.innerHTML
})


form.addEventListener('submit', async (evt) => {
  evt.preventDefault()

  const id = form.getAttribute('data-postID')
  const postTitle = document.querySelector('#post-title').value
  const postName = postTitle.toLowerCase().split(' ').join('-')
  const postContent = document.querySelector('[name=editor]').value

  await fetch(`/admin/posts/${id}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        postTitle,
        postName,
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


// form.addEventListener('submit', async (evt) => {
//   evt.preventDefault();
  
//   const postContent = quill.getText()

//   await fetch(`/api/posts/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       data: {
//         postTitle,
//         postName,
//         postContent
//       }
//     })
//   })
//     .then(res => {

//       const message = document.querySelector('.message')
      
//       if (!res.ok) {
//         message.innerText = 'Something went wrong'
//       }

//       message.innerText = 'Post Updated'

//     })
//     .catch(err => {
//       console.log(err, 'err');
//     })
// })
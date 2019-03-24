const fallbackEditor = document.querySelector('#fallback-editor');

const quill = new Quill('#editor', {
  theme: 'snow'
});

if (quill) {
  fallbackEditor.remove();
}
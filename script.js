const create_btn = document.querySelector('.custom-btn')
const input_block = document.querySelector('.input-block')

create_btn.addEventListener('click', function() {
    input_block.style.display = "flex"
    create_btn.style.display = "none"
})
// document.querySelectorAll('[api]').forEach(btn => {
//     btn.addEventListener('click', () => {
//         const apiName = btn.dataset.api;

//         document.querySelectorAll('.api-container').forEach(el => {
//             el.style.display = 'none';
//         });

//         document.getElementById('$api-{apiName}').style.display = 'block';
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.api-nav button').forEach(btn => {
        btn.addEventListener('click', () => {
            const apiName = btn.getAttribute('api');
            console.log(apiName);

            document.querySelectorAll('.api-container').forEach(cont => {
                cont.style.display = 'none';
            });

            document.getElementById(`api-${apiName}`).style.display = 'block';
        });
    });

    document.querySelector('.api-nav button').click();
});
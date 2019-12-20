const socket = io();

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated', count);
    
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked');
//     socket.emit('increment');
// })

//Elements
const $messageForm = document.querySelector('#message-form');
const $sendLocationButton = document.querySelector('#send-location')
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text, 
        createdAt: moment(message.createdAt).format('H:mm')
        });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locatioMessage', (message) => {
    console.log(message);
    const html = Mustache.render(locationTemplate, { 
        url: message.url,
        createdAt: moment(message.createdAt).format('H:mm')
    });
    $messages.insertAdjacentHTML('beforeend', html)
    
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled');
   
    // const message = document.querySelector('input').value;
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        //enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error)
        }

        console.log('Message is delivered!')
    })
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }

    //disabled
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position);

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {

            //enable
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location shared!');
        })
    })
});

socket.emit('join', { username, room })
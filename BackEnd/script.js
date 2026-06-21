function sendEmail() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    var data = {
        name: name,
        email: email,
        message: message
    };

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Configure it: POST-method, URL, asynchronous
    xhr.open('POST', 'sendEmail.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Send the request with the form data
    xhr.send('data=' + JSON.stringify(data));

    // This will be called after the response is received
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Handle the server's response
            console.log(xhr.responseText);
        }
    };
}

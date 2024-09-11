var generated_id = random_string(5)

var peer = new Peer(generated_id);
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });

peer.on('connection', function(conn) {
    console.log("Connected: "+conn)
});

var conn = null

function setPeer(id){
    conn = peer.connect(id);
    
    
    conn.on('open', function() {
        console.log("Connection open.")
        // Receive messages
        conn.on('data', function(data) {
          console.log('Received', data);
        });
    
        // Send messages
        conn.send('Hello!');
      });
    
}


peer.on('message', function(message) {
    console.log(message)
});


function random_string(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUBWXYZAAAAEEEEIIIIOOOOUUUU';
    
    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
}
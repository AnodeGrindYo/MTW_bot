var Client = require('mysql').Client;
var client = new Client(); 
client.host ='some.host.com';
client.user = 'user';
client.password = 'password';
console.log("connection en cours...");
client.connect(function(err, results) 
{
    if (err) 
    {
        console.log("ERREUR: " + err.message);
        throw err;
    }
    console.log("connecté... YEAH!!!");
    clientConnected(client);
});

clientConnected = function(client)
{
	tableHasData(client);
}           


tableHasData = function(client)
{
    client.query(
        'SELECT * FROM db.table LIMIT 0,10',
        function selectCb(err, results, fields) 
        {
            if (err) 
            {
                console.log("ERREUR: " + err.message);
                throw err;
            }
            console.log("Obtenu "+results.length+" Ligne:");
            for(var i in results){
			 
				console.log(results[i].[column name]); 
				console.log('\n');
				
            //console.log("meta data about the columns:");
            //console.log(fields);     
			}
            client.end();
        });
};